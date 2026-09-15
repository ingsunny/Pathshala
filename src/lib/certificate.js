import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import Certificate from "@/models/certificateModal";

function centeredX(font, text, size, width) {
  return (width - font.widthOfTextAtSize(text, size)) / 2;
}

export async function issueCertificate({ user, course, score }) {
  const existing = await Certificate.findOne({
    user_id: user._id.toString(),
    course_id: course._id.toString(),
  });
  if (existing) return existing;

  const certificateId = `${crypto.randomBytes(4).toString("hex").toUpperCase()}-NORTHSTAR`;
  const outputDirectory = path.join(
    process.cwd(),
    "public",
    "uploads",
    "certificates",
  );
  await fs.mkdir(outputDirectory, { recursive: true });

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const { width, height } = page.getSize();
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.984, 0.992, 0.973),
  });
  page.drawRectangle({
    x: 22,
    y: 22,
    width: width - 44,
    height: height - 44,
    borderColor: rgb(0.09, 0.42, 0.3),
    borderWidth: 2,
  });
  page.drawCircle({
    x: 92,
    y: height - 88,
    size: 28,
    color: rgb(0.09, 0.42, 0.3),
  });
  page.drawText("N", {
    x: 82,
    y: height - 98,
    size: 24,
    font: sans,
    color: rgb(1, 1, 1),
  });
  page.drawText("NORTHSTAR", {
    x: 132,
    y: height - 94,
    size: 18,
    font: sans,
    color: rgb(0.09, 0.23, 0.17),
  });
  page.drawText("CERTIFICATE OF COMPLETION", {
    x: width - 295,
    y: height - 94,
    size: 10,
    font: sans,
    color: rgb(0.35, 0.44, 0.39),
  });
  const lines = [
    {
      text: "This certifies that",
      y: 420,
      size: 14,
      font: sans,
      color: rgb(0.39, 0.45, 0.42),
    },
    {
      text: user.name,
      y: 365,
      size: 38,
      font: serif,
      color: rgb(0.08, 0.14, 0.11),
    },
    {
      text: "has successfully completed the learning path",
      y: 325,
      size: 14,
      font: sans,
      color: rgb(0.39, 0.45, 0.42),
    },
    {
      text: course.name,
      y: 276,
      size: 27,
      font: serif,
      color: rgb(0.09, 0.42, 0.3),
    },
    {
      text: `Final assessment score  ${score}%`,
      y: 230,
      size: 13,
      font: sans,
      color: rgb(0.25, 0.34, 0.29),
    },
    { text: date, y: 178, size: 12, font: sans, color: rgb(0.35, 0.44, 0.39) },
    {
      text: `Credential ID  ${certificateId}`,
      y: 78,
      size: 9,
      font: sans,
      color: rgb(0.42, 0.49, 0.45),
    },
    {
      text: "Verify this credential at Northstar",
      y: 60,
      size: 9,
      font: sans,
      color: rgb(0.42, 0.49, 0.45),
    },
  ];
  for (const line of lines) {
    page.drawText(line.text, {
      x: centeredX(line.font, line.text, line.size, width),
      y: line.y,
      size: line.size,
      font: line.font,
      color: line.color,
    });
  }

  const filename = `${certificateId}.pdf`;
  await fs.writeFile(path.join(outputDirectory, filename), await pdf.save());
  return Certificate.create({
    user_id: user._id.toString(),
    username: user.name,
    course_id: course._id.toString(),
    course_name: course.name,
    course_category: course.category,
    certificateId,
    certificateDownloadUrl: `/uploads/certificates/${filename}`,
    assessment_score: score,
    storageProvider: "local",
  });
}
