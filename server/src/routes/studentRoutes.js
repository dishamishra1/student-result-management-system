const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Activity = require("../models/Activity");
const { protect, allow } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, allow("admin"), async (req, res) => {
  try {
    const { name, email, password, rollNo, course, semester, section, parentEmail } = req.body;
    if (!name || !email || !rollNo || !course || !semester || !section) {
      return res.status(400).json({ message: "Name, email, roll no, course, semester and section are required" });
    }

    const courseDoc = await Course.findById(course);
    if (!courseDoc) return res.status(400).json({ message: "Invalid course selected" });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password || "Student@123", 10),
      role: "student",
      avatarText: name.slice(0, 2).toUpperCase(),
    });

    const student = await Student.create({ user: user._id, rollNo, course, semester, section, parentEmail });
    await Activity.create({ title: "Student Added", description: `${name} was added to ${courseDoc.courseName}`, by: req.user._id });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protect, allow("admin", "teacher"), async (req, res) => {
  const students = await Student.find()
    .populate("user", "name email avatarText")
    .populate("course", "courseName courseCode")
    .sort({ rollNo: 1 });
  res.json(students);
});

module.exports = router;
