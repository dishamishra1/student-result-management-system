import React from "react";

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="stat-card elevated">
      {Icon && (
        <div className="stat-icon">
          <Icon size={20} strokeWidth={1.75} />
        </div>
      )}
      <p>{label}</p>
      <h2>{value}</h2>
      <span>{hint}</span>
    </div>
  );
}

export default StatCard;
