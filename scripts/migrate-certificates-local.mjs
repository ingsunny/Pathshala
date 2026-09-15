import fs from "fs/promises";
import path from "path";
import { MongoClient } from "mongodb";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const certificates = client.db().collection("certificates");
const records = await certificates.find({}).toArray();
const directory = path.join(process.cwd(), "public", "uploads", "certificates");
await fs.mkdir(directory, { recursive: true });

function centeredX(font, text, size, width) {
  return (width - font.widthOfTextAtSize(text, size)) / 2;
}

async function renderCertificate(certificate) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const { width, height } = page.getSize();
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const date = new Date(
    certificate.date_of_completion || certificate.createdAt || Date.now(),
  ).toLocaleDateString("en-US", {
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

  const score = Number.isFinite(certificate.assessment_score)
    ? `Final assessment score  ${certificate.assessment_score}%`
    : "All course requirements completed";
  const lines = [
    ["This certifies that", 420, 14, sans, rgb(0.39, 0.45, 0.42)],
    [certificate.username, 365, 38, serif, rgb(0.08, 0.14, 0.11)],
    [
      "has successfully completed the learning path",
      325,
      14,
      sans,
      rgb(0.39, 0.45, 0.42),
    ],
    [certificate.course_name, 276, 27, serif, rgb(0.09, 0.42, 0.3)],
    [score, 230, 13, sans, rgb(0.25, 0.34, 0.29)],
    [date, 178, 12, sans, rgb(0.35, 0.44, 0.39)],
    [
      `Credential ID  ${certificate.certificateId}`,
      78,
      9,
      sans,
      rgb(0.42, 0.49, 0.45),
    ],
    ["Verify this credential at Northstar", 60, 9, sans, rgb(0.42, 0.49, 0.45)],
  ];

  for (const [text, y, size, font, color] of lines) {
    page.drawText(text, {
      x: centeredX(font, text, size, width),
      y,
      size,
      font,
      color,
    });
  }

  return Buffer.from(await pdf.save());
}

for (const certificate of records) {
  const filename = `${certificate.certificateId}.pdf`;
  await fs.writeFile(
    path.join(directory, filename),
    await renderCertificate(certificate),
  );
  const update = {
    certificateDownloadUrl: `/uploads/certificates/${filename}`,
    storageProvider: "local",
  };
  if (/^https?:\/\//.test(certificate.certificateDownloadUrl || "")) {
    update.archivedSourceUrl = certificate.certificateDownloadUrl;
  }
  await certificates.updateOne({ _id: certificate._id }, { $set: update });
}

console.log(
  JSON.stringify({ found: records.length, migrated: records.length }),
);
await client.close();
