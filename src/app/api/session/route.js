import { connect } from "@/dbConfig/dbConfig";
import { readSession } from "@/lib/auth";
import { getUserView } from "@/lib/user-view";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

    return NextResponse.json({ user: await getUserView(user) });
  } catch (error) {
    console.error("Session lookup failed", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
