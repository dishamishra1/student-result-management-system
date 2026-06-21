const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true, unique: true },
  semester: { type: Number, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  credits: { type: Number, default: 4 },
  maxInternal: { type: Number, default: 25 },
  maxExternal: { type: Number, default: 75 }
}, { timestamps: true });



module.exports = mongoose.model("Subject", subjectSchema);
