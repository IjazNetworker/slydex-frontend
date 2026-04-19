export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      marginTop: "4rem",
      padding: "2rem 1.5rem",
      textAlign: "center",
    }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 3, color: "var(--accent)" }}>SLYDEX</p>
      <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>
        Premium Footwear · Order via WhatsApp · Fast Delivery
      </p>
      <p style={{ color: "var(--border)", fontSize: 12, marginTop: 12 }}>
        © {new Date().getFullYear()} Slydex. All rights reserved.
      </p>
    </footer>
  );
}