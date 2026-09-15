import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { readSession } from "@/lib/auth";
import Course from "@/models/courseModel";
import User from "@/models/userModel";

export async function POST(request) {
  try {
    const session = readSession(request);
    if (!session?.sub) {
      return NextResponse.json({ message: "Please log in" }, { status: 401 });
    }

    await connect();
    const admin = await User.findById(session.sub).select("isAdmin");
    if (!admin?.isAdmin) {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 },
      );
    }

    const course = await Course.create(await request.json());
    return NextResponse.json(
      { message: "Course created", course },
      { status: 201 },
    );
  } catch (error) {
    console.error("Course creation failed", error);
    return NextResponse.json(
      { message: "Unable to create course" },
      { status: 500 },
    );
  }
}
