import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// A row of tall photo cards with the destination name across the top.
// Scrolls sideways (swipe on phones, arrows on desktop). Each card opens that region's tours.
export default function DestinationCards({ title, items = [] }) {
  const rowRef = useRef(null);
  if (!items.length) return null;

  const scrollBy = (dir) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: dir * Math.max(row.clientWidth * 0.8, 260), behavior: "smooth" });
  };

  const arrow = {
    width: 44, height: 44, borderRadius: 999, border: "1px solid #e2e8f0", background: "#fff",
    color: "#0e1117", fontSize: 20, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  };

  return (
    <section aria-label={title} style={{ padding: "56px 0 8px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 12 }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, color: "#0e1117" }}>{title}</h2>
          <div className="dest-arrows" style={{ display: "flex", gap: 8 }}>
            <button type="button" aria-label="Scroll left" onClick={() => scrollBy(-1)} style={arrow}>‹</button>
            <button type="button" aria-label="Scroll right" onClick={() => scrollBy(1)} style={arrow}>›</button>
          </div>
        </div>
      </div>

      <div
        ref={rowRef}
        className="dest-row"
        style={{
          display: "flex", gap: 20, overflowX: "auto", scrollSnapType: "x mandatory",
          padding: "16px max(24px, calc((100vw - 1100px) / 2 + 24px)) 36px",
          scrollbarWidth: "none",
        }}
      >
        {items.map((d) => (
          <Link
            key={d.key}
            href={d.href}
            className="dest-card"
            aria-label={`${d.name} tours`}
            style={{
              position: "relative", flex: "0 0 auto", width: "clamp(200px, 62vw, 250px)", aspectRatio: "2 / 3",
              borderRadius: 28, overflow: "hidden", scrollSnapAlign: "start", background: "#cbd5e1",
              boxShadow: "0 10px 24px rgba(15,23,42,0.18)", textDecoration: "none",
            }}
          >
            <Image src={d.image} alt={d.alt || `${d.name} travel destination`} fill sizes="250px" style={{ objectFit: "cover" }} />
            <span
              style={{
                position: "absolute", top: 0, left: 0, right: 0, padding: "34px 12px 40px", textAlign: "center",
                fontFamily: "'Londrina Solid', var(--sans)", fontWeight: 900, fontSize: "clamp(30px, 8vw, 38px)",
                lineHeight: 1, textTransform: "uppercase", letterSpacing: "0.02em",
                color: d.textColor === "dark" ? "#1e4a72" : "#fff",
                background: d.textColor === "dark"
                  ? "linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)"
                  : "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)",
              }}
            >
              {d.name}
            </span>
          </Link>
        ))}
      </div>

      <style jsx global>{`
        .dest-row::-webkit-scrollbar { display: none; }
        .dest-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .dest-card:hover, .dest-card:focus-visible { transform: translateY(-8px) scale(1.03); box-shadow: 0 18px 36px rgba(15,23,42,0.28); }
        @media (max-width: 700px) { .dest-arrows { display: none !important; } }
        @media (prefers-reduced-motion: reduce) { .dest-card { transition: none; } .dest-card:hover { transform: none; } }
      `}</style>
    </section>
  );
}
