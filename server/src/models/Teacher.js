const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, default: "Computer Science" },
  assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);
