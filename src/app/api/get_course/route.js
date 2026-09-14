import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Course from "@/models/courseModel";

export async function GET() {
  try {
    await connect();
    const courses = await Course.find().lean();
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Course lookup failed", error);
    return NextResponse.json(
      { message: "Unable to load courses" },
      { status: 500 }
    );
  }
}
