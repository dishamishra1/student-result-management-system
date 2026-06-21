const express = require("express");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");
const Marks = require("../models/Marks");
const Activity = require("../models/Activity");
const { protect, allow } = require("../middleware/auth");

const router = express.Router();

router.get("/admin", protect, allow("admin"), async (req, res) => {
  const [students, teachers, subjects, marks, activities] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Subject.countDocuments(),
    Marks.find().populate({ path: "student", populate: { path: "user", select: "name" } }),
    Activity.find().populate("by", "name").sort("-createdAt").limit(8)
  ]);

  const map = {};
  marks.forEach(m => {
    const id = m.student?._id?.toString();
    if (!id) return;
    if (!map[id]) map[id] = { name: m.student.user.name, total: 0, count: 0 };
    map[id].total += m.totalMarks;
    map[id].count++;
  });

  const leaderboard = Object.values(map)
    .map(x => ({ name: x.name, percentage: Number((x.total / (x.count * 100) * 100).toFixed(2)) }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  res.json({
    counts: { students, teachers, subjects, marks: marks.length },
    leaderboard,
    activities
  });
});

router.get("/teacher", protect, allow("teacher"), async (req, res) => {
  const [students, subjects, marks] = await Promise.all([
    Student.countDocuments(),
    Subject.countDocuments(),
    Marks.countDocuments()
  ]);

  res.json({ counts: { students, subjects, marks } });
});

module.exports = router;
