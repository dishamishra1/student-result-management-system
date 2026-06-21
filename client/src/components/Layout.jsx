import React from "react";
import { useAuth } from "../context/AuthContext";

function Layout({ title, subtitle, children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">SR</div>
          <div>
            <h2>SRMS Max</h2>
            <p>Academic Analytics</p>
          </div>
        </div>

        <div className="user-card">
          <div className="avatar">{user?.avatarText || user?.name?.slice(0, 2).toUpperCase()}</div>
          <div>
            <b>{user?.name}</b>
            <span>{user?.role}</span>
          </div>
        </div>

        <nav className="nav">
          <a href="#dashboard">🏠 Dashboard</a>
          <a href="#analytics">📊 Manage / Analytics</a>
          <a href="#results">📄 Results</a>
          <a href="#attendance">📅 Attendance</a>
          <a href="#announcements">🔔 Announcements</a>
          <a href="#settings">⚙️ Settings</a>
        </nav>

        <button className="logout" onClick={logout}>Logout</button>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <span className="eyebrow">Academic Session 2026</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="top-pill">SRMS Control Center</div>
        </div>
        {children}
      </main>
    </div>
  );
}

export default Layout;
