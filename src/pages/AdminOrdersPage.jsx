import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "../api";

const BACKEND_URL = "https://slydex-backend.onrender.com";

const STATUS_CONFIG = {
  pending:   { bg: "rgba(250,204,21,0.1)",  color: "#facc15", label: "Pending"   },
  completed: { bg: "rgba(74,222,128,0.1)",  color: "#4ade80", label: "Completed" },
  cancelled: { bg: "rgba(255,77,77,0.1)",   color: "#ff4d4d", label: "Cancelled" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchOrders = (status = "") => {
    setLoading(true);
    getOrders(status)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
  fetchOrders(statusFilter);

  const interval = setInterval(() => {
    fetchOrders(statusFilter);
  }, 3000); // every 3 seconds

  return () => clearInterval(interval);
}, [statusFilter]);

 const handleStatusChange = async (id, newStatus) => {
  setUpdating(id);
  try {
    await updateOrder(id, newStatus);

    // 🔥 ADD THIS LINE
    fetchOrders(statusFilter);

  } catch (err) {
    console.error(err);
  } finally {
    setUpdating(null);
  }
};

  const allOrders = orders;
  const pendingCount   = orders.filter((o) => o.status === "pending").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
  const totalRevenue   = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.total_price), 0);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{
          fontSize: 11, letterSpacing: 3,
          color: "var(--accent)", textTransform: "uppercase", marginBottom: 6,
        }}>Dashboard</p>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 5vw, 52px)",
          letterSpacing: 2, lineHeight: 1,
        }}>ORDERS</h1>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "1rem", marginBottom: "2rem",
      }}>
        {[
          { label: "Total Orders",   value: allOrders.length, color: "var(--text)",  suffix: ""  },
          { label: "Pending",        value: pendingCount,      color: "#facc15",      suffix: ""  },
          { label: "Completed",      value: completedCount,    color: "#4ade80",      suffix: ""  },
          { label: "Cancelled",      value: cancelledCount,    color: "#ff4d4d",      suffix: ""  },
          { label: "Revenue",        value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: "var(--accent)", suffix: "" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14, padding: "1.25rem",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <span style={{
              fontSize: 11, color: "var(--text-muted)",
              letterSpacing: 1, textTransform: "uppercase",
            }}>{stat.label}</span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: typeof stat.value === "string" ? 24 : 36,
              color: stat.color, lineHeight: 1,
            }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs ── */}
      <div style={{
        display: "flex", gap: 8,
        marginBottom: "1.5rem", flexWrap: "wrap",
      }}>
        {[
          { key: "",           label: "All Orders"  },
          { key: "pending",    label: "Pending"     },
          { key: "completed",  label: "Completed"   },
          { key: "cancelled",  label: "Cancelled"   },
        ].map(({ key, label }) => {
          const active = statusFilter === key;
          return (
            <button key={key} onClick={() => setStatusFilter(key)}
              style={{
                padding: "8px 18px", borderRadius: 999,
                border: active ? "none" : "1px solid var(--border)",
                background: active ? "var(--accent)" : "var(--surface)",
                color: active ? "#000" : "var(--text-muted)",
                fontFamily: "var(--font-body)",
                fontSize: 13, fontWeight: active ? 700 : 500,
                cursor: "pointer",
                transition: "all var(--transition)",
              }}>
              {label}
            </button>
          );
        })}

        {/* Refresh button */}
        <button
          onClick={() => fetchOrders(statusFilter)}
          style={{
            marginLeft: "auto",
            padding: "8px 16px", borderRadius: 999,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            transition: "all var(--transition)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Orders List ── */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              background: "var(--surface)",
              borderRadius: 14, height: 96, opacity: 0.4,
            }} />
          ))}
        </div>

      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: 28, letterSpacing: 2, color: "var(--text-muted)",
          }}>NO ORDERS</p>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 8 }}>
            {statusFilter ? `No ${statusFilter} orders yet` : "No orders placed yet"}
          </p>
        </div>

      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {orders.map((order) => {
            const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const isUpdating = updating === order.id;
            const productImg = order.product?.image?.startsWith("http")
              ? order.product.image
              : `${BACKEND_URL}${order.product?.image}`;

            return (
              <div key={order.id} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "1rem 1.25rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "1rem",
                transition: "border-color var(--transition)",
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              >

                {/* Order ID */}
                <div style={{ minWidth: 36 }}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1 }}>ID</p>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22, color: "var(--accent)", lineHeight: 1,
                  }}>#{order.id}</p>
                </div>

                {/* Product image + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 160 }}>
                  <img
                    src={productImg}
                    alt={order.product?.name}
                    style={{
                      width: 48, height: 48,
                      borderRadius: 8, objectFit: "cover",
                      border: "1px solid var(--border)",
                      flexShrink: 0,
                    }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase" }}>
                      Product
                    </p>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>
                      {order.product?.name ?? "—"}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Qty: <strong style={{ color: "var(--text)" }}>{order.quantity}</strong>
                      &nbsp;·&nbsp;
                      <span style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 14 }}>
                        ₹{Number(order.total_price).toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Customer */}
                <div style={{ flex: 1, minWidth: 130 }}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase" }}>
                    Customer
                  </p>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{order.customer_name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{order.phone}</p>
                </div>

                {/* Address */}
                <div style={{ flex: 1, minWidth: 130 }}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase" }}>
                    Address
                  </p>
                  <p style={{
                    fontSize: 13, color: "var(--text-muted)",
                    maxWidth: 180,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {order.address || "—"}
                  </p>
                </div>

                {/* Date */}
                <div style={{ minWidth: 80 }}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase" }}>
                    Date
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--border)" }}>
                    {new Date(order.created_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Status badge */}
                <span style={{
                  background: s.bg, color: s.color,
                  fontSize: 11, fontWeight: 700,
                  padding: "4px 12px", borderRadius: 999,
                  letterSpacing: 0.5, whiteSpace: "nowrap",
                  border: `1px solid ${s.color}22`,
                }}>
                  {s.label}
                </span>

                {/* Status changer */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <select
                    value={order.status}
                    disabled={isUpdating}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 8, padding: "7px 10px",
                      color: isUpdating ? "var(--text-muted)" : "var(--text)",
                      fontFamily: "var(--font-body)",
                      fontSize: 13, outline: "none",
                      cursor: isUpdating ? "not-allowed" : "pointer",
                      minWidth: 130,
                    }}>
                    <option value="pending">⏳ Pending</option>
                    <option value="completed">✅ Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>

                  {/* Spinner while updating */}
                  {isUpdating && (
                    <span style={{
                      width: 16, height: 16,
                      border: "2px solid var(--border)",
                      borderTopColor: "var(--accent)",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block", flexShrink: 0,
                    }} />
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}