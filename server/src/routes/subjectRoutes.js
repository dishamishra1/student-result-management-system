const express = require("express");
const Subject = require("../models/Subject");
const Course = require("../models/Course");
const Activity = require("../models/Activity");
const { protect, allow } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, allow("admin"), async (req, res) => {
  try {
    const { subjectName, subjectCode, course, semester } = req.body;
    if (!subjectName || !subjectCode || !course || !semester) {
      return res.status(400).json({ message: "Subject name, code, course and semester are required" });
    }
    const courseDoc = await Course.findById(course);
    if (!courseDoc) return res.status(400).json({ message: "Invalid course selected" });

    const subject = await Subject.create(req.body);
    await Activity.create({ title: "Subject Added", description: `${subject.subjectName} added for ${courseDoc.courseName}`, by: req.user._id });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protect, async (req, res) => {
  const subjects = await Subject.find().populate("course", "courseName courseCode").sort({ semester: 1, subjectCode: 1 });
  res.json(subjects);
});

module.exports = router;
