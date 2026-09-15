import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Course from "@/models/courseModel";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connect();
    const courses = await Course.find().lean();
    const publicCourses = courses.map((course) => ({
      ...course,
      finalAssessment: course.finalAssessment
        ? {
            title: course.finalAssessment.title,
            durationMinutes: course.finalAssessment.durationMinutes,
            passingScore: course.finalAssessment.passingScore,
            questionCount: course.finalAssessment.questions?.length || 0,
          }
        : null,
    }));
    return NextResponse.json({ courses: publicCourses });
  } catch (error) {
    console.error("Course lookup failed", error);
    return NextResponse.json(
      { message: "Unable to load courses" },
      { status: 500 },
    );
  }
}
