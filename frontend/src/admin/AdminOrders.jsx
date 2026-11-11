import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load orders.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (orderId, status) => {
    setSavingId(orderId); setError(""); setNotice("");
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setNotice("Order status updated.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update order.");
    } finally { setSavingId(""); }
  };

  return (
    <section>
      <div className="admin-page-heading admin-heading-row">
        <div><p className="admin-kicker">SALES</p><h1>Orders</h1>
          <p className="admin-muted">Review customer orders and update their fulfilment status.</p></div>
        <button className="admin-button admin-button-light" onClick={load}>Refresh</button>
      </div>
      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {notice && <div className="admin-alert admin-alert-success">{notice}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="7">Loading orders…</td></tr> :
              orders.length === 0 ? <tr><td colSpan="7">No orders found.</td></tr> :
              orders.map((order) => (
                <tr key={order._id}>
                  <td><strong>#{String(order._id).slice(-7).toUpperCase()}</strong><small>{new Date(order.createdAt).toLocaleString()}</small></td>
                  <td>{order.user?.name || "Customer"}<small>{order.user?.email || ""}</small></td>
                  <td>{(order.items || []).map((item) => `${item.name} × ${item.qty}`).join(", ")}</td>
                  <td>Rs. {Number(order.total || 0).toLocaleString("en-PK")}</td>
                  <td>{String(order.paymentMethod || "cod").toUpperCase()}<small>{order.paymentStatus || "pending"}</small></td>
                  <td><span className={`admin-status ${order.status === "delivered" ? "active" : "pending"}`}>{order.status}</span></td>
                  <td><select className="admin-status-select" value={order.status} disabled={savingId === order._id}
                    onChange={(e) => updateStatus(order._id, e.target.value)}>
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
