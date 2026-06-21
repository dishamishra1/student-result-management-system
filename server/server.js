const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json());
app.use("/api/courses", require("./src/routes/courseRoutes"));

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/students", require("./src/routes/studentRoutes"));
app.use("/api/teachers", require("./src/routes/teacherRoutes"));
app.use("/api/subjects", require("./src/routes/subjectRoutes"));
app.use("/api/marks", require("./src/routes/marksRoutes"));
app.use("/api/results", require("./src/routes/resultRoutes"));
app.use("/api/dashboard", require("./src/routes/dashboardRoutes"));
app.use("/api/announcements", require("./src/routes/announcementRoutes"));
app.use("/api/attendance", require("./src/routes/attendanceRoutes"));
app.use("/api/subjects", require("./src/routes/subjectRoutes"));
app.use("/api/courses", require("./src/routes/courseRoutes"));

app.get("/", (req, res) => res.json({ message: "SRMS Pro API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
