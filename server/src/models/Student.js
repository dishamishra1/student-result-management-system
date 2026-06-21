const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rollNo: { type: String, unique: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  semester: { type: Number,  required: true },
  section: { type: String,  required: true },
  parentEmail: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
