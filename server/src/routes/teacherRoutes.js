const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");
const Activity = require("../models/Activity");
const { protect, allow } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, allow("admin"), async (req, res) => {
  try {
    const { name, email, password, employeeId, department, assignedSubjects = [] } = req.body;
    if (!name || !email || !employeeId) return res.status(400).json({ message: "Name, email and employee ID are required" });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const validSubjects = await Subject.find({ _id: { $in: assignedSubjects } }).select("_id");
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password || "Teacher@123", 10),
      role: "teacher",
      avatarText: name.slice(0, 2).toUpperCase(),
    });

    const teacher = await Teacher.create({
      user: user._id,
      employeeId,
      department,
      assignedSubjects: validSubjects.map(s => s._id),
    });

    await Activity.create({ title: "Teacher Added", description: `${name} was added`, by: req.user._id });
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protect, allow("admin"), async (req, res) => {
  const teachers = await Teacher.find()
    .populate("user", "name email avatarText")
    .populate({ path: "assignedSubjects", populate: { path: "course", select: "courseName courseCode" } });
  res.json(teachers);
});

router.patch("/:id/subjects", protect, allow("admin"), async (req, res) => {
  try {
    const { assignedSubjects = [] } = req.body;
    const validSubjects = await Subject.find({ _id: { $in: assignedSubjects } }).select("_id");
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { assignedSubjects: validSubjects.map(s => s._id) },
      { new: true }
    ).populate("assignedSubjects");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    await Activity.create({ title: "Subjects Assigned", description: "Teacher subject access updated", by: req.user._id });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/me/subjects", protect, allow("teacher"), async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id })
    .populate({ path: "assignedSubjects", populate: { path: "course", select: "courseName courseCode" } });
  res.json(teacher?.assignedSubjects || []);
});

module.exports = router;
