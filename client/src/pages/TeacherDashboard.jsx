import React, { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import AnnouncementList from "../components/AnnouncementList";
import PasswordSettings from "../components/PasswordSettings";

function TeacherDashboard() {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [form, setForm] = useState({ student: "", subject: "", internalMarks: "", externalMarks: "", remarks: "" });
  const [attendance, setAttendance] = useState({ student: "", subject: "", date: new Date().toISOString().slice(0, 10), status: "Present" });

  const load = async () => {
    const [d, st, sub, mk] = await Promise.all([
      api.get("/dashboard/teacher"),
      api.get("/students"),
      api.get("/teachers/me/subjects"),
      api.get("/marks"),
    ]);
    setStats(d.data);
    setStudents(st.data);
    setSubjects(sub.data);
    setMarks(mk.data);
  };

  useEffect(() => { load(); }, []);

  const submitMarks = async (e) => {
    e.preventDefault();
    try {
      await api.post("/marks", form);
      alert("Marks saved");
      setForm({ student: "", subject: "", internalMarks: "", externalMarks: "", remarks: "" });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Marks upload failed");
    }
  };

  const submitAttendance = async (e) => {
    e.preventDefault();
    try {
      await api.post("/attendance", attendance);
      alert("Attendance saved");
    } catch (err) {
      alert(err.response?.data?.message || "Attendance failed");
    }
  };

  return (
    <Layout title="Teacher Dashboard" subtitle="Upload marks and attendance only for assigned subjects.">
      <section id="dashboard">
        <div className="stats-grid">
          <StatCard icon="👩‍🎓" label="Students" value={stats?.counts.students || 0} hint="Available students" />
          <StatCard icon="📚" label="Assigned Subjects" value={subjects.length} hint="Your allowed subjects" />
          <StatCard icon="📝" label="Marks Entries" value={stats?.counts.marks || 0} hint="Uploaded records" />
          <StatCard icon="🎯" label="Focus" value="85%" hint="Target class avg" />
        </div>
      </section>

      {subjects.length === 0 && (
        <div className="alert-box"><b>No assigned subjects:</b> Ask admin to assign subjects before uploading marks or attendance.</div>
      )}

      <section id="analytics" className="two-col">
        <form className="panel form-panel" onSubmit={submitMarks}>
          <h2>Add / Update Marks</h2>
          <select required value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
            <option value="">Select Student</option>
            {students.map(s => <option key={s._id} value={s._id}>{s.user.name} - {s.rollNo}</option>)}
          </select>
          <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
            <option value="">Select Assigned Subject</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.subjectName} ({s.subjectCode})</option>)}
          </select>
          <input required type="number" placeholder="Internal Marks /25" value={form.internalMarks} onChange={(e) => setForm({ ...form, internalMarks: e.target.value })} />
          <input required type="number" placeholder="External Marks /75" value={form.externalMarks} onChange={(e) => setForm({ ...form, externalMarks: e.target.value })} />
          <input placeholder="Remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          <button className="primary-btn">Save Marks</button>
        </form>

        <form id="attendance" className="panel form-panel" onSubmit={submitAttendance}>
          <h2>Mark Attendance</h2>
          <select required value={attendance.student} onChange={(e) => setAttendance({ ...attendance, student: e.target.value })}>
            <option value="">Select Student</option>
            {students.map(s => <option key={s._id} value={s._id}>{s.user.name} - {s.rollNo}</option>)}
          </select>
          <select required value={attendance.subject} onChange={(e) => setAttendance({ ...attendance, subject: e.target.value })}>
            <option value="">Select Assigned Subject</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.subjectName} ({s.subjectCode})</option>)}
          </select>
          <input type="date" value={attendance.date} onChange={(e) => setAttendance({ ...attendance, date: e.target.value })} />
          <select value={attendance.status} onChange={(e) => setAttendance({ ...attendance, status: e.target.value })}>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          <button className="primary-btn">Save Attendance</button>
        </form>
      </section>

      <section id="results" className="panel">
        <h2>Recent Marks Records</h2>
        <table className="data-table">
          <thead><tr><th>Student</th><th>Subject</th><th>Total</th><th>Grade</th></tr></thead>
          <tbody>{marks.map(m => <tr key={m._id}><td>{m.student?.user?.name}</td><td>{m.subject?.subjectName}</td><td>{m.totalMarks}</td><td><b>{m.grade}</b></td></tr>)}</tbody>
        </table>
      </section>

      <section id="announcements" className="panel"><h2>Announcements</h2><AnnouncementList /></section>
      <section id="settings" className="panel"><h2>Settings</h2><PasswordSettings /></section>
    </Layout>
  );
}

export default TeacherDashboard;
