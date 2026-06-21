import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import AnnouncementList from "../components/AnnouncementList";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [query, setQuery] = useState("");

  const [studentForm, setStudentForm] = useState({ name: "", email: "", password: "Student@123", rollNo: "", course: "", semester: 1, section: "A", parentEmail: "" });
  const [teacherForm, setTeacherForm] = useState({ name: "", email: "", password: "Teacher@123", employeeId: "", department: "Computer Science", assignedSubjects: [] });
  const [subjectForm, setSubjectForm] = useState({ subjectName: "", subjectCode: "", course: "", semester: 1, credits: 4 });
  const [courseForm, setCourseForm] = useState({ courseName: "", courseCode: "", totalSemesters: "", department: "" });
  const [assignForm, setAssignForm] = useState({ teacherId: "", assignedSubjects: [] });
  const [announcementForm, setAnnouncementForm] = useState({ title: "", message: "", audience: "all", priority: "medium" });

  const load = async () => {
    const [d, st, sub, crs, tch] = await Promise.all([
      api.get("/dashboard/admin"),
      api.get("/students"),
      api.get("/subjects"),
      api.get("/courses"),
      api.get("/teachers"),
    ]);
    setDashboard(d.data);
    setStudents(st.data);
    setSubjects(sub.data);
    setCourses(crs.data);
    setTeachers(tch.data);
  };

  useEffect(() => { load(); }, []);

  const filteredStudents = useMemo(() => {
    const q = query.toLowerCase();
    return students.filter(s =>
      s.user?.name?.toLowerCase().includes(q) ||
      s.rollNo?.toLowerCase().includes(q) ||
      s.course?.courseName?.toLowerCase().includes(q)
    );
  }, [students, query]);

  const addCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post("/courses", courseForm);
      alert("Course added");
      setCourseForm({ courseName: "", courseCode: "", totalSemesters: "", department: "" });
      load();
    } catch (error) { alert(error.response?.data?.message || "Course add failed"); }
  };

  const addStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/students", studentForm);
      alert(`Student added. Email: ${studentForm.email}, Password: ${studentForm.password}`);
      setStudentForm({ name: "", email: "", password: "Student@123", rollNo: "", course: "", semester: 1, section: "A", parentEmail: "" });
      load();
    } catch (error) { alert(error.response?.data?.message || "Student add failed"); }
  };

  const addTeacher = async (e) => {
    e.preventDefault();
    try {
      await api.post("/teachers", teacherForm);
      alert(`Teacher added. Email: ${teacherForm.email}, Password: ${teacherForm.password}`);
      setTeacherForm({ name: "", email: "", password: "Teacher@123", employeeId: "", department: "Computer Science", assignedSubjects: [] });
      load();
    } catch (error) { alert(error.response?.data?.message || "Teacher add failed"); }
  };

  const addSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/subjects", subjectForm);
      alert("Subject added");
      setSubjectForm({ subjectName: "", subjectCode: "", course: "", semester: 1, credits: 4 });
      load();
    } catch (error) { alert(error.response?.data?.message || "Subject add failed"); }
  };

  const assignSubjects = async (e) => {
    e.preventDefault();
    if (!assignForm.teacherId) return alert("Select teacher");
    try {
      await api.patch(`/teachers/${assignForm.teacherId}/subjects`, { assignedSubjects: assignForm.assignedSubjects });
      alert("Subjects assigned to teacher");
      setAssignForm({ teacherId: "", assignedSubjects: [] });
      load();
    } catch (error) { alert(error.response?.data?.message || "Assignment failed"); }
  };

  const postAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post("/announcements", announcementForm);
      alert("Announcement posted");
      setAnnouncementForm({ title: "", message: "", audience: "all", priority: "medium" });
      load();
    } catch (error) { alert(error.response?.data?.message || "Announcement failed"); }
  };

  const toggleSubject = (subjectId, setter, form) => {
    const exists = form.assignedSubjects.includes(subjectId);
    setter({ ...form, assignedSubjects: exists ? form.assignedSubjects.filter(id => id !== subjectId) : [...form.assignedSubjects, subjectId] });
  };

  return (
    <Layout title="Admin Dashboard" subtitle="Manage courses, users, teacher subject access, announcements and result analytics.">
      <section id="dashboard">
        <div className="stats-grid">
          <StatCard icon="🎓" label="Courses" value={courses.length} hint="Active courses" />
          <StatCard icon="👩‍🎓" label="Students" value={dashboard?.counts.students || 0} hint="Total enrolled" />
          <StatCard icon="👨‍🏫" label="Teachers" value={dashboard?.counts.teachers || 0} hint="Faculty users" />
          <StatCard icon="📚" label="Subjects" value={dashboard?.counts.subjects || 0} hint="Active subjects" />
        </div>
      </section>

      <section id="analytics" className="grid-3">
        <form className="panel form-panel elevated" onSubmit={addCourse}>
          <h2>Add Course</h2>
          <input required placeholder="Course Name e.g. MCA" value={courseForm.courseName} onChange={e => setCourseForm({ ...courseForm, courseName: e.target.value })} />
          <input required placeholder="Course Code e.g. MCA" value={courseForm.courseCode} onChange={e => setCourseForm({ ...courseForm, courseCode: e.target.value })} />
          <input required type="number" min="1" placeholder="Total Semesters" value={courseForm.totalSemesters} onChange={e => setCourseForm({ ...courseForm, totalSemesters: e.target.value })} />
          <input placeholder="Department" value={courseForm.department} onChange={e => setCourseForm({ ...courseForm, department: e.target.value })} />
          <button className="primary-btn">Add Course</button>
        </form>

        <form className="panel form-panel elevated" onSubmit={addStudent}>
          <h2>Add Student</h2>
          <input required placeholder="Name" value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} />
          <input required placeholder="Email" value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} />
          <input placeholder="Password" value={studentForm.password} onChange={e => setStudentForm({ ...studentForm, password: e.target.value })} />
          <input required placeholder="Roll No" value={studentForm.rollNo} onChange={e => setStudentForm({ ...studentForm, rollNo: e.target.value })} />
          <select required value={studentForm.course} onChange={e => setStudentForm({ ...studentForm, course: e.target.value })}>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
          </select>
          <div className="inline-grid">
            <input required type="number" min="1" placeholder="Semester" value={studentForm.semester} onChange={e => setStudentForm({ ...studentForm, semester: e.target.value })} />
            <input required placeholder="Section" value={studentForm.section} onChange={e => setStudentForm({ ...studentForm, section: e.target.value })} />
          </div>
          <input placeholder="Parent Email" value={studentForm.parentEmail} onChange={e => setStudentForm({ ...studentForm, parentEmail: e.target.value })} />
          <button className="primary-btn">Add Student</button>
        </form>

        <form className="panel form-panel elevated" onSubmit={addTeacher}>
          <h2>Add Teacher</h2>
          <input required placeholder="Name" value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })} />
          <input required placeholder="Email" value={teacherForm.email} onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })} />
          <input placeholder="Password" value={teacherForm.password} onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })} />
          <input required placeholder="Employee ID" value={teacherForm.employeeId} onChange={e => setTeacherForm({ ...teacherForm, employeeId: e.target.value })} />
          <input placeholder="Department" value={teacherForm.department} onChange={e => setTeacherForm({ ...teacherForm, department: e.target.value })} />
          <div className="check-list compact">
            <b>Assign Subjects</b>
            {subjects.map(s => (
              <label key={s._id}><input type="checkbox" checked={teacherForm.assignedSubjects.includes(s._id)} onChange={() => toggleSubject(s._id, setTeacherForm, teacherForm)} /> {s.subjectName}</label>
            ))}
          </div>
          <button className="primary-btn">Add Teacher</button>
        </form>
      </section>

      <section className="grid-3">
        <form className="panel form-panel elevated" onSubmit={addSubject}>
          <h2>Add Subject</h2>
          <input required placeholder="Subject Name" value={subjectForm.subjectName} onChange={e => setSubjectForm({ ...subjectForm, subjectName: e.target.value })} />
          <input required placeholder="Subject Code" value={subjectForm.subjectCode} onChange={e => setSubjectForm({ ...subjectForm, subjectCode: e.target.value })} />
          <select required value={subjectForm.course} onChange={e => setSubjectForm({ ...subjectForm, course: e.target.value })}>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
          </select>
          <input required type="number" min="1" placeholder="Semester" value={subjectForm.semester} onChange={e => setSubjectForm({ ...subjectForm, semester: e.target.value })} />
          <input type="number" placeholder="Credits" value={subjectForm.credits} onChange={e => setSubjectForm({ ...subjectForm, credits: e.target.value })} />
          <button className="primary-btn">Add Subject</button>
        </form>

        <form className="panel form-panel elevated" onSubmit={assignSubjects}>
          <h2>Assign Subjects</h2>
          <select required value={assignForm.teacherId} onChange={e => setAssignForm({ ...assignForm, teacherId: e.target.value, assignedSubjects: teachers.find(t => t._id === e.target.value)?.assignedSubjects?.map(s => s._id) || [] })}>
            <option value="">Select Teacher</option>
            {teachers.map(t => <option key={t._id} value={t._id}>{t.user?.name} - {t.employeeId}</option>)}
          </select>
          <div className="check-list">
            {subjects.map(s => (
              <label key={s._id}><input type="checkbox" checked={assignForm.assignedSubjects.includes(s._id)} onChange={() => toggleSubject(s._id, setAssignForm, assignForm)} /> {s.subjectName} ({s.subjectCode})</label>
            ))}
          </div>
          <button className="primary-btn">Update Access</button>
        </form>

        <div className="panel elevated">
          <h2>Courses</h2>
          <table className="data-table compact-table"><thead><tr><th>Course</th><th>Code</th><th>Sem</th></tr></thead><tbody>{courses.map(c => <tr key={c._id}><td>{c.courseName}</td><td>{c.courseCode}</td><td>{c.totalSemesters}</td></tr>)}</tbody></table>
        </div>
      </section>

      <section id="results" className="two-col">
        <div className="panel elevated">
          <div className="panel-head"><h2>Students</h2><input className="search-input" placeholder="Search student, roll no or course" value={query} onChange={e => setQuery(e.target.value)} /></div>
          <table className="data-table"><thead><tr><th>Name</th><th>Roll No</th><th>Course</th><th>Sem</th><th>Result</th></tr></thead><tbody>{filteredStudents.map(s => <tr key={s._id}><td>{s.user.name}</td><td>{s.rollNo}</td><td>{s.course?.courseName}</td><td>{s.semester}</td><td><Link to={`/result/${s._id}`}>View</Link></td></tr>)}</tbody></table>
        </div>
        <div className="panel elevated">
          <h2>Teacher Access</h2>
          <div className="activity-list">{teachers.map(t => <div className="activity" key={t._id}><b>{t.user?.name}</b><span>{t.assignedSubjects?.length || 0} assigned subject(s)</span></div>)}</div>
          <h2 className="space-top">Leaderboard</h2>
          <div className="leader-list">{dashboard?.leaderboard.map((x, i) => <div className="leader-item" key={x.name}><b>#{i + 1} {x.name}</b><span>{x.percentage}%</span></div>)}</div>
        </div>
      </section>

      <section id="announcements" className="two-col">
        <form className="panel form-panel elevated" onSubmit={postAnnouncement}>
          <h2>Post Announcement</h2>
          <input required placeholder="Announcement title" value={announcementForm.title} onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })} />
          <textarea required placeholder="Write announcement message" value={announcementForm.message} onChange={e => setAnnouncementForm({ ...announcementForm, message: e.target.value })} />
          <select value={announcementForm.audience} onChange={e => setAnnouncementForm({ ...announcementForm, audience: e.target.value })}><option value="all">All</option><option value="student">Students</option><option value="teacher">Teachers</option></select>
          <select value={announcementForm.priority} onChange={e => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}><option value="low">Low Priority</option><option value="medium">Medium Priority</option><option value="high">High Priority</option></select>
          <button className="primary-btn">Post Announcement</button>
        </form>
        <div className="panel elevated"><h2>Latest Announcements</h2><AnnouncementList /></div>
      </section>

      <section id="settings" className="panel elevated"><h2>Admin Notes</h2><p className="muted">Teachers can only upload marks and attendance for assigned subjects. Course data is now stored as a proper MongoDB reference.</p></section>
    </Layout>
  );
}

export default AdminDashboard;
