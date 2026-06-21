import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "admin@srms.com", password: "Admin@123" });
  const [show, setShow] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return alert("Enter a valid email");
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      if (res.data.user.role === "admin") navigate("/admin", { replace: true });
      if (res.data.user.role === "teacher") navigate("/teacher", { replace: true });
      if (res.data.user.role === "student") navigate("/student", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page premium-auth">
      <section className="auth-left">
        <div className="brand-icon large">SR</div>
        <span className="badge">MERN Placement Project</span>
        <h1>Smart Student Result Management System</h1>
        <p>Role-based academic dashboard for courses, marks, attendance, announcements, analytics and student performance insights.</p>
        <div className="feature-row">
          <div>📊 Analytics</div>
          <div>🔐 Role Access</div>
          <div>📅 Attendance</div>
          <div>🏆 Leaderboard</div>
        </div>
      </section>

      <section className="auth-right">
        <form className="auth-card" onSubmit={submit}>
          <h2>Welcome Back</h2>
          <p>Login to continue to your dashboard</p>
          <label>Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.trim() })} />
          <label>Password</label>
          <div className="password-field">
            <input type={show ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
          </div>
          <button className="primary-btn">Login</button>
          <p className="switch-text">New user? <Link to="/signup">Create account</Link></p>
          <div className="demo-box">
            <b>Demo Credentials</b>
            <span>Admin: admin@srms.com / Admin@123</span>
            <span>Teacher: teacher@srms.com / Teacher@123</span>
            <span>Student: student@srms.com / Student@123</span>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;
