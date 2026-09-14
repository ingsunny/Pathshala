import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { readSession } from "@/lib/auth";
import Certificate from "@/models/certificateModal";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = readSession(request);
    if (!session?.sub) {
      return NextResponse.json({ message: "Please log in" }, { status: 401 });
    }

    await connect();
    const certificates = await Certificate.find({ user_id: session.sub }).lean();
    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("Certificate lookup failed", error);
    return NextResponse.json(
      { message: "Unable to load certificates" },
      { status: 500 }
    );
  }
}
