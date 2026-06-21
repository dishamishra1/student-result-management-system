const mongoose = require("mongoose");
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  audience: { type: String, enum: ["all", "student", "teacher"], default: "all" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
module.exports = mongoose.model("Announcement", announcementSchema);
