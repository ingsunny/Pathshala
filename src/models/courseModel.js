import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  img1: {
    type: String,
    default: "/android.png.webp",
  },
  img2: {
    type: String,
    default: "/android.png.webp",
  },
  description: {
    type: String,
    required: true,
  },
  syllabus: [
    {
      chapter: {
        type: String,
        required: true,
      },
      topics: [
        {
          topicName: {
            type: String,
            required: true,
          },
          topicLink: {
            type: String,
            required: true,
          },
          summary: {
            type: String,
            default: "",
          },
          keyPoints: [{ type: String }],
          durationMinutes: {
            type: Number,
            default: 12,
          },
        },
      ],
    },
  ],
  finalAssessment: {
    title: { type: String, default: "Final assessment" },
    durationMinutes: { type: Number, default: 45 },
    passingScore: { type: Number, default: 70 },
    questions: [
      {
        prompt: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: Number, required: true, select: false },
        explanation: { type: String, default: "", select: false },
      },
    ],
  },
});

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
