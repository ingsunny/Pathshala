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
    const { idToken } = await request.json();

    if (!idToken || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return NextResponse.json(
        { message: "Invalid Google sign-in" },
        { status: 400 },
      );
    }

    const verification = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
      },
    );
    const verifiedAccount = await verification.json();
    const googleUser = verifiedAccount.users?.[0];

    if (!verification.ok || !googleUser?.email || !googleUser.emailVerified) {
      return NextResponse.json(
        { message: "Google identity could not be verified" },
        { status: 401 },
      );
    }

    await connect();
    const normalizedEmail = googleUser.email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: googleUser.displayName || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: await bcryptjs.hash(crypto.randomUUID(), 10),
        photoUrl: googleUser.photoUrl,
      });
    } else {
      user.name = googleUser.displayName || user.name;
      user.photoUrl = googleUser.photoUrl || user.photoUrl;
      user.isVerified = true;
      await user.save();
    }

    const response = NextResponse.json({
      message: "Login successful",
      user: await getUserView(user),
    });
    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken(user),
      sessionCookieOptions(),
    );

    return response;
  } catch (error) {
    console.error("Google sign-in failed", error);
    return NextResponse.json({ message: "Unable to sign in" }, { status: 500 });
  }
}
