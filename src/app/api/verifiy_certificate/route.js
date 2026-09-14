import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Certificate from "@/models/certificateModal";

export async function POST(request) {
  try {
    const { verificationId } = await request.json();
    if (!verificationId) {
      return NextResponse.json(
        { message: "Certificate ID is required" },
        { status: 400 }
      );
    }

    await connect();
    const certificate = await Certificate.findOne({
      certificateId: verificationId.trim().toUpperCase(),
    }).lean();

    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ certificate });
  } catch (error) {
    console.error("Certificate verification failed", error);
    return NextResponse.json(
      { message: "Unable to verify certificate" },
      { status: 500 }
    );
  }
}
