import { useState, useId } from "react";

// Bordered, rounded rows that open to show details.
// items: [{ badge?, title, subtitle?, body }]   body can be text or any React content.
// Closed panels stay in the page HTML (hidden), so search engines still read them.
const GREEN = "#064e3b";
const MINT = "#6ee7b7";

export default function Accordion({ items = [], title, expandAll = false, defaultOpen = 0 }) {
  const uid = useId();
  const [open, setOpen] = useState(() => new Set(defaultOpen === null ? [] : [defaultOpen]));
  if (!items.length) return null;

  const allOpen = open.size === items.length;
  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  const toggleAll = () => setOpen(allOpen ? new Set() : new Set(items.map((_, i) => i)));

  return (
    <div>
      <style jsx global>{`
        .acc-main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 14px; }
        @media (max-width: 480px) { .acc-main { flex-direction: column; align-items: flex-start; gap: 8px; } }
      `}</style>
      {(title || expandAll) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
          {title && <h2 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 800, color: "#0f172a" }}>{title}</h2>}
          {expandAll && items.length > 1 && (
            <button
              type="button"
              onClick={toggleAll}
              style={{ minHeight: 40, padding: "0 20px", borderRadius: 999, border: "1.5px solid #cbd5e1", background: "#f1f5f9", color: "#0f172a", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "var(--sans)" }}
            >
              {allOpen ? "Collapse All" : "Expand All"}
            </button>
          )}
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {items.map((item, i) => {
          const isOpen = open.has(i);
          const panelId = `${uid}-panel-${i}`;
          return (
            <div
              key={i}
              style={{
                border: `2px solid ${GREEN}`,
                borderRadius: 28,
                background: isOpen ? "#f0fdf4" : "#fff",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--sans)", minHeight: 64 }}
              >
                <span className="acc-main">
                {item.badge && (
                  <span style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 12, border: `2px solid ${GREEN}`, background: MINT, color: GREEN, fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}>
                    {item.badge}
                  </span>
                )}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 16, fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}>{item.title}</span>
                  {item.subtitle && <span style={{ display: "block", fontSize: 13, color: "#64748b", marginTop: 3 }}>{item.subtitle}</span>}
                </span>
                </span>
                <span
                  aria-hidden="true"
                  style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, border: `2px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", color: GREEN, fontSize: 22, fontWeight: 500, lineHeight: 1, background: isOpen ? MINT : "#fff" }}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              <div id={panelId} hidden={!isOpen} style={{ padding: "0 22px 22px", fontSize: 15, color: "#334155", lineHeight: 1.75 }}>
                {item.body}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
