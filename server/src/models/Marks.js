const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  internalMarks: { type: Number, required: true },
  externalMarks: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String, required: true },
  remarks: { type: String, default: "" }
}, { timestamps: true });

marksSchema.index({ student: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model("Marks", marksSchema);
