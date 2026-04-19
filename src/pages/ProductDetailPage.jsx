import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "../api";
import OrderModal from "../components/OrderModal";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    getProduct(id).then(setProduct).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ maxWidth: 1200, margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto" }} />
    </div>
  );

  if (!product) return (
    <div style={{ maxWidth: 1200, margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--text-muted)" }}>PRODUCT NOT FOUND</p>
      <Link to="/" style={{ color: "var(--accent)", fontSize: 14, marginTop: 16, display: "inline-block" }}>← Back to Shop</Link>
    </div>
  );

  const outOfStock = product.stock === 0;

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <Link to="/" style={{
        color: "var(--text-muted)", fontSize: 13, display: "inline-flex",
        alignItems: "center", gap: 6, marginBottom: "2rem",
        transition: "color var(--transition)",
      }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
        ← Back to Shop
      </Link>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "3rem", alignItems: "start",
      }}>
        {/* Image */}
        <div style={{
          borderRadius: 20, overflow: "hidden",
          border: "1px solid var(--border)",
          background: "var(--surface2)",
          aspectRatio: "4/3",
        }}>
          <img src={product.image} alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <span style={{
              fontSize: 11, letterSpacing: 2, color: "var(--accent)",
              textTransform: "uppercase", fontWeight: 700,
            }}>{product.brand}</span>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: 1.5, lineHeight: 1.05,
              marginTop: 6,
            }}>{product.name}</h1>
          </div>

          {product.description && (
            <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7 }}>
              {product.description}
            </p>
          )}

          <div style={{
            display: "flex", alignItems: "center", gap: "1.5rem",
            borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
            padding: "1.25rem 0",
          }}>
            <div>
              <p style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Price</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 38, color: "var(--accent)", letterSpacing: 1 }}>
                ₹{Number(product.sales_price).toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Stock</p>
              <p style={{
                fontWeight: 700, fontSize: 16,
                color: product.stock > 5 ? "#4ade80" : product.stock > 0 ? "#facc15" : "var(--danger)",
              }}>
                {product.stock > 0 ? `${product.stock} pairs left` : "Sold Out"}
              </p>
            </div>
          </div>

          <button
            disabled={outOfStock}
            onClick={() => !outOfStock && setOrdering(true)}
            style={{
              padding: "16px 24px",
              background: outOfStock ? "var(--surface2)" : "#25D366",
              color: outOfStock ? "var(--text-muted)" : "#fff",
              border: "none", borderRadius: 14,
              fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16,
              cursor: outOfStock ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all var(--transition)",
            }}>
            {!outOfStock && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.107 1.518 5.83L.057 23.857l6.218-1.433A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.009-1.374l-.36-.214-3.692.85.875-3.593-.235-.369A9.818 9.818 0 1112 21.818z"/>
              </svg>
            )}
            {outOfStock ? "Currently Unavailable" : "Order Now via WhatsApp"}
          </button>

          <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
            🔒 Secure order • Fast delivery • WhatsApp confirmation
          </p>
        </div>
      </div>

      {ordering && <OrderModal product={product} onClose={() => setOrdering(false)} />}
    </main>
  );
}