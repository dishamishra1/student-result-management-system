const express = require("express");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Activity = require("../models/Activity");
const { protect, allow } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, allow("admin", "teacher"), async (req, res) => {
  try {
    const { student, subject, date, status } = req.body;

    if (req.user.role === "teacher") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      const allowed = teacher?.assignedSubjects?.some(id => id.toString() === subject.toString());
      if (!allowed) return res.status(403).json({ message: "You can mark attendance only for your assigned subjects" });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { student, subject, date },
      { student, subject, date, status, markedBy: req.user._id },
      { upsert: true, new: true, runValidators: true }
    );

    await Activity.create({ title: "Attendance Updated", description: `Attendance marked as ${status}`, by: req.user._id });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/me", protect, allow("student"), async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) return res.status(404).json({ message: "Student profile not found" });

  const records = await Attendance.find({ student: student._id }).populate("subject").sort("-date");
  const total = records.length;
  const present = records.filter(r => r.status === "Present").length;
  const percentage = total ? Number(((present / total) * 100).toFixed(2)) : 0;
  res.json({ total, present, absent: total - present, percentage, records });
});

router.get("/", protect, allow("admin", "teacher"), async (req, res) => {
  let query = {};
  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id });
    query = { subject: { $in: teacher?.assignedSubjects || [] } };
  }

  const records = await Attendance.find(query)
    .populate({ path: "student", populate: { path: "user", select: "name email" } })
    .populate("subject")
    .sort("-date")
    .limit(100);
  res.json(records);
});

module.exports = router;
