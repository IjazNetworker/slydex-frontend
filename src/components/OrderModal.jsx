import { useRef, useState } from "react";
import { createOrder } from "../api";

export default function OrderModal({ product, onClose }) {
  const nameRef = useRef();
  const phoneRef = useRef();
  const addressRef = useRef();
  const qtyRef = useRef();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const salesPrice = Number(product.sales_price);
  const maxQty = product.stock;
  const defaultQty = product.selectedQty || 1;

  const validate = () => {
    const e = {};
    const name = nameRef.current?.value?.trim();
    const phone = phoneRef.current?.value?.trim();
    const address = addressRef.current?.value?.trim();
    const qty = Number(qtyRef.current?.value);

    if (!name) e.customer_name = "Name is required";
    if (!phone) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(phone)) e.phone = "Enter valid 10-digit number";
    if (!address) e.address = "Address is required";
    if (!qty || qty < 1 || qty > maxQty) e.quantity = `Enter between 1 and ${maxQty}`;
    return e;
  };

  const BACKEND_URL = "https://slydex-backend.onrender.com";

 const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const name = nameRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const address = addressRef.current.value.trim();
    const qty = Number(qtyRef.current.value);
    const totalRaw = salesPrice * qty;

    // ✅ Build WhatsApp URL before async call
    const msg = encodeURIComponent(
      `🛍️ *New Order - SLYDEX*\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `🏷️ *Brand:* ${product.brand}\n` +
      `🔢 *Quantity:* ${qty}\n` +
      `💰 *Total:* ₹${totalRaw.toLocaleString("en-IN")}\n\n` +
      `👤 *Customer Details*\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Address: ${address}\n\n` +
      `Please confirm my order. Thank you! 🙏`
    );

    // ✅ Sanitize whatsapp number — strip spaces/+/- and add 91 if needed
    const rawNumber = String(product.whatsapp_number).replace(/[\s+\-()]/g, "");
    const waNumber = rawNumber.startsWith("91") ? rawNumber : `91${rawNumber}`;
    const waURL = `https://wa.me/${waNumber}?text=${msg}`;

    // ✅ Open WhatsApp immediately (synchronous — not blocked by browser)
    const waWindow = window.open(waURL, "_blank");

    setLoading(true);
    try {
      await createOrder({
        product: product.id,
        customer_name: name,
        phone,
        address,
        quantity: qty,
        total_price: totalRaw,
      });

      setSuccess(true);

      // ✅ Fallback — if popup was blocked, try again after success
      if (!waWindow || waWindow.closed) {
        window.open(waURL, "_blank");
      }

      setTimeout(() => onClose(), 2000);

    } catch (err) {
      // ✅ If order save fails, still WhatsApp was already opened
      // Just show the error on form
      setErrors(typeof err === "object" ? err : { general: "Order failed. But WhatsApp opened!" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    background: "var(--surface2)",
    border: `1px solid ${hasError ? "var(--danger)" : "var(--border)"}`,
    borderRadius: 10,
    padding: "12px 14px",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: 15,
    outline: "none",
    width: "100%",
    transition: "border-color var(--transition)",
  });

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-muted)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        width: "100%",
        maxWidth: 460,
        maxHeight: "90vh",
        overflowY: "auto",
        animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
        padding: "1.5rem",
      }}>

        {success ? (
          /* ── Success State ── */
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(37,211,102,0.15)",
              display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 1rem",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: 28, letterSpacing: 1, marginBottom: 8,
            }}>Order Placed!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Redirecting you to WhatsApp to confirm...
            </p>
          </div>

        ) : (
          <>
            {/* ── Header ── */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", marginBottom: "1.25rem",
            }}>
              <div>
                <p style={{
                  fontSize: 11, letterSpacing: 1.5,
                  color: "var(--text-muted)",
                  textTransform: "uppercase", marginBottom: 4,
                }}>Place Order</p>
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22, letterSpacing: 1, lineHeight: 1.2,
                }}>{product.name}</h2>
              </div>
              <button onClick={onClose} style={{
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                width: 34, height: 34, borderRadius: 8,
                cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>✕</button>
            </div>

            {/* ── Product Summary ── */}
            <div style={{
              display: "flex", gap: 12, alignItems: "center",
              background: "var(--surface2)", borderRadius: 12,
              padding: "12px", marginBottom: "1.25rem",
              border: "1px solid var(--border)",
            }}>
              <img src={
    product.image?.startsWith("http")
      ? product.image
      : `${BACKEND_URL}${product.image}`
  } alt={product.name}
                style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{product.brand}</p>
                <p style={{ fontWeight: 600, fontSize: 15 }}>{product.name}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                  <span style={{
                    fontSize: 12, color: "var(--text-muted)",
                    textDecoration: "line-through",
                  }}>
                    ₹{Number(product.cost_price).toLocaleString("en-IN")}
                  </span>
                  <span style={{
                    color: "var(--accent)",
                    fontFamily: "var(--font-display)", fontSize: 18,
                  }}>
                    ₹{salesPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Form Fields ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>Your Name</label>
                <input
                  ref={nameRef}
                  type="text"
                  defaultValue=""
                  placeholder="e.g. Ijaz Ahmed"
                  style={inputStyle(errors.customer_name)}
                  onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.target.style.borderColor = errors.customer_name ? "var(--danger)" : "var(--border)"}
                  onChange={() => errors.customer_name && setErrors(er => ({ ...er, customer_name: "" }))}
                />
                {errors.customer_name && (
                  <span style={{ fontSize: 12, color: "var(--danger)" }}>{errors.customer_name}</span>
                )}
              </div>

              {/* Phone */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>WhatsApp Number</label>
                <input
                  ref={phoneRef}
                  type="tel"
                  defaultValue=""
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  style={inputStyle(errors.phone)}
                  onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.target.style.borderColor = errors.phone ? "var(--danger)" : "var(--border)"}
                  onChange={() => errors.phone && setErrors(er => ({ ...er, phone: "" }))}
                />
                {errors.phone && (
                  <span style={{ fontSize: 12, color: "var(--danger)" }}>{errors.phone}</span>
                )}
              </div>

              {/* Address */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>Delivery Address</label>
                <textarea
                  ref={addressRef}
                  defaultValue=""
                  placeholder="Full address with city & pincode"
                  rows={3}
                  style={{
                    ...inputStyle(errors.address),
                    resize: "none",
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.target.style.borderColor = errors.address ? "var(--danger)" : "var(--border)"}
                  onChange={() => errors.address && setErrors(er => ({ ...er, address: "" }))}
                />
                {errors.address && (
                  <span style={{ fontSize: 12, color: "var(--danger)" }}>{errors.address}</span>
                )}
              </div>

              {/* Quantity */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>Quantity</label>
                <input
                  ref={qtyRef}
                  type="number"
                  defaultValue={defaultQty}
                  min={1}
                  max={maxQty}
                  style={inputStyle(errors.quantity)}
                  onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.target.style.borderColor = errors.quantity ? "var(--danger)" : "var(--border)"}
                  onChange={() => errors.quantity && setErrors(er => ({ ...er, quantity: "" }))}
                />
                {errors.quantity && (
                  <span style={{ fontSize: 12, color: "var(--danger)" }}>{errors.quantity}</span>
                )}
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Max available: {maxQty}
                </span>
              </div>

              {/* Total */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--border)",
                paddingTop: "1rem",
              }}>
                <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
                  Total Amount
                </span>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26, color: "var(--accent)",
                }}>
                  ₹{(salesPrice * (Number(qtyRef.current?.value) || defaultQty)).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: "14px",
                  background: loading ? "var(--surface2)" : "#25D366",
                  color: loading ? "var(--text-muted)" : "#fff",
                  border: "none", borderRadius: 12,
                  fontFamily: "var(--font-body)",
                  fontWeight: 700, fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8,
                  transition: "all var(--transition)",
                }}>
                {loading ? (
                  <>
                    <span style={{
                      width: 16, height: 16,
                      border: "2px solid #888",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }} />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.107 1.518 5.83L.057 23.857l6.218-1.433A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.009-1.374l-.36-.214-3.692.85.875-3.593-.235-.369A9.818 9.818 0 1112 21.818z" />
                    </svg>
                    Confirm & Open WhatsApp
                  </>
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
                Order saved → WhatsApp opens automatically ✓
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}