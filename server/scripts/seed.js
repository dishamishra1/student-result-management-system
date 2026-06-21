const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../src/models/User");
const Student = require("../src/models/Student");
const Teacher = require("../src/models/Teacher");
const Subject = require("../src/models/Subject");
const Course = require("../src/models/Course");
const Marks = require("../src/models/Marks");
const Activity = require("../src/models/Activity");
const Announcement = require("../src/models/Announcement");
const Attendance = require("../src/models/Attendance");
const { getGrade } = require("../src/utils/grade");

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany();
  await Student.deleteMany();
  await Teacher.deleteMany();
  await Subject.deleteMany();
  await Course.deleteMany();
  await Marks.deleteMany();
  await Activity.deleteMany();
  await Announcement.deleteMany();
  await Attendance.deleteMany();

  const courses = await Course.insertMany([
    { courseName: "Master of Computer Applications", courseCode: "MCA", totalSemesters: 4, department: "Computer Science" },
    { courseName: "Bachelor of Computer Applications", courseCode: "BCA", totalSemesters: 6, department: "Computer Science" },
    { courseName: "B.Tech Computer Science", courseCode: "BTCS", totalSemesters: 8, department: "Engineering" },
  ]);
  const mca = courses.find(c => c.courseCode === "MCA");

  const admin = await User.create({ name: "Disha Admin", email: "admin@srms.com", password: await bcrypt.hash("Admin@123", 10), role: "admin", avatarText: "DA" });
  const teacherUser = await User.create({ name: "Dr. Meera Sharma", email: "teacher@srms.com", password: await bcrypt.hash("Teacher@123", 10), role: "teacher", avatarText: "MS" });

  const subjects = await Subject.insertMany([
    { subjectName: "Database Management System", subjectCode: "MCA201", course: mca._id, semester: 2, credits: 4 },
    { subjectName: "Software Engineering", subjectCode: "MCA202", course: mca._id, semester: 2, credits: 4 },
    { subjectName: "Operating System", subjectCode: "MCA203", course: mca._id, semester: 2, credits: 4 },
    { subjectName: "Computer Networks", subjectCode: "MCA204", course: mca._id, semester: 2, credits: 4 },
    { subjectName: "Artificial Intelligence", subjectCode: "MCA205", course: mca._id, semester: 2, credits: 4 },
  ]);

  const teacher = await Teacher.create({ user: teacherUser._id, employeeId: "T1001", department: "Computer Science", assignedSubjects: subjects.map(s => s._id) });

  const studentUser = await User.create({ name: "Aarav Singh", email: "student@srms.com", password: await bcrypt.hash("Student@123", 10), role: "student", avatarText: "AS" });
  const student = await Student.create({ user: studentUser._id, rollNo: "MCA2027001", course: mca._id, semester: 2, section: "A", parentEmail: "parent@example.com" });

  const scores = [88, 76, 69, 82, 91];
  for (let i = 0; i < subjects.length; i++) {
    const total = scores[i];
    await Marks.create({
      student: student._id,
      subject: subjects[i]._id,
      teacher: teacher._id,
      internalMarks: Math.min(25, Math.round(total * 0.25)),
      externalMarks: total - Math.min(25, Math.round(total * 0.25)),
      totalMarks: total,
      grade: getGrade(total),
      remarks: "Good progress",
    });
  }

  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    await Attendance.create({ student: student._id, subject: subjects[i % subjects.length]._id, date: date.toISOString().slice(0, 10), status: i % 5 === 0 ? "Absent" : "Present", markedBy: teacherUser._id });
  }

  await Announcement.insertMany([
    { title: "Mid Semester Result Published", message: "Students can view subject-wise performance and improvement suggestions.", audience: "student", priority: "high", createdBy: admin._id },
    { title: "Marks Upload Reminder", message: "Teachers are requested to update pending marks before Friday.", audience: "teacher", priority: "medium", createdBy: admin._id },
    { title: "Academic Session 2026", message: "Welcome to the academic dashboard experience.", audience: "all", priority: "low", createdBy: admin._id },
  ]);

  await Activity.create({ title: "System Ready", description: "Demo courses, users, subjects, marks and attendance seeded successfully", by: admin._id });
  console.log("Seed completed");
  process.exit();
};

run().catch(e => {
  console.error(e);
  process.exit(1);
});
