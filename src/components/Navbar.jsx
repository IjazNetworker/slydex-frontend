import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(10,10,10,0.85)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 1.5rem",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 28, letterSpacing: 2,
            color: "var(--accent)", lineHeight: 1,
          }}>SLYDEX</span>
          <span style={{
            background: "var(--accent)", color: "#000",
            fontSize: 9, fontWeight: 700, letterSpacing: 1,
            padding: "2px 6px", borderRadius: 4, marginTop: 2,
          }}>FOOTWEAR</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}
          className="desktop-nav">
          <Link to="/" style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 500,
            transition: "color var(--transition)" }}
            onMouseEnter={e => e.target.style.color = "var(--accent)"}
            onMouseLeave={e => e.target.style.color = "var(--text-muted)"}>
            Shop
          </Link>
          <a href="https://wa.me/" target="_blank" rel="noreferrer"
            style={{
              background: "#25D366", color: "#fff",
              fontSize: 13, fontWeight: 600, padding: "8px 16px",
              borderRadius: 999, display: "flex", alignItems: "center", gap: 6,
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.107 1.518 5.83L.057 23.857l6.218-1.433A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.009-1.374l-.36-.214-3.692.85.875-3.593-.235-.369A9.818 9.818 0 1112 21.818z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}