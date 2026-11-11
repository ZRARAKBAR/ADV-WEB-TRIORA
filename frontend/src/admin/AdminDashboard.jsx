import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, pending: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          api.get("/products?limit=1"),
          api.get("/categories"),
          api.get("/orders"),
        ]);
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        setStats({
          products: productsRes.data.pagination?.total ?? productsRes.data.products?.length ?? 0,
          categories: categoriesRes.data.count ?? categoriesRes.data.categories?.length ?? 0,
          orders: orders.length,
          pending: orders.filter((order) => order.status === "pending").length,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard data.");
      }
    };
    load();
  }, []);

  return (
    <section>
      <div className="admin-page-heading">
        <div><p className="admin-kicker">OVERVIEW</p><h1>Dashboard</h1>
          <p className="admin-muted">A quick view of your TRIORA store.</p></div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <div className="admin-stats-grid">
        <article className="admin-stat-card"><span>Total products</span><strong>{stats.products}</strong><small>In your catalogue</small></article>
        <article className="admin-stat-card"><span>Categories</span><strong>{stats.categories}</strong><small>Store categories</small></article>
        <article className="admin-stat-card"><span>Total orders</span><strong>{stats.orders}</strong><small>All customer orders</small></article>
        <article className="admin-stat-card"><span>Pending orders</span><strong>{stats.pending}</strong><small>Need attention</small></article>
      </div>

      <div className="admin-quick-actions">
        <h2>Quick actions</h2>
        <div className="admin-action-grid">
          <Link to="/admin/products" className="admin-action-card"><strong>Manage products</strong><span>Add, edit, or remove products →</span></Link>
          <Link to="/admin/categories" className="admin-action-card"><strong>Manage categories</strong><span>Create or remove categories →</span></Link>
          <Link to="/admin/orders" className="admin-action-card"><strong>Manage orders</strong><span>Review orders and update status →</span></Link>
        </div>
      </div>
    </section>
  );
}
