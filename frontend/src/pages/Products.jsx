import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [ageGroup, setAgeGroup] = useState(searchParams.get("ageGroup") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setAgeGroup(searchParams.get("ageGroup") || "");
    setGender(searchParams.get("gender") || "");
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const params = { limit: 50 };
        if (search.trim()) params.search = search.trim();
        if (ageGroup) params.ageGroup = ageGroup;
        if (gender) params.gender = gender;
        if (category) params.category = category;

        const response = await api.get("/products", { params });
        setProducts(response.data.products || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load products.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, ageGroup, gender, category]);

  return (
    <main className="section shop-page">
      <div className="shop-title">
        <p className="eyebrow">THE TRIORA STORE</p>
        <h1>Our Collection</h1>
        <p>Explore the latest styles and everyday essentials.</p>
      </div>

      <div className="shop-toolbar">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
          <option value="">All age groups</option>
          <option value="newborn">Newborn</option>
          <option value="kids">Kids</option>
          <option value="teen">Teen</option>
          <option value="adult">Adult</option>
          <option value="accessories">Accessories</option>
        </select>

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">All genders</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="boys">Boys</option>
          <option value="girls">Girls</option>
          <option value="unisex">Unisex</option>
        </select>

        <button
          className="secondary-button"
          onClick={() => {
            setSearch("");
            setAgeGroup("");
            setGender("");
            setCategory("");
          }}
        >
          Clear filters
        </button>
      </div>

      {loading ? (
        <p className="state-message">Loading products...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="state-message">No matching products found.</p>
      )}
    </main>
  );
}