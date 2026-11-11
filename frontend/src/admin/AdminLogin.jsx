import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "./admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });

      if (data.user?.role !== "admin") {
        setError("This account does not have administrator access.");
        return;
      }

      localStorage.setItem("triora_token", data.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <Link className="admin-login-brand" to="/">TRIORA<span>.</span></Link>
        <p className="admin-kicker">SECURE ADMINISTRATION</p>
        <h1>Admin sign in</h1>
        <p className="admin-muted">Sign in with an account that has the admin role.</p>

        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <label htmlFor="admin-email">Email address</label>
        <input id="admin-email" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />

        <label htmlFor="admin-password">Password</label>
        <input id="admin-password" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />

        <button className="admin-button admin-button-primary" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <Link className="admin-back-link" to="/">← Back to store</Link>
      </form>
    </main>
  );
}
