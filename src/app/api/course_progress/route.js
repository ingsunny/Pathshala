import { connect } from "@/dbConfig/dbConfig";
import Certificate from "@/models/certificateModal";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "@firebase/storage";
// fixed the error by adding @

import { StandardFonts } from "pdf-lib";

import { app } from "@/firebase";

import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";

connect();

export async function POST(NextRequest) {
  try {
    const reqBody = await NextRequest.json();

    const { userId, courseId, topicId } = reqBody;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({
        message: "User Not Found!",
        status: 404,
      });
    }

    const course = user.courses.find(
      (item) => item._id.toString() === courseId
    );

    if (!course) {
      return NextResponse.json({
        message: "Course Not Found!",
        status: 404,
      });
    }

    // Updating each topic progress here

    for (const chapter of course.syllabus) {
      for (const topic of chapter.topics) {
        if (topic._id.toString() === topicId) {
          console.log("Found Topic:", topic.topicName);

          topic.topicProgress = true;
          console.log("Updated topicProgress:", topic.topicProgress);
          break;
        }
      }
    }

    // Calculating Percetage Completed -

    const totalTopics = course.syllabus.reduce((acc, chapter) => {
      return acc + chapter.topics.length;
    }, 0);

    const topicsWithProgress = course.syllabus.reduce((acc, chapter) => {
      return acc + chapter.topics.filter((topic) => topic.topicProgress).length;
    }, 0);

    const percentageCompleted = Math.floor(
      (topicsWithProgress / totalTopics) * 100 || 0
    );

    // Finally updating the course progress

    course.progress_status = percentageCompleted;

    const savedUser = await user.save();

    const { password, ...rest } = user._doc;

    // If user Completed 100% any of course we will generate the Certificate instantly

    if (percentageCompleted === 100) {
      function generateCustomCertificateId() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const length = 7;
        let customId = "";
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          customId += characters[randomIndex];
        }
        return customId + "-PATHSHALA";
      }

      const customCertificateId = generateCustomCertificateId();

      const existingCertificate = await Certificate.findOne({
        user_id: userId,
        course_id: course._id.toString(),
      });

      if (!existingCertificate) {
        const existingPdfBytes = fs.readFileSync(
          "public/certificate_example.pdf"
        );
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const page = pdfDoc.getPages()[0];

        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const { width, height } = page.getSize();

        // name text
        const userNameText = user.name;
        const userNameSize = 27;
        const userNameWidth = timesRomanFont.widthOfTextAtSize(
          userNameText,
          userNameSize
        );
        const userNameX = (width - userNameWidth) / 2;

        page.drawText(userNameText, {
          x: userNameX,
          y: 442,
          size: userNameSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });

        // course text
        const courseText = `For successfully completing the Pathshala ${course.name} course on`;
        const courseSize = 15;
        const courseWidth = helveticaFont.widthOfTextAtSize(
          courseText,
          courseSize
        );
        const courseX = (width - courseWidth) / 2;

        page.drawText(courseText, {
          x: courseX,
          y: 400,
          size: courseSize,
          font: helveticaFont,
          color: rgb(51 / 255, 49 / 255, 53 / 255),
        });

        const currentDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const dateSize = 15;
        const dateWidth = helveticaFont.widthOfTextAtSize(
          currentDate,
          dateSize
        );
        const dateX = (width - dateWidth) / 2;

        page.drawText(currentDate, {
          x: dateX,
          y: 380,
          size: dateSize,
          font: helveticaFont,
          color: rgb(51 / 255, 49 / 255, 53 / 255),
        });

        const wishesText =
          "Pathshala wishes you the best for your future endeavours.";
        const wishesWidth = helveticaFont.widthOfTextAtSize(
          wishesText,
          courseSize
        );
        const wishesX = (width - wishesWidth) / 2;

        page.drawText(wishesText, {
          x: wishesX,
          y: 340,
          size: courseSize,
          font: helveticaFont,
          color: rgb(51 / 255, 49 / 255, 53 / 255),
        });

        const verifyText = `Verify here: ${process.env.NEXT_PUBLIC_API_BASE_URL}verifiy_certificate/`;
        const verifySize = 10;
        const verifyWidth = helveticaFont.widthOfTextAtSize(
          verifyText,
          verifySize
        );
        const verifyX = (width - verifyWidth) / 2;

        page.drawText(verifyText, {
          x: verifyX,
          y: 96,
          size: verifySize,
          font: helveticaFont,
          color: rgb(141 / 255, 137 / 255, 144 / 255),
        });

        // date of certification
        const certDateText = `Date of certification: ${currentDate}`;
        const certDateWidth = helveticaFont.widthOfTextAtSize(
          certDateText,
          verifySize
        );
        const certDateX = (width - certDateWidth) / 2;

        page.drawText(certDateText, {
          x: certDateX,
          y: 120,
          size: verifySize,
          font: helveticaFont,
          color: rgb(141 / 255, 137 / 255, 144 / 255),
        });

        // certificate ID
        const certIdText = `Certificate Id: ${customCertificateId}`;
        const certIdWidth = helveticaFont.widthOfTextAtSize(
          certIdText,
          verifySize
        );
        const certIdX = (width - certIdWidth) / 2;

        page.drawText(certIdText, {
          x: certIdX,
          y: 140,
          size: verifySize,
          font: helveticaFont,
          color: rgb(141 / 255, 137 / 255, 144 / 255),
        });

        const modifiedPdfBytes = await pdfDoc.save();

        const storage = getStorage(app);
        const bucket = ref(storage, `certificates/${customCertificateId}.pdf`);

        const uploadTask = uploadBytesResumable(bucket, modifiedPdfBytes);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Error uploading PDF:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(bucket);

            const newCertificate = new Certificate({
              user_id: userId,
              username: user.name,
              course_id: course._id.toString(),
              course_name: course.name,
              course_category: course.category,
              certificateId: customCertificateId,
              certificateDownloadUrl: downloadURL,
            });

            await newCertificate.save();
            console.log("Certificate saved!");
          }
        );
      }
    }

    return NextResponse.json({
      message: "Topic updated successfully!",
      status: 200,
      user: rest,
    });
  } catch (err) {
    return NextResponse.json({ message: "Internal Error" });
  }
}

// if (!course) {
//   throw new Error("Course not found");
// }
