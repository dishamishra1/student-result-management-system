const express = require("express");
const Course = require("../models/Course");
const Activity = require("../models/Activity");
const { protect, allow } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, allow("admin"), async (req, res) => {
  try {
    const { courseName, courseCode, totalSemesters, department } = req.body;
    if (!courseName || !courseCode || !totalSemesters) {
      return res.status(400).json({ message: "Course name, code and total semesters are required" });
    }

    const exists = await Course.findOne({ courseCode: courseCode.toUpperCase() });
    if (exists) return res.status(400).json({ message: "Course code already exists" });

    const course = await Course.create({ courseName, courseCode, totalSemesters, department });
    await Activity.create({ title: "Course Added", description: `${course.courseName} course added`, by: req.user._id });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protect, async (req, res) => {
  const courses = await Course.find().sort({ courseName: 1 });
  res.json(courses);
});

module.exports = router;
