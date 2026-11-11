import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "./admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("triora_token");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <NavLink to="/admin" end className="admin-brand">TRIORA<span>.</span><small>ADMIN</small></NavLink>
        <nav className="admin-nav">
          <NavLink to="/admin" end>Overview</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
        </nav>
        <div className="admin-sidebar-bottom">
          <NavLink to="/" className="admin-store-link">View storefront ↗</NavLink>
          <button className="admin-logout" onClick={logout}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-kicker">TRIORA MANAGEMENT</span>
            <strong>Store administration</strong>
          </div>
          <button className="admin-button admin-button-light" onClick={logout}>Sign out</button>
        </header>
        <div className="admin-content"><Outlet /></div>
      </main>
    </div>
  );
}
