import mongoose from "mongoose";

const certificateSchema = mongoose.Schema({
  user_id: { type: String },
  username: { type: String },
  course_id: { type: String },
  course_name: { type: String },
  course_category: { type: String },
  certificateId: { type: String, unique: true, index: true },
  certificateDownloadUrl: {
    type: String,
    required: true,
  },
  assessment_score: { type: Number },
  storageProvider: { type: String, default: "local" },
  archivedSourceUrl: { type: String },
  date_of_completion: {
    type: Date,
    default: Date.now,
  },
});

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model("Certificate", certificateSchema);

export default Certificate;
