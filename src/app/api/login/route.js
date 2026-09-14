import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";
import User from "@/models/userModel";
import { getUserView } from "@/lib/user-view";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connect();
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: "Login successful",
      user: await getUserView(user),
    });
    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken(user),
      sessionCookieOptions()
    );

    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ message: "Unable to log in" }, { status: 500 });
  }
}
