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

  const certificateId = `${crypto.randomBytes(4).toString("hex").toUpperCase()}-PATHSHALA`;
  const templatePath = path.join(process.cwd(), "public", "certificate_example.pdf");
  const outputDirectory = path.join(process.cwd(), "public", "uploads", "certificates");
  await fs.mkdir(outputDirectory, { recursive: true });

  const pdf = await PDFDocument.load(await fs.readFile(templatePath));
  const page = pdf.getPages()[0];
  const { width } = page.getSize();
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lines = [
    { text: user.name, y: 442, size: 27, font: serif, color: rgb(0, 0, 0) },
    { text: `For successfully completing the Pathshala ${course.name} course on`, y: 400, size: 15, font: sans, color: rgb(0.2, 0.19, 0.21) },
    { text: date, y: 380, size: 15, font: sans, color: rgb(0.2, 0.19, 0.21) },
    { text: `Final assessment score: ${score}%`, y: 355, size: 13, font: sans, color: rgb(0.08, 0.45, 0.35) },
    { text: "Pathshala wishes you the best for your future endeavours.", y: 330, size: 15, font: sans, color: rgb(0.2, 0.19, 0.21) },
    { text: `Certificate Id: ${certificateId}`, y: 140, size: 10, font: sans, color: rgb(0.55, 0.54, 0.56) },
    { text: `Date of certification: ${date}`, y: 120, size: 10, font: sans, color: rgb(0.55, 0.54, 0.56) },
    { text: "Verify in Pathshala using the certificate ID above", y: 96, size: 10, font: sans, color: rgb(0.55, 0.54, 0.56) },
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
