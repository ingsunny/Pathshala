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
    const { name, email, photoUrl } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connect();
    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: await bcryptjs.hash(crypto.randomUUID(), 10),
        photoUrl,
      });
    }

    const response = NextResponse.json({
      message: "Login successful",
      user: safeUser(user),
    });
    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken(user),
      sessionCookieOptions()
    );

    return response;
  } catch (error) {
    console.error("Google sign-in failed", error);
    return NextResponse.json({ message: "Unable to sign in" }, { status: 500 });
  }
}
