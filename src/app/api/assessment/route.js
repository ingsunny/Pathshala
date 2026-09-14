import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { readSession } from "@/lib/auth";
import { issueCertificate } from "@/lib/certificate";
import { getUserView } from "@/lib/user-view";
import Course from "@/models/courseModel";
import User from "@/models/userModel";

function clientQuestions(assessment) {
  return assessment.questions.map((question, index) => ({
    id: question._id.toString(),
    number: index + 1,
    prompt: question.prompt,
    options: question.options,
  }));
}

export async function POST(request) {
  try {
    const session = readSession(request);
    if (!session?.sub) return NextResponse.json({ message: "Please log in" }, { status: 401 });

    const { action, courseId, answers = [] } = await request.json();
    if (!courseId || !["start", "submit"].includes(action)) {
      return NextResponse.json({ message: "A valid assessment action is required" }, { status: 400 });
    }

    await connect();
    const [user, course] = await Promise.all([
      User.findById(session.sub),
      Course.findById(courseId).select("+finalAssessment.questions.correctOption +finalAssessment.questions.explanation"),
    ]);
    if (!user || !course?.finalAssessment?.questions?.length) {
      return NextResponse.json({ message: "Assessment not found" }, { status: 404 });
    }

    const enrollment = user.enrollments.find((item) => item.courseId.toString() === courseId);
    if (!enrollment) return NextResponse.json({ message: "Course is not enrolled" }, { status: 403 });

    const totalLessons = course.syllabus.reduce((sum, chapter) => sum + chapter.topics.length, 0);
    if (enrollment.completedTopicIds.length < totalLessons) {
      return NextResponse.json({
        message: "Complete every lesson before starting the final assessment",
        completedLessons: enrollment.completedTopicIds.length,
        totalLessons,
      }, { status: 403 });
    }

    const result = enrollment.assessmentResult;
    if (action === "start") {
      if (result.status === "passed") {
        return NextResponse.json({ status: "passed", score: result.bestScore });
      }

      const now = new Date();
      const active = result.status === "in_progress" && result.expiresAt > now;
      if (!active) {
        result.status = "in_progress";
        result.startedAt = now;
        result.expiresAt = new Date(now.getTime() + course.finalAssessment.durationMinutes * 60_000);
        await user.save();
      }

      return NextResponse.json({
        status: "in_progress",
        title: course.finalAssessment.title,
        durationMinutes: course.finalAssessment.durationMinutes,
        passingScore: course.finalAssessment.passingScore,
        expiresAt: result.expiresAt,
        questions: clientQuestions(course.finalAssessment),
      });
    }

    if (result.status !== "in_progress" || !result.expiresAt) {
      return NextResponse.json({ message: "Start the assessment before submitting" }, { status: 409 });
    }
    if (new Date() > new Date(result.expiresAt.getTime() + 10_000)) {
      result.status = "failed";
      result.attempts += 1;
      result.lastScore = 0;
      result.submittedAt = new Date();
      await user.save();
      return NextResponse.json({ message: "The assessment time has expired", score: 0, passed: false }, { status: 408 });
    }

    const submitted = new Map(answers.map((answer) => [answer.questionId, Number(answer.option)]));
    const correct = course.finalAssessment.questions.reduce(
      (count, question) => count + (submitted.get(question._id.toString()) === question.correctOption ? 1 : 0),
      0
    );
    const score = Math.round((correct / course.finalAssessment.questions.length) * 100);
    const passed = score >= course.finalAssessment.passingScore;
    result.status = passed ? "passed" : "failed";
    result.attempts += 1;
    result.lastScore = score;
    result.bestScore = Math.max(result.bestScore || 0, score);
    result.submittedAt = new Date();
    result.startedAt = undefined;
    result.expiresAt = undefined;
    await user.save();

    const certificate = passed ? await issueCertificate({ user, course, score }) : null;
    return NextResponse.json({
      status: result.status,
      passed,
      score,
      correct,
      total: course.finalAssessment.questions.length,
      passingScore: course.finalAssessment.passingScore,
      certificateUrl: certificate?.certificateDownloadUrl,
      user: await getUserView(user),
    });
  } catch (error) {
    console.error("Assessment request failed", error);
    return NextResponse.json({ message: "Unable to process assessment" }, { status: 500 });
  }
}
