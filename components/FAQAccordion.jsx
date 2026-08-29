import { useState } from 'react';

export default function FAQAccordion({ faqs }) {
  const [open, setOpen] = useState(0);
  if (!faqs || faqs.length === 0) return null;

  return (
    <div itemScope itemType="https://schema.org/FAQPage">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{
              border: `1px solid ${isOpen ? '#10b981' : '#e2e8f0'}`,
              borderRadius: 16,
              overflow: "hidden",
              marginBottom: 12,
              background: isOpen ? "#f0fdf4" : "#fff",
              boxShadow: isOpen ? "0 4px 14px rgba(16, 185, 129, 0.08)" : "none",
              transition: "all 0.25s ease",
            }}
            itemScope
            itemType="https://schema.org/Question"
            itemProp="mainEntity"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                cursor: "pointer",
                padding: "20px 24px",
                fontWeight: 700,
                fontSize: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "transparent",
                width: "100%",
                border: "none",
                textAlign: "left",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                color: isOpen ? "#064e3b" : "#0f172a",
                transition: "color 0.2s ease",
                gap: 16,
              }}
            >
              <span itemProp="name">{faq.q}</span>
              <span
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: isOpen ? "#d1fae5" : "#f1f5f9",
                  color: isOpen ? "#064e3b" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.3s ease, background 0.3s ease",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: "0 24px 22px",
                  fontSize: 15,
                  color: "#334155",
                  lineHeight: 1.7,
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
                itemScope
                itemType="https://schema.org/Answer"
                itemProp="acceptedAnswer"
              >
                <span itemProp="text">{faq.a}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

