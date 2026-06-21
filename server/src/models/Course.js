const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    totalSemesters: { type: Number, required: true, min: 1 },
    department: { type: String, default: "General" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
