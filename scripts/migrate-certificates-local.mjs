import fs from "fs/promises";
import path from "path";
import { MongoClient } from "mongodb";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const certificates = client.db().collection("certificates");
const remoteCertificates = await certificates.find({ certificateDownloadUrl: /^https?:\/\// }).toArray();
const directory = path.join(process.cwd(), "public", "uploads", "certificates");
await fs.mkdir(directory, { recursive: true });
let migrated = 0;

for (const certificate of remoteCertificates) {
  const response = await fetch(certificate.certificateDownloadUrl);
  const filename = `${certificate.certificateId}.pdf`;
  let bytes;
  if (response.ok) {
    bytes = Buffer.from(await response.arrayBuffer());
  } else {
    const pdf = await PDFDocument.load(await fs.readFile(path.join(process.cwd(), "public", "certificate_example.pdf")));
    const page = pdf.getPages()[0];
    const { width } = page.getSize();
    const serif = await pdf.embedFont(StandardFonts.TimesRoman);
    const sans = await pdf.embedFont(StandardFonts.Helvetica);
    const date = new Date(certificate.date_of_completion || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const draw = (text, y, size, font, color) => page.drawText(text, { x: (width - font.widthOfTextAtSize(text, size)) / 2, y, size, font, color });
    draw(certificate.username, 442, 27, serif, rgb(0, 0, 0));
    draw(`For successfully completing the Pathshala ${certificate.course_name} course on`, 400, 15, sans, rgb(0.2, 0.19, 0.21));
    draw(date, 380, 15, sans, rgb(0.2, 0.19, 0.21));
    draw(`Certificate Id: ${certificate.certificateId}`, 140, 10, sans, rgb(0.55, 0.54, 0.56));
    draw(`Date of certification: ${date}`, 120, 10, sans, rgb(0.55, 0.54, 0.56));
    bytes = Buffer.from(await pdf.save());
    console.warn(`Rebuilt ${certificate.certificateId} because its archived source returned ${response.status}`);
  }
  await fs.writeFile(path.join(directory, filename), bytes);
  await certificates.updateOne({ _id: certificate._id }, { $set: {
    certificateDownloadUrl: `/uploads/certificates/${filename}`,
    storageProvider: "local",
    archivedSourceUrl: certificate.certificateDownloadUrl,
  }});
  migrated += 1;
}

console.log(JSON.stringify({ found: remoteCertificates.length, migrated }));
await client.close();
