import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function ResultView({ result }) {
  const chartData = result.subjects.map(s => ({ name: s.subjectCode, marks: s.totalMarks }));
  const courseName = result.student.course?.courseName || result.student.course || "Course";

  return (
    <div className="result-page-card elevated">
      <div className="result-head">
        <div>
          <h2>{result.student.user.name}</h2>
          <p>{result.student.rollNo} • {courseName} • Semester {result.student.semester}</p>
        </div>
        <div className="big-score">{result.percentage}%</div>
      </div>
      <div className="mini-grid">
        <div><span>CGPA</span><b>{result.cgpa}</b></div>
        <div><span>Status</span><b>{result.status}</b></div>
        <div><span>Verification ID</span><b>{result.verificationId}</b></div>
      </div>
      <div className="chart-card"><h3>Subject Performance</h3><ResponsiveContainer width="100%" height={260}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="marks" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></div>
      <table className="data-table"><thead><tr><th>Subject</th><th>Internal</th><th>External</th><th>Total</th><th>Grade</th><th>Suggestion</th></tr></thead><tbody>{result.subjects.map(s => <tr key={s.subjectCode}><td>{s.subjectName}</td><td>{s.internalMarks}</td><td>{s.externalMarks}</td><td>{s.totalMarks}</td><td><b>{s.grade}</b></td><td>{s.tip}</td></tr>)}</tbody></table>
      <div className="alert-box"><b>Weak Area Analysis:</b> {result.weakestSubjects.length ? result.weakestSubjects.map(s => s.subjectName).join(", ") : "No marks uploaded yet."}</div>
      <button className="primary-btn" onClick={() => window.print()}>Print / Save as PDF</button>
    </div>
  );
}

export default ResultView;
