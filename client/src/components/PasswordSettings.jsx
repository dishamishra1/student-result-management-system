import React, { useState } from "react";
import api from "../api/api";
function PasswordSettings() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const submit = async (e) => { e.preventDefault(); if (form.newPassword.length < 6) return alert("New password must be at least 6 characters"); try { const res = await api.patch("/auth/change-password", form); alert(res.data.message); setForm({ oldPassword: "", newPassword: "" }); } catch (err) { alert(err.response?.data?.message || "Password change failed"); } };
  return <form className="settings-form" onSubmit={submit}><label>Old Password</label><input type="password" value={form.oldPassword} onChange={e => setForm({...form, oldPassword:e.target.value})} placeholder="Enter old password"/><label>New Password</label><input type="password" value={form.newPassword} onChange={e => setForm({...form, newPassword:e.target.value})} placeholder="Enter new password"/><button className="primary-btn">Change Password</button></form>;
}
export default PasswordSettings;
