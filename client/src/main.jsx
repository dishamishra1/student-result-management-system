import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./styles.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ResultDetails from "./pages/ResultDetails";

function rolePath(role) {
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teacher";
  if (role === "student") return "/student";
  return "/";
}

function PublicOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to={rolePath(user.role)} replace />;
  return children;
}

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={rolePath(user.role)} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
      <Route path="/admin" element={<Protected roles={["admin"]}><AdminDashboard /></Protected>} />
      <Route path="/teacher" element={<Protected roles={["teacher"]}><TeacherDashboard /></Protected>} />
      <Route path="/student" element={<Protected roles={["student"]}><StudentDashboard /></Protected>} />
      <Route path="/result/:id" element={<Protected roles={["admin", "teacher"]}><ResultDetails /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);
