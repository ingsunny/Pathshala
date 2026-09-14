import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { readSession } from "@/lib/auth";
import { getUserView } from "@/lib/user-view";
import Course from "@/models/courseModel";
import User from "@/models/userModel";

export async function POST(request) {
  try {
    const session = readSession(request);
    if (!session?.sub) {
      return NextResponse.json({ message: "Please log in" }, { status: 401 });
    }

    const { courseId, topicId } = await request.json();
    if (!courseId || !topicId) {
      return NextResponse.json({ message: "Course and lesson are required" }, { status: 400 });
    }

    await connect();
    const [user, course] = await Promise.all([
      User.findById(session.sub),
      Course.findById(courseId).lean(),
    ]);
    if (!user || !course) {
      return NextResponse.json({ message: "User or course not found" }, { status: 404 });
    }

    const enrollment = user.enrollments.find((item) => item.courseId.toString() === courseId);
    if (!enrollment) {
      return NextResponse.json({ message: "Course is not enrolled" }, { status: 403 });
    }

    const topicIds = course.syllabus.flatMap((chapter) =>
      chapter.topics.map((topic) => topic._id.toString())
    );
    if (!topicIds.includes(topicId)) {
      return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
    }

    if (!enrollment.completedTopicIds.some((id) => id.toString() === topicId)) {
      enrollment.completedTopicIds.push(topicId);
    }
    enrollment.progressPercent = Math.round((enrollment.completedTopicIds.length / topicIds.length) * 100);
    await user.save();

    return NextResponse.json({
      message: "Lesson completed",
      user: await getUserView(user),
    });
  } catch (error) {
    console.error("Course progress update failed", error);
    return NextResponse.json({ message: "Unable to update course progress" }, { status: 500 });
  }
}
