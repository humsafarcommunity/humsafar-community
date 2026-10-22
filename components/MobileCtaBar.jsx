import { waLink, telLink, track } from "../lib/whatsapp";

// Sticky Call + WhatsApp buttons at the bottom of the screen on phones.
export default function MobileCtaBar({ site, message, source }) {
  const base = { flex: 1, minHeight: 50, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, fontSize: 15, textDecoration: "none", fontFamily: "var(--sans)" };
  return (
    <>
      <div className="cta-bar" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40, background: "#fff", borderTop: "1px solid #e2e8f0", boxShadow: "0 -8px 30px rgba(0,0,0,0.08)", padding: "10px 14px max(10px, env(safe-area-inset-bottom))", gap: 10 }}>
        <a href={telLink(site)} onClick={() => track("call_click", { event_label: source || "" })} style={{ ...base, border: "2px solid #064e3b", color: "#064e3b", background: "#fff" }}>
          Call us
        </a>
        <a href={waLink(site, message || "Hi Humsafar! I want to enquire about a trip.", source)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { event_label: source || "" })} style={{ ...base, background: "#047857", color: "#fff" }}>
          WhatsApp
        </a>
      </div>
      <style jsx global>{`
        .cta-bar { display: none; }
        @media (max-width: 768px) { .cta-bar { display: flex; } body { padding-bottom: 76px; } }
      `}</style>
    </>
  );
}
