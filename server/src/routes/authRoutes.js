const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const { protect } = require("../middleware/auth");

const router = express.Router();
const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, course, semester, section } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return res.status(400).json({ message: "Enter a valid email" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    if (!["student", "teacher"].includes(role)) return res.status(400).json({ message: "Only student and teacher signup allowed" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
      role,
      avatarText: name.slice(0, 2).toUpperCase(),
    });

    if (role === "student") {
      let courseId = course;
      if (!courseId) {
        const defaultCourse = await Course.findOne({ courseCode: "MCA" });
        courseId = defaultCourse?._id;
      }
      if (!courseId) return res.status(400).json({ message: "No course found. Ask admin to add a course first." });

      const randomRoll = "USR" + Date.now().toString().slice(-6);
      await Student.create({
        user: user._id,
        rollNo: randomRoll,
        course: courseId,
        semester: Number(semester) || 1,
        section: section || "A",
      });
    }

    if (role === "teacher") {
      const randomEmp = "EMP" + Date.now().toString().slice(-6);
      await Teacher.create({ user: user._id, employeeId: randomEmp, department: "Computer Science", assignedSubjects: [] });
    }

    res.status(201).json({
      token: makeToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarText: user.avatarText },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: makeToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarText: user.avatarText },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

router.patch("/change-password", protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: "Both old and new password are required" });
    if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });

    const user = await User.findById(req.user._id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
