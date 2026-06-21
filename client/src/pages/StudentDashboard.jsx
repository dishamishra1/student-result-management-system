import React, { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import ResultView from "../components/ResultView";
import AnnouncementList from "../components/AnnouncementList";
import AttendanceBox from "../components/AttendanceBox";
import PasswordSettings from "../components/PasswordSettings";
function StudentDashboard() {
  const [result, setResult] = useState(null);
  useEffect(() => { api.get("/results/me").then(res => setResult(res.data)).catch(() => setResult(null)); }, []);
  return <Layout title="My Result Dashboard" subtitle="Track marks, CGPA, attendance, weak subjects, and improvement suggestions."><section id="dashboard">{result ? <div className="stats-grid"><StatCard icon="📈" label="Percentage" value={`${result.percentage}%`} hint="Current semester"/><StatCard icon="🎓" label="CGPA" value={result.cgpa} hint="Estimated CGPA"/><StatCard icon="✅" label="Status" value={result.status} hint="Performance level"/><StatCard icon="📚" label="Subjects" value={result.subjects.length} hint="Marks uploaded"/></div> : <div className="empty-state"><h2>No result found yet</h2><p>Your teacher/admin has not uploaded marks for your account.</p></div>}</section><section id="analytics">{result && <ResultView result={result}/>}</section><section id="results" className="panel"><h2>Result Summary</h2>{result ? <div className="summary-grid"><div><b>Percentage</b><span>{result.percentage}%</span></div><div><b>CGPA</b><span>{result.cgpa}</span></div><div><b>Status</b><span>{result.status}</span></div><div><b>Verification ID</b><span>{result.verificationId}</span></div></div> : <p>No result available.</p>}</section><section id="attendance" className="panel"><h2>Attendance Overview</h2><AttendanceBox/></section><section id="announcements" className="panel"><h2>Announcements</h2><AnnouncementList/></section><section id="settings" className="panel"><h2>Settings</h2><p className="muted">Change your password from here.</p><PasswordSettings/></section></Layout>;
}
export default StudentDashboard;
