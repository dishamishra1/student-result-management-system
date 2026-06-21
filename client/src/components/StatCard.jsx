import React from "react";

function StatCard({ icon, label, value, hint }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <p>{label}</p>
      <h2>{value}</h2>
      <span>{hint}</span>
    </div>
  );
}

export default StatCard;
