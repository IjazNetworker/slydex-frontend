import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "../api";

const STATUS_COLORS = {
  pending:   { bg: "rgba(250,204,21,0.1)",  color: "#facc15", label: "Pending"   },
  completed: { bg: "rgba(74,222,128,0.1)",  color: "#4ade80", label: "Completed" },
  cancelled: { bg: "rgba(255,77,77,0.1)",   color: "#ff4d4d", label: "Cancelled" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState(null); // order id being updated

  const fetchOrders = (status = "") => {
    setLoading(true);
    getOrders(status)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(statusFilter); }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      const updated = await updateOrder(id, newStatus);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: updated.status } : o));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{
          fontSize: 11, letterSpacing: 2,
          color: "var(--accent)", textTransform: "uppercase", marginBottom: 6,
        }}>Dashboard</p>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 5vw, 52px)",
          letterSpacing: 2, lineHeight: 1,
        }}>ORDERS</h1>
      </div>

      {/* Stat cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "1rem", marginBottom: "2rem",
      }}>
        {[
          { label: "Total",     value: counts.all,       color: "var(--text)"    },
          { label: "Pending",   value: counts.pending,   color: "#facc15"        },
          { label: "Completed", value: counts.completed, color: "#4ade80"        },
          { label: "Cancelled", value: counts.cancelled, color: "#ff4d4d"        },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14, padding: "1.25rem",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase" }}>
              {stat.label}
            </span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 36, color: stat.color, lineHeight: 1,
            }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{
        display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap",
      }}>
        {["", "pending", "completed", "cancelled"].map(s => {
          const active = statusFilter === s;
          const label = s === "" ? "All Orders" : s.charAt(0).toUpperCase() + s.slice(1);
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
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
      </div>

      {/* Orders table / cards */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              background: "var(--surface)", borderRadius: 14,
              height: 80, opacity: 0.4,
            }} />
          ))}
        </div>

      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
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
          {orders.map(order => {
            const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            const isUpdating = updating === order.id;

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
              }}>
                {/* Order ID */}
                <div style={{ minWidth: 40 }}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1 }}>ID</p>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20, color: "var(--accent)",
                  }}>#{order.id}</p>
                </div>

                {/* Customer */}
                <div style={{ flex: 1, minWidth: 120 }}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase" }}>Customer</p>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>{order.customer_name}</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{order.phone}</p>
                </div>

                {/* Product */}
                <div style={{ flex: 1, minWidth: 120 }}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase" }}>Product</p>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>
                    {typeof order.product === "object"
                      ? order.product.name
                      : `Product #${order.product}`}
                  </p>
                </div>

                {/* Date */}
                <div style={{ minWidth: 90 }}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase" }}>Date</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>

                {/* Status badge */}
                <span style={{
                  background: s.bg, color: s.color,
                  fontSize: 12, fontWeight: 700,
                  padding: "4px 12px", borderRadius: 999,
                  letterSpacing: 0.5, whiteSpace: "nowrap",
                }}>
                  {s.label}
                </span>

                {/* Status changer */}
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
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {isUpdating && (
                  <span style={{
                    width: 16, height: 16,
                    border: "2px solid var(--border)",
                    borderTopColor: "var(--accent)",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                    flexShrink: 0,
                  }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}