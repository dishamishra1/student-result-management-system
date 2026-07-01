import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { href: "#dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "#analytics", label: "Manage / Analytics", icon: BarChart3 },
  { href: "#results", label: "Results", icon: FileText },
  { href: "#attendance", label: "Attendance", icon: CalendarDays },
  { href: "#announcements", label: "Announcements", icon: Bell },
  { href: "#settings", label: "Settings", icon: Settings },
];

function Layout({ title, subtitle, children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <div>
            <h2>SRMS</h2>
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
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <a key={href} href={href}>
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </a>
          ))}
        </nav>

        <button className="logout" onClick={logout}>
          <LogOut size={16} strokeWidth={1.75} />
          Logout
        </button>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <span className="eyebrow">Academic Session 2026</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="top-pill">Control Center</div>
        </div>
        {children}
      </main>
    </div>
  );
}

export default Layout;
