import mongoose from "mongoose";

const assessmentResultSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["not_started", "in_progress", "passed", "failed"],
      default: "not_started",
    },
    attempts: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    lastScore: { type: Number, default: 0 },
    startedAt: Date,
    expiresAt: Date,
    submittedAt: Date,
  },
  { _id: false }
);

const enrollmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedTopicIds: [{ type: mongoose.Schema.Types.ObjectId }],
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    assessmentResult: { type: assessmentResultSchema, default: () => ({}) },
    enrolledAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please provide a name"] },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: { type: String, required: [true, "Please provide a password"] },
  phone: String,
  photoUrl: { type: String, default: "/default-user.png" },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  enrollments: { type: [enrollmentSchema], default: [] },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
