const express = require("express");
const Marks = require("../models/Marks");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Teacher = require("../models/Teacher");
const Activity = require("../models/Activity");
const { protect, allow } = require("../middleware/auth");
const { getGrade } = require("../utils/grade");

const router = express.Router();

router.post("/", protect, allow("admin", "teacher"), async (req, res) => {
  try {
    const { student, subject, internalMarks, externalMarks, remarks } = req.body;
    const sub = await Subject.findById(subject);
    const stu = await Student.findById(student).populate("user", "name");
    if (!sub || !stu) return res.status(404).json({ message: "Invalid student or subject" });

    let teacher = null;
    if (req.user.role === "teacher") {
      teacher = await Teacher.findOne({ user: req.user._id });
      const allowed = teacher?.assignedSubjects?.some(id => id.toString() === subject.toString());
      if (!allowed) return res.status(403).json({ message: "You can upload marks only for your assigned subjects" });
    }

    if (Number(internalMarks) > sub.maxInternal || Number(externalMarks) > sub.maxExternal) {
      return res.status(400).json({ message: "Marks exceed max limits" });
    }

    const totalMarks = Number(internalMarks) + Number(externalMarks);
    const marks = await Marks.findOneAndUpdate(
      { student, subject },
      { student, subject, teacher: teacher?._id, internalMarks, externalMarks, totalMarks, grade: getGrade(totalMarks), remarks },
      { upsert: true, new: true, runValidators: true }
    );

    await Activity.create({ title: "Marks Updated", description: `${stu.user.name}'s marks updated in ${sub.subjectName}`, by: req.user._id });
    res.status(201).json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protect, allow("admin", "teacher"), async (req, res) => {
  let query = {};
  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id });
    query = { subject: { $in: teacher?.assignedSubjects || [] } };
  }

  const marks = await Marks.find(query)
    .populate({ path: "student", populate: [{ path: "user", select: "name email" }, { path: "course", select: "courseName courseCode" }] })
    .populate({ path: "subject", populate: { path: "course", select: "courseName courseCode" } })
    .sort("-createdAt");
  res.json(marks);
});

module.exports = router;
