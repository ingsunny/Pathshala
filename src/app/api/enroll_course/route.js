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

    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json({ message: "Course is required" }, { status: 400 });
    }

    await connect();
    const [user, course] = await Promise.all([
      User.findById(session.sub),
      Course.findById(courseId),
    ]);

    if (!user || !course) {
      return NextResponse.json({ message: "User or course not found" }, { status: 404 });
    }

    if (user.enrollments.some((item) => item.courseId.toString() === courseId)) {
      return NextResponse.json({ message: "Already enrolled" }, { status: 409 });
    }

    user.enrollments.push({ courseId: course._id });
    await user.save();

    return NextResponse.json({
      message: "Course enrolled",
      user: await getUserView(user),
    });
  } catch (error) {
    console.error("Course enrollment failed", error);
    return NextResponse.json({ message: "Unable to enroll" }, { status: 500 });
  }
}
