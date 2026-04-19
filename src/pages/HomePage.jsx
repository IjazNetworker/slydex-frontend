import { useEffect, useState } from "react";
import { getProducts, getBrands } from "../api";
import BrandFilter from "../components/BrandFilter";
import ProductCard from "../components/ProductCard";
import OrderModal from "../components/OrderModal";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderProduct, setOrderProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    getBrands().then(setBrands).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(selectedBrand)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedBrand]);

  const filtered = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      const matchMin =
        priceRange.min === "" || p.sales_price >= Number(priceRange.min);
      const matchMax =
        priceRange.max === "" || p.sales_price <= Number(priceRange.max);
      return matchSearch && matchMin && matchMax;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.sales_price - b.sales_price;
      if (sortBy === "price_desc") return b.sales_price - a.sales_price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem 3rem" }}>

      {/* ── Hero ── */}
      <section style={{
        padding: "3.5rem 0 1.5rem",
        borderBottom: "1px solid var(--border)",
      }}>
        <p style={{
          fontSize: 12, letterSpacing: 3,
          color: "var(--accent)", textTransform: "uppercase", marginBottom: 12,
        }}>
          New Collection 2026
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(42px, 8vw, 80px)",
          lineHeight: 0.95, letterSpacing: 2,
          color: "var(--text)", marginBottom: 16,
        }}>
          STEP INTO<br />
          <span style={{ color: "var(--accent)" }}>COMFORT.</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, maxWidth: 480 }}>
          Premium slides, sneakers & footwear — delivered to your door.
          Order directly via WhatsApp, no hassle.
        </p>
      </section>

      {/* ── Sticky Search + Filters ── */}
      <div style={{
        position: "sticky",
        top: 64,
        zIndex: 50,
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        marginLeft: "-1.5rem",
        marginRight: "-1.5rem",
        padding: "0.75rem 1.5rem",
      }}>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 520, marginBottom: "0.65rem" }}>
          <svg
            style={{
              position: "absolute", left: 14, top: "50%",
              transform: "translateY(-50%)", color: "var(--text-muted)",
              pointerEvents: "none",
            }}
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "10px 36px 10px 40px",
              color: "var(--text)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              outline: "none",
              transition: "border-color var(--transition)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "var(--text-muted)",
                cursor: "pointer", fontSize: 16, lineHeight: 1,
                padding: 0,
              }}>
              ✕
            </button>
          )}
        </div>

        {/* Brand pills + Price + Sort */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          gap: "0.5rem", alignItems: "center",
        }}>

          {/* Brand pills */}
          <BrandFilter
            brands={brands}
            selected={selectedBrand}
            onSelect={setSelectedBrand}
          />

          {/* Divider */}
          <div style={{
            width: 1, height: 28,
            background: "var(--border)", margin: "0 4px",
            flexShrink: 0,
          }} />

          {/* Min price */}
          <input
            type="number"
            placeholder="Min ₹"
            value={priceRange.min}
            onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
            style={{
              width: 80, background: "var(--surface2)",
              border: "1px solid var(--border)", borderRadius: 8,
              padding: "7px 10px", color: "var(--text)",
              fontFamily: "var(--font-body)", fontSize: 13, outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>—</span>

          {/* Max price */}
          <input
            type="number"
            placeholder="Max ₹"
            value={priceRange.max}
            onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
            style={{
              width: 80, background: "var(--surface2)",
              border: "1px solid var(--border)", borderRadius: 8,
              padding: "7px 10px", color: "var(--text)",
              fontFamily: "var(--font-body)", fontSize: 13, outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />

          {/* Clear price button */}
          {(priceRange.min || priceRange.max) && (
            <button
              onClick={() => setPriceRange({ min: "", max: "" })}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: 8, padding: "6px 10px",
                color: "var(--text-muted)", fontSize: 12,
                cursor: "pointer", fontFamily: "var(--font-body)",
              }}>
              Clear
            </button>
          )}

          {/* Sort — pushed to the right */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              marginLeft: "auto",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 8, padding: "7px 10px",
              color: "var(--text)", fontFamily: "var(--font-body)",
              fontSize: 13, outline: "none", cursor: "pointer",
            }}>
            <option value="default">Sort: Default</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="name">Name: A → Z</option>
          </select>
        </div>
      </div>

      {/* ── Results count ── */}
      {!loading && (
        <p style={{
          color: "var(--text-muted)", fontSize: 13,
          margin: "1.25rem 0 0.75rem",
        }}>
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          {search && (
            <span>
              {" "}for "
              <strong style={{ color: "var(--text)" }}>{search}</strong>"
            </span>
          )}
        </p>
      )}

      {/* ── Product Grid ── */}
      {loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.25rem",
          marginTop: "1rem",
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              height: 380, opacity: 0.4,
            }} />
          ))}
        </div>

      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: 32, letterSpacing: 2,
            color: "var(--text-muted)",
          }}>
            NO PRODUCTS FOUND
          </p>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 14 }}>
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearch("");
              setPriceRange({ min: "", max: "" });
              setSelectedBrand("");
              setSortBy("default");
            }}
            style={{
              marginTop: 20,
              padding: "10px 22px",
              background: "var(--accent-dim)",
              color: "var(--accent)",
              border: "1px solid var(--accent)",
              borderRadius: 10,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontWeight: 600, fontSize: 13,
            }}>
            Reset All Filters
          </button>
        </div>

      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.25rem",
          marginTop: "0.5rem",
        }}>
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOrder={setOrderProduct}
            />
          ))}
        </div>
      )}

      {/* ── Order Modal ── */}
      {orderProduct && (
        <OrderModal
          product={orderProduct}
          onClose={() => setOrderProduct(null)}
        />
      )}
    </main>
  );
}