import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ product, onOrder }) {
  const [hovered, setHovered] = useState(false);
  const [qty, setQty] = useState(1);
  const outOfStock = product.stock === 0;

  const discount = Math.round(
    ((product.cost_price - product.sales_price) / product.cost_price) * 100
  );
  // Only show discount badge if sales < cost (i.e. it's actually discounted)
  const showDiscount = product.sales_price < product.cost_price && discount !== 0;

  const decreaseQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQty(q => Math.max(1, q - 1));
  };

  const increaseQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQty(q => Math.min(product.stock, q + 1));
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface)",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "var(--radius)",
        overflow: "hidden",
        transition: "all var(--transition)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(232,255,0,0.08)" : "none",
        display: "flex", flexDirection: "column",
      }}>

      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <div style={{
          width: "100%", paddingTop: "75%",
          position: "relative", background: "var(--surface2)",
          overflow: "hidden",
        }}>
          <img src={product.image} alt={product.name}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }} />

          {/* Brand badge */}
          <span style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            color: "var(--text-muted)", fontSize: 11, fontWeight: 600,
            letterSpacing: 1.5, padding: "4px 10px", borderRadius: 999,
            textTransform: "uppercase",
          }}>{product.brand}</span>

          {/* Discount badge */}
          {showDiscount && !outOfStock && (
            <span style={{
              position: "absolute", top: 12, right: 12,
              background: "var(--accent)", color: "#000",
              fontSize: 11, fontWeight: 800,
              padding: "4px 8px", borderRadius: 8,
              letterSpacing: 0.5,
            }}>
              {Math.abs(discount)}% OFF
            </span>
          )}

          {/* Out of stock overlay */}
          {outOfStock && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.65)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 24, letterSpacing: 3, color: "#fff",
              }}>SOLD OUT</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <Link to={`/product/${product.id}`}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 20, letterSpacing: 1, color: "var(--text)",
            lineHeight: 1.2,
          }}>{product.name}</h3>
        </Link>

        {/* Pricing row */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Cost price strikethrough */}
          <span style={{
            fontSize: 13,
            color: "var(--text-muted)",
            textDecoration: "line-through",
            letterSpacing: 0.3,
          }}>
            ₹{Number(product.cost_price).toLocaleString("en-IN")}
          </span>
          {/* Sales price */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 24, color: "var(--accent)", letterSpacing: 1,
            }}>
              ₹{Number(product.sales_price).toLocaleString("en-IN")}
            </span>
            {showDiscount && (
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: "#4ade80",
                background: "rgba(74,222,128,0.1)",
                padding: "2px 6px", borderRadius: 6,
              }}>
                Save ₹{(Number(product.cost_price) - Number(product.sales_price)).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Quantity selector */}
        {!outOfStock && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "var(--surface2)",
            borderRadius: 10, padding: "4px",
            border: "1px solid var(--border)",
          }}>
            <button onClick={decreaseQty}
              disabled={qty <= 1}
              style={{
                width: 32, height: 32, border: "none",
                background: qty <= 1 ? "transparent" : "var(--surface)",
                color: qty <= 1 ? "var(--border)" : "var(--text)",
                borderRadius: 7, cursor: qty <= 1 ? "not-allowed" : "pointer",
                fontSize: 18, fontWeight: 300,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all var(--transition)",
              }}>−</button>

            <div style={{ textAlign: "center" }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 18, color: "var(--text)", letterSpacing: 1,
                minWidth: 28, display: "inline-block", textAlign: "center",
              }}>{qty}</span>
              <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 0.5, marginTop: -2 }}>
                of {product.stock}
              </p>
            </div>

            <button onClick={increaseQty}
              disabled={qty >= product.stock}
              style={{
                width: 32, height: 32, border: "none",
                background: qty >= product.stock ? "transparent" : "var(--surface)",
                color: qty >= product.stock ? "var(--border)" : "var(--text)",
                borderRadius: 7, cursor: qty >= product.stock ? "not-allowed" : "pointer",
                fontSize: 18, fontWeight: 300,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all var(--transition)",
              }}>+</button>
          </div>
        )}

        {/* Subtotal when qty > 1 */}
        {!outOfStock && qty > 1 && (
          <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
            Subtotal:{" "}
            <strong style={{ color: "var(--accent)" }}>
              ₹{(Number(product.sales_price) * qty).toLocaleString("en-IN")}
            </strong>
          </p>
        )}

        {/* Order button */}
        <button
          disabled={outOfStock}
          onClick={() => !outOfStock && onOrder({ ...product, selectedQty: qty })}
          style={{
            marginTop: "auto",
            padding: "10px 0",
            borderRadius: 10,
            border: "none",
            background: outOfStock
              ? "var(--surface2)"
              : hovered ? "var(--accent)" : "var(--accent-dim)",
            color: outOfStock
              ? "var(--text-muted)"
              : hovered ? "#000" : "var(--accent)",
            fontFamily: "var(--font-body)",
            fontWeight: 700, fontSize: 13,
            cursor: outOfStock ? "not-allowed" : "pointer",
            transition: "all var(--transition)",
            letterSpacing: 0.5,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
          {!outOfStock && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.107 1.518 5.83L.057 23.857l6.218-1.433A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.009-1.374l-.36-.214-3.692.85.875-3.593-.235-.369A9.818 9.818 0 1112 21.818z"/>
            </svg>
          )}
          {outOfStock ? "Unavailable" : `Order ${qty > 1 ? `${qty} pairs` : "Now"} via WhatsApp`}
        </button>
      </div>
    </div>
  );
}