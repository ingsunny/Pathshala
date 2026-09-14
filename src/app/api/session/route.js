import { connect } from "@/dbConfig/dbConfig";
import { readSession, safeUser } from "@/lib/auth";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const session = readSession(request);

    if (!session?.sub) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    await connect();
    const user = await User.findById(session.sub);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: safeUser(user) });
  } catch (error) {
    console.error("Session lookup failed", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
