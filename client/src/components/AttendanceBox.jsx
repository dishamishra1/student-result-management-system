import React, { useEffect, useState } from "react";
import api from "../api/api";
function AttendanceBox() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/attendance/me").then(res => setData(res.data)).catch(() => setData(null)); }, []);
  if (!data) return <p>No attendance data yet.</p>;
  return <div><div className="mini-grid"><div><span>Total Classes</span><b>{data.total}</b></div><div><span>Present</span><b>{data.present}</b></div><div><span>Attendance %</span><b>{data.percentage}%</b></div></div><table className="data-table"><thead><tr><th>Date</th><th>Subject</th><th>Status</th></tr></thead><tbody>{data.records.slice(0,8).map(r => <tr key={r._id}><td>{r.date}</td><td>{r.subject?.subjectName}</td><td><span className={r.status === "Present" ? "status-good" : "status-bad"}>{r.status}</span></td></tr>)}</tbody></table></div>;
}
export default AttendanceBox;
