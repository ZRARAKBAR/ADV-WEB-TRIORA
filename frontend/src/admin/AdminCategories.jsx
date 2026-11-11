import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";

const initial = { name: "", slug: "", ageGroup: "adult", gender: "unisex" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data.categories || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load categories.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      await api.post("/categories", form);
      setForm(initial);
      setNotice("Category created successfully.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create category.");
    } finally { setSaving(false); }
  };

  const remove = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    setError(""); setNotice("");
    try {
      await api.delete(`/categories/${category._id}`);
      setNotice("Category deleted.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete category.");
    }
  };

  return (
    <section>
      <div className="admin-page-heading"><p className="admin-kicker">CATALOGUE</p><h1>Categories</h1>
        <p className="admin-muted">Create and remove product categories.</p></div>
      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {notice && <div className="admin-alert admin-alert-success">{notice}</div>}

      <form className="admin-panel" onSubmit={submit}>
        <h2>Add category</h2>
        <div className="admin-form-grid">
          <label>Category name *<input value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Slug (optional)<input value={form.slug} placeholder="Auto-generated if empty" onChange={(e) => setForm({ ...form, slug: e.target.value })} /></label>
          <label>Age group *
            <select value={form.ageGroup} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}>
              <option value="newborn">Newborn</option><option value="kids">Kids</option>
              <option value="teen">Teen</option><option value="adult">Adult</option><option value="accessories">Accessories</option>
            </select>
          </label>
          <label>Gender
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="unisex">Unisex</option><option value="boys">Boys</option><option value="girls">Girls</option>
              <option value="men">Men</option><option value="women">Women</option>
            </select>
          </label>
        </div>
        <button className="admin-button admin-button-primary" disabled={saving}>{saving ? "Saving…" : "Add category"}</button>
      </form>

      <div className="admin-panel">
        <div className="admin-panel-heading"><h2>All categories ({categories.length})</h2>
          <button className="admin-button admin-button-light" onClick={load}>Refresh</button></div>
        {loading ? <p>Loading categories…</p> : categories.length === 0 ? <p className="admin-muted">No categories yet.</p> :
          <div className="admin-category-list">{categories.map((category) => (
            <div className="admin-category-item" key={category._id}>
              <div><strong>{category.name}</strong><small>{category.slug} · {category.ageGroup} · {category.gender}</small></div>
              <button className="admin-text-button danger" onClick={() => remove(category)}>Delete</button>
            </div>
          ))}</div>}
      </div>
    </section>
  );
}
