import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { api } from "../api/api";

export default function AdminGuard() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    const verifyAdmin = async () => {
      const token = localStorage.getItem("triora_token");
      if (!token) {
        if (active) setStatus("denied");
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        if (active) setStatus(data.user?.role === "admin" ? "allowed" : "denied");
      } catch {
        localStorage.removeItem("triora_token");
        if (active) setStatus("denied");
      }
    };

    verifyAdmin();
    return () => { active = false; };
  }, []);

  if (status === "checking") {
    return <div className="admin-loading">Checking administrator access…</div>;
  }

  if (status !== "allowed") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
