import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Gem, Wallet, Sparkles, Layers, Star } from "lucide-react";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";
import "./home.css";

/* ---------- static content (edit freely) ---------- */
const MARQUEE = ["New Arrivals", "Streetwear", "Eid Collection", "Wedding Edit", "Luxury", "Essentials", "Limited Edition", "Newborn to Adult"];

const SEGMENTS = [
  { label: "Newborn", sub: "0–12 Months", to: "/products?ageGroup=newborn" },
  { label: "Boys", sub: "1–12 Years", to: "/products?ageGroup=kids&gender=boys" },
  { label: "Girls", sub: "1–12 Years", to: "/products?ageGroup=kids&gender=girls" },
  { label: "Teen", sub: "13–18 Years", to: "/products?ageGroup=teen" },
  { label: "Men", sub: "Adults", to: "/products?ageGroup=adult&gender=men" },
  { label: "Women", sub: "Adults", to: "/products?ageGroup=adult&gender=women" },
];

const COLLECTIONS = [
  { name: "New Arrivals", slug: "new-arrivals" },
  { name: "Best Sellers", slug: "best-sellers" },
  { name: "Trending", slug: "trending" },
  { name: "Streetwear", slug: "streetwear" },
  { name: "Eid Collection", slug: "eid-collection" },
  { name: "Wedding Collection", slug: "wedding-collection" },
  { name: "Luxury Collection", slug: "luxury-collection" },
  { name: "Essentials", slug: "essentials" },
];

const WHY = [
  { icon: Layers, title: "Every age, one store", text: "From newborn essentials to teen streetwear and adult wardrobes." },
  { icon: Gem, title: "Curated, not crowded", text: "A focused edit of pieces chosen to be worn on repeat." },
  { icon: Wallet, title: "Pay on delivery", text: "Cash on delivery is available at checkout." },
  { icon: Sparkles, title: "Made to last", text: "Everyday fabrics and finishes with a premium feel." },
];

// SAMPLE TEXT — replace with real customer reviews before going live.
const REVIEWS = [
  { name: "Customer name", text: "Add a real customer review here.", rating: 5 },
  { name: "Customer name", text: "Add a real customer review here.", rating: 5 },
  { name: "Customer name", text: "Add a real customer review here.", rating: 5 },
];

/* ---------- small helpers ---------- */
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window) || prefersReduced()) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`tr-reveal ${className}`} style={{ "--d": `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

function Words({ text, start = 0, className = "" }) {
  return text.split(" ").map((w, i) => (
    <span className="tr-word" key={i}>
      <span className={className} style={{ "--i": start + i }}>{w}&nbsp;</span>
    </span>
  ));
}

// Hides itself if the remote image fails, revealing the gradient behind it.
function SafeImg({ src, alt, ...rest }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} {...rest} />;
}

function SectionHead({ eyebrow, title, to, cta = "View all" }) {
  return (
    <Reveal className="tr-head">
      <div>
        <p className="tr-eyebrow">{eyebrow}</p>
        <h2 className="tr-h2">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="tr-link">
          {cta} <ArrowRight size={16} />
        </Link>
      )}
    </Reveal>
  );
}

/* ---------- page ---------- */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const heroImg = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, c] = await Promise.allSettled([
        api.get("/products?limit=12"),
        api.get("/categories"),
      ]);
      if (cancelled) return;
      if (p.status === "fulfilled") setProducts(p.value.data.products || []);
      else setError(p.reason?.response?.data?.message || "Unable to load the store.");
      if (c.status === "fulfilled") setCategories(c.value.data.categories || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Gentle hero parallax
  useEffect(() => {
    if (prefersReduced()) return;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        heroImg.current?.style.setProperty("--py", `${y * 0.1}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const latest = products.slice(0, 8);
  const onSale = products.filter((p) => p.discountPrice != null).slice(0, 4);
  const uniqueCategories = [...new Map(categories.map((c) => [c.slug, c])).values()].slice(0, 14);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // UI only: no newsletter endpoint exists in the backend yet.
    setSubscribed(true);
    setEmail("");
  };

  return (
    <main className="tr-home">
      {/* HERO */}
      <section className="tr-hero">
        <div className="tr-glow" aria-hidden="true" />
        <div className="tr-wrap tr-hero-grid">
          <div className="tr-hero-copy">
            <p className="tr-eyebrow tr-fade" style={{ "--d": "100ms" }}>The TRIORA Collection</p>
            <h1 className="tr-h1">
              <Words text="Wear your style." />
              <br />
              <Words text="Own your moment." start={3} className="tr-gold" />
            </h1>
            <p className="tr-lead tr-fade" style={{ "--d": "900ms" }}>
              Premium fashion for newborns, kids, teens, men and women — thoughtfully
              selected for every part of your everyday life.
            </p>
            <div className="tr-cta tr-fade" style={{ "--d": "1100ms" }}>
              <Link to="/products" className="tr-btn tr-btn-solid">
                Explore collection <ArrowRight size={18} />
              </Link>
              <Link to="/products?collection=new-arrivals" className="tr-btn tr-btn-ghost">
                New arrivals
              </Link>
            </div>
            <ul className="tr-facts tr-fade" style={{ "--d": "1300ms" }}>
              <li><strong>0 → 18+</strong><span>Every age</span></li>
              <li><strong>14</strong><span>Collections</span></li>
              <li><strong>COD</strong><span>Pay on delivery</span></li>
            </ul>
          </div>

          <div className="tr-hero-visual tr-fade" style={{ "--d": "300ms" }}>
            <div className="tr-arch" ref={heroImg}>
              <SafeImg
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200"
                alt="TRIORA fashion collection"
                loading="eager"
              />
              <span className="tr-badge">New season</span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="tr-marquee" aria-hidden="true">
        <div className="tr-marquee-track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i}>{m}<i>✦</i></span>
          ))}
        </div>
      </div>

      {/* SHOP BY AGE / GENDER */}
      <section className="tr-section">
        <div className="tr-wrap">
          <SectionHead eyebrow="Shop by age & gender" title="Who are you shopping for?" to="/products" cta="Shop all" />
          <div className="tr-segments">
            {SEGMENTS.map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <Link to={s.to} className="tr-segment">
                  <span className="tr-num">0{i + 1}</span>
                  <span className="tr-seg-body">
                    <strong>{s.label}</strong>
                    <small>{s.sub}</small>
                  </span>
                  <span className="tr-circle"><ArrowUpRight size={18} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="tr-section tr-section-alt">
        <div className="tr-wrap">
          <SectionHead eyebrow="Featured collections" title="The edit" />
          <ul className="tr-collections">
            {COLLECTIONS.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 50}>
                <Link to={`/products?collection=${c.slug}`}>
                  <span className="tr-col-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="tr-col-name">{c.name}</span>
                  <ArrowRight size={22} className="tr-col-arrow" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* CATEGORY CHIPS (from API) */}
      {uniqueCategories.length > 0 && (
        <section className="tr-section tr-tight">
          <div className="tr-wrap">
            <SectionHead eyebrow="Browse by category" title="Find your look" to="/products" cta="Shop all" />
            <Reveal className="tr-chips">
              {uniqueCategories.map((c) => (
                <Link key={c._id} to={`/products?category=${encodeURIComponent(c.slug)}`} className="tr-chip">
                  {c.name}
                </Link>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* LATEST ARRIVALS */}
      <section className="tr-section">
        <div className="tr-wrap">
          <SectionHead eyebrow="Curated for you" title="Latest arrivals" to="/products" />
          {loading ? (
            <div className="tr-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="tr-skeleton" key={i} />
              ))}
            </div>
          ) : error ? (
            <p className="tr-msg tr-error">{error}</p>
          ) : latest.length ? (
            <div className="tr-grid">
              {latest.map((product, i) => (
                <Reveal key={product._id} delay={(i % 4) * 80} className="tr-card">
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="tr-msg">No products found. Add products through your existing API.</p>
          )}
        </div>
      </section>

      {/* FEATURE BANNER */}
      <section className="tr-banner">
        <SafeImg
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600"
          alt=""
          className="tr-banner-img"
        />
        <div className="tr-banner-shade" />
        <Reveal className="tr-wrap tr-banner-inner">
          <p className="tr-eyebrow">Limited edition</p>
          <h2 className="tr-h2 tr-big">Dressed for the<br /><em>occasion.</em></h2>
          <div className="tr-cta">
            <Link to="/products?collection=eid-collection" className="tr-btn tr-btn-solid">Eid collection</Link>
            <Link to="/products?collection=wedding-collection" className="tr-btn tr-btn-ghost">Wedding edit</Link>
          </div>
        </Reveal>
      </section>

      {/* FLASH SALE (only when discounted products exist) */}
      {onSale.length > 0 && (
        <section className="tr-section">
          <div className="tr-wrap">
            <SectionHead eyebrow="Special pricing" title="On sale now" to="/products" />
            <div className="tr-grid">
              {onSale.map((product, i) => (
                <Reveal key={product._id} delay={i * 80} className="tr-card">
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY TRIORA */}
      <section className="tr-section tr-section-alt">
        <div className="tr-wrap">
          <SectionHead eyebrow="Why TRIORA" title="Fashion, considered." />
          <div className="tr-why">
            {WHY.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 90} className="tr-why-item">
                <Icon size={26} strokeWidth={1.3} />
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="tr-section">
        <div className="tr-wrap">
          <SectionHead eyebrow="Customer reviews" title="Loved by our customers" />
          <div className="tr-reviews">
            {REVIEWS.map((r, i) => (
              <Reveal key={i} delay={i * 100} as="figure" className="tr-review">
                <div className="tr-stars" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <blockquote>{r.text}</blockquote>
                <figcaption>{r.name}</figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="tr-section tr-news">
        <Reveal className="tr-wrap tr-news-inner">
          <p className="tr-eyebrow">Stay in the loop</p>
          <h2 className="tr-h2">New drops, first.</h2>
          {subscribed ? (
            <p className="tr-msg">Thank you — you're on the list.</p>
          ) : (
            <form className="tr-form" onSubmit={subscribe}>
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit" className="tr-btn tr-btn-solid">Subscribe</button>
            </form>
          )}
        </Reveal>
      </section>
    </main>
  );
}