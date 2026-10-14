
import { useEffect, useState } from "react";

import InitialNavbar from "../../components/initial/InitialNavbar";
import InitialProductCard from "../../components/initial/InitialProductCard";

import { demoProducts, demoCategories } from "../../data/demoData";
import { loadProducts, loadCategories } from "../../services/storeService";

import "./initial.css";

function InitialHome() {
  const [products, setProducts] = useState(demoProducts);
  const [categories, setCategories] = useState(demoCategories);
  const [dataSource, setDataSource] = useState("demo");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function loadStore() {
      const [productResult, categoryResult] = await Promise.all([
        loadProducts(),
        loadCategories(),
      ]);

      if (cancelled) return;

      setProducts(productResult.data);
      setCategories(categoryResult.data);

      setDataSource(
        productResult.source === "firebase" ||
        categoryResult.source === "firebase"
          ? "mixed"
          : "demo"
      );

      setLoading(false);
    }

    loadStore();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category?.toLowerCase() ===
            activeCategory.toLowerCase()
        );

  return (
    <div className="initial-store" id="home">
      <InitialNavbar />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <p className="eyebrow">THE EVERYDAY COLLECTION · PAKISTAN</p>

            <h1>
              Less noise.
              <br />
              <span>More style.</span>
            </h1>

            <p className="hero-description">
              Thoughtfully chosen essentials. Effortless everyday style.
              Discover a wardrobe built around the way you live.
            </p>

            <a className="primary-button" href="#products">
              Discover the collection <span>↗</span>
            </a>

            <div className="hero-note">
              <span className="hero-dot" />
              Designed for your everyday
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-art-top">
              <span>TRIORA / 001</span>
              <span>DAILY UNIFORM</span>
            </div>

            <div className="hero-art-center">
              <span className="hero-big-letter">T</span>
              <span className="hero-art-word">WEAR YOUR WAY</span>
            </div>

            <div className="hero-art-bottom">
              <span>TIMELESS BY DESIGN</span>
              <span>EST. TRIORA</span>
            </div>
          </div>

          <div className="hero-index">01 — 03</div>
        </section>

        <section className="benefit-strip" id="about">
          <div>
            <span className="benefit-icon">✳</span>
            <p>Everyday essentials</p>
          </div>
          <div>
            <span className="benefit-icon">↗</span>
            <p>Nationwide delivery</p>
          </div>
          <div>
            <span className="benefit-icon">◇</span>
            <p>Easy exchange policy</p>
          </div>
        </section>

        <section className="collection-section" id="collections">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIND YOUR FIT</p>
              <h2>Made for your everyday.</h2>
            </div>
            <p className="section-side-note">
              Simple pieces. Endless combinations.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((category, index) => (
              <button
                type="button"
                key={category.id}
                className={`category-card category-${index % 3}`}
                onClick={() => {
                  setActiveCategory(category.name);
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="category-number">
                  0{index + 1}
                </span>
                <span className="category-name">{category.name}</span>
                <span className="category-description">
                  {category.description}
                </span>
                <span className="category-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE TRIORA EDIT</p>
              <h2>Everyday favourites.</h2>
            </div>

            <span className="product-count">
              {filteredProducts.length} PIECES
            </span>
          </div>

          <div className="category-filters">
            {["All", ...categories.map((category) => category.name)].map(
              (category) => (
                <button
                  type="button"
                  key={category}
                  className={
                    activeCategory === category ? "filter-active" : ""
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              )
            )}
          </div>

          {loading && (
            <p className="store-status" role="status">
              Loading the collection…
            </p>
          )}

          {!loading && dataSource !== "mixed" && (
            <p className="store-status" role="status">
              Showing demonstration products. Live Firebase data may be
              unavailable or the collection may be empty.
            </p>
          )}

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <InitialProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {!filteredProducts.length && (
            <div className="empty-state">
              <h3>No pieces in this collection yet.</h3>
              <p>Choose another category to explore the collection.</p>
              <button
                type="button"
                className="primary-button"
                onClick={() => setActiveCategory("All")}
              >
                View all products
              </button>
            </div>
          )}
        </section>

        <section className="brand-note">
          <p className="eyebrow">A LITTLE LESS, A LOT BETTER</p>
          <h2>
            Your style.
            <br />
            <span>Your everyday.</span>
          </h2>
          <p>
            TRIORA is about versatile clothing, considered details,
            and finding confidence in the simple things.
          </p>
          <a href="#products" className="text-link">
            Explore TRIORA <span>↗</span>
          </a>
        </section>

        <section className="newsletter-section" id="contact">
          <div>
            <p className="eyebrow">STAY IN THE LOOP</p>
            <h2>Good things are coming.</h2>
            <p>Discover new collections and everyday inspiration.</p>
          </div>
          <a className="primary-button" href="mailto:hello@triorastore.com">
            Get in touch <span>↗</span>
          </a>
        </section>
      </main>

      <footer className="initial-footer">
        <a className="brand-logo" href="#home">
          TRIORA<span>.</span>
        </a>
        <p>Less noise. More style.</p>
        <span>© {new Date().getFullYear()} TRIORA</span>
      </footer>
    </div>
  );
}

export default InitialHome;
