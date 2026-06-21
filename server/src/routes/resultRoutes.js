const express = require("express");
const Student = require("../models/Student");
const Marks = require("../models/Marks");
const { protect, allow } = require("../middleware/auth");
const { getStatus, getTip } = require("../utils/grade");

const router = express.Router();

async function buildResult(student) {
  const marks = await Marks.find({ student: student._id }).populate("subject");

  const subjects = marks.map(m => ({
    subjectName: m.subject.subjectName,
    subjectCode: m.subject.subjectCode,
    internalMarks: m.internalMarks,
    externalMarks: m.externalMarks,
    totalMarks: m.totalMarks,
    grade: m.grade,
    remarks: m.remarks,
    tip: getTip(m.subject.subjectName, m.totalMarks),
  }));

  const total = subjects.reduce((sum, s) => sum + s.totalMarks, 0);
  const max = subjects.length * 100;
  const percentage = max ? Number(((total / max) * 100).toFixed(2)) : 0;
  const cgpa = Number((percentage / 9.5).toFixed(2));
  const sorted = [...subjects].sort((a, b) => a.totalMarks - b.totalMarks);

  return { student, subjects, total, max, percentage, cgpa, status: getStatus(percentage), weakestSubjects: sorted.slice(0, 3), verificationId: `SRMS-${student.rollNo}` };
}

router.get("/me", protect, allow("student"), async (req, res) => {
  const student = await Student.findOne({ user: req.user._id })
    .populate("user", "name email avatarText")
    .populate("course", "courseName courseCode");
  if (!student) return res.status(404).json({ message: "Student profile not found" });
  res.json(await buildResult(student));
});

router.get("/student/:id", protect, allow("admin", "teacher"), async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate("user", "name email avatarText")
    .populate("course", "courseName courseCode");
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(await buildResult(student));
});

module.exports = router;
