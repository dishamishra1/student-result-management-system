import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", course: "", semester: 1, section: "A" });
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/courses").then(res => setCourses(res.data)).catch(() => setCourses([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return alert("Enter a valid email");
    if (form.password.length < 6) return alert("Password must be at least 6 characters");
    try {
      const payload = form.role === "student" ? form : { name: form.name, email: form.email, password: form.password, role: form.role };
      const res = await api.post("/auth/register", payload);
      login(res.data.token, res.data.user);
      if (res.data.user.role === "teacher") navigate("/teacher", { replace: true });
      if (res.data.user.role === "student") navigate("/student", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-wrap premium-auth">
      <form className="auth-card signup-card" onSubmit={submit}>
        <h2>Create Account</h2>
        <p>Signup as Student or Teacher</p>
        <label>Name</label>
        <input required placeholder="Enter full name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>Email</label>
        <input required type="email" placeholder="Enter email" onChange={(e) => setForm({ ...form, email: e.target.value.trim() })} />
        <label>Password</label>
        <input required type="password" placeholder="Create password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label>Role</label>
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        {form.role === "student" && (
          <>
            <label>Course</label>
            <select required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
            </select>
            <label>Semester</label>
            <input type="number" min="1" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
          </>
        )}
        <button className="primary-btn">Create Account</button>
        <p className="switch-text">Already have account? <Link to="/">Login</Link></p>
      </form>
    </div>
  );
}

export default Signup;
