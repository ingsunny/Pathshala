import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import {
  createSessionToken,
  safeUser,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";
import User from "@/models/userModel";

export async function POST(request) {
  try {
    const { firstName, lastName, email, password, phone } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "Please complete all required fields" },
        { status: 400 }
      );
    }

    await connect();
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const user = await User.create({
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: normalizedEmail,
      password: await bcryptjs.hash(password, 10),
      phone,
    });

    const response = NextResponse.json(
      { message: "Account created", user: safeUser(user) },
      { status: 201 }
    );
    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken(user),
      sessionCookieOptions()
    );

    return response;
  } catch (error) {
    console.error("Signup failed", error);
    return NextResponse.json(
      { message: "Unable to create account" },
      { status: 500 }
    );
  }
}
