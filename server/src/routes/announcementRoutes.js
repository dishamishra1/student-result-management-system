const express = require("express");
const Announcement = require("../models/Announcement");
const Activity = require("../models/Activity");
const { protect, allow } = require("../middleware/auth");
const router = express.Router();
router.post("/", protect, allow("admin"), async (req, res) => {
  try {
    const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });
    await Activity.create({ title: "Announcement Posted", description: announcement.title, by: req.user._id });
    res.status(201).json(announcement);
  } catch (error) { res.status(500).json({ message: error.message }); }
});
router.get("/", protect, async (req, res) => {
  const role = req.user.role;
  const announcements = await Announcement.find({ $or: [{ audience: "all" }, { audience: role }] }).sort("-createdAt").limit(20);
  res.json(announcements);
});
module.exports = router;
