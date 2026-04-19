export default function BrandFilter({ brands, selected, onSelect }) {
  return (
    <div style={{
      display: "flex", gap: 8, flexWrap: "wrap",
      alignItems: "center",
    }}>
      {["All", ...brands].map((brand) => {
        const active = selected === brand || (brand === "All" && !selected);
        return (
          <button
            key={brand}
            onClick={() => onSelect(brand === "All" ? "" : brand)}
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              border: active ? "none" : "1px solid var(--border)",
              background: active ? "var(--accent)" : "var(--surface)",
              color: active ? "#000" : "var(--text-muted)",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: active ? 700 : 500,
              cursor: "pointer",
              letterSpacing: 0.5,
              transition: "all var(--transition)",
              transform: active ? "scale(1.04)" : "scale(1)",
              whiteSpace: "nowrap",
            }}>
            {brand}
          </button>
        );
      })}
    </div>
  );
}