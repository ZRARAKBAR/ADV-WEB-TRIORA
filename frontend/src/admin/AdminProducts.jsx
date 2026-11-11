import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";

const emptyForm = {
  name: "", slug: "", description: "", brand: "TRIORA", price: "",
  discountPrice: "", ageGroup: "adult", gender: "unisex", category: "",
  collections: "", sizes: "", colors: "", images: "", stock: "0",
  isFeatured: false, isActive: true,
};

const splitList = (value) => value.split(/[\n,]/).map((v) => v.trim()).filter(Boolean);
const slugify = (value) => value.toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) params.set("search", search.trim());
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setShowForm(true);
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      brand: product.brand || "TRIORA",
      price: String(product.price ?? ""),
      discountPrice: product.discountPrice == null ? "" : String(product.discountPrice),
      ageGroup: product.ageGroup || "adult",
      gender: product.gender || "unisex",
      category: product.category || "",
      collections: (product.collections || []).join(", "),
      sizes: (product.sizes || []).join(", "),
      colors: (product.colors || []).join(", "),
      images: (product.images || []).join("\n"),
      stock: String(product.stock ?? 0),
      isFeatured: Boolean(product.isFeatured),
      isActive: product.isActive !== false,
    });
    setError("");
    setNotice("");
    setShowForm(true);
  };

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      name: form.name.trim(),
      slug: (form.slug.trim() || slugify(form.name)),
      description: form.description.trim(),
      brand: form.brand.trim() || "TRIORA",
      price: Number(form.price),
      ageGroup: form.ageGroup,
      gender: form.gender,
      category: form.category.trim().toLowerCase(),
      collections: splitList(form.collections).map((v) => v.toLowerCase()),
      sizes: splitList(form.sizes),
      colors: splitList(form.colors),
      images: splitList(form.images),
      stock: Number(form.stock),
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      currency: "PKR",
    };
    if (form.discountPrice.trim() !== "") payload.discountPrice = Number(form.discountPrice);

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setNotice("Product updated successfully.");
      } else {
        await api.post("/products", payload);
        setNotice("Product created successfully.");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      await api.delete(`/products/${product._id}`);
      setNotice("Product deleted.");
      if (products.length === 1 && page > 1) setPage((p) => p - 1);
      else await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete product.");
    }
  };

  return (
    <section>
      <div className="admin-page-heading admin-heading-row">
        <div><p className="admin-kicker">CATALOGUE</p><h1>Products</h1>
          <p className="admin-muted">{pagination.total} products in your catalogue</p></div>
        <button className="admin-button admin-button-primary" onClick={startCreate}>＋ Add product</button>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {notice && <div className="admin-alert admin-alert-success">{notice}</div>}

      {showForm && (
        <form className="admin-panel admin-product-form" onSubmit={saveProduct}>
          <div className="admin-panel-heading">
            <h2>{editingId ? "Edit product" : "Add a product"}</h2>
            <button type="button" className="admin-text-button" onClick={() => setShowForm(false)}>Close ✕</button>
          </div>

          <div className="admin-form-grid">
            <label>Product name *<input name="name" value={form.name} onChange={change} required maxLength={180} /></label>
            <label>Slug (optional)<input name="slug" value={form.slug} onChange={change} placeholder="auto-generated-from-name" /></label>
            <label>Brand<input name="brand" value={form.brand} onChange={change} /></label>
            <label>Category slug *<input name="category" value={form.category} onChange={change} placeholder="e.g. hoodies" required /></label>
            <label>Regular price (PKR) *<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required /></label>
            <label>Discount price (PKR)<input name="discountPrice" type="number" min="0" step="0.01" value={form.discountPrice} onChange={change} placeholder="Leave blank for no discount" /></label>
            <label>Age group *
              <select name="ageGroup" value={form.ageGroup} onChange={change} required>
                <option value="newborn">Newborn</option><option value="kids">Kids</option>
                <option value="teen">Teen</option><option value="adult">Adult</option>
                <option value="accessories">Accessories</option>
              </select>
            </label>
            <label>Gender
              <select name="gender" value={form.gender} onChange={change}>
                <option value="unisex">Unisex</option><option value="boys">Boys</option>
                <option value="girls">Girls</option><option value="men">Men</option><option value="women">Women</option>
              </select>
            </label>
            <label>Stock quantity *<input name="stock" type="number" min="0" step="1" value={form.stock} onChange={change} required /></label>
            <label>Collections <input name="collections" value={form.collections} onChange={change} placeholder="new-arrivals, best-sellers" /></label>
            <label>Sizes <input name="sizes" value={form.sizes} onChange={change} placeholder="S, M, L, XL" /></label>
            <label>Colors <input name="colors" value={form.colors} onChange={change} placeholder="Black, White, Navy" /></label>
            <label className="admin-full-field">Description
              <textarea name="description" rows="4" value={form.description} onChange={change} />
            </label>
            <label className="admin-full-field">Image URLs (one URL per line)
              <textarea name="images" rows="3" value={form.images} onChange={change} placeholder="https://example.com/product-image.jpg" />
              <small>Paste publicly accessible image URLs. This backend does not currently provide image uploading.</small>
            </label>
          </div>

          <div className="admin-checkbox-row">
            <label><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={change} /> Featured product</label>
            <label><input type="checkbox" name="isActive" checked={form.isActive} onChange={change} /> Active / visible</label>
          </div>
          <div className="admin-form-actions">
            <button className="admin-button admin-button-primary" disabled={saving}>{saving ? "Saving…" : editingId ? "Save changes" : "Create product"}</button>
            <button type="button" className="admin-button admin-button-light" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-toolbar">
        <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          placeholder="Search product name or description…" />
        <button className="admin-button admin-button-light" onClick={loadProducts}>Refresh</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="6">Loading products…</td></tr> :
              products.length === 0 ? <tr><td colSpan="6">No products found.</td></tr> :
              products.map((product) => (
                <tr key={product._id}>
                  <td><div className="admin-product-cell">
                    {product.images?.[0] ? <img src={product.images[0]} alt="" /> : <div className="admin-image-placeholder">T</div>}
                    <div><strong>{product.name}</strong><small>{product.slug || product._id}</small></div>
                  </div></td>
                  <td>{product.category}</td>
                  <td>Rs. {Number(product.discountPrice ?? product.price).toLocaleString("en-PK")}</td>
                  <td>{product.stock}</td>
                  <td><span className={`admin-status ${product.isActive === false ? "inactive" : "active"}`}>{product.isActive === false ? "Hidden" : "Active"}</span></td>
                  <td><div className="admin-row-actions">
                    <button className="admin-text-button" onClick={() => startEdit(product)}>Edit</button>
                    <button className="admin-text-button danger" onClick={() => deleteProduct(product)}>Delete</button>
                  </div></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination">
        <span>Page {pagination.page || page} of {Math.max(1, pagination.pages || 1)}</span>
        <div>
          <button className="admin-button admin-button-light" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <button className="admin-button admin-button-light" disabled={page >= (pagination.pages || 1)} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </section>
  );
}
