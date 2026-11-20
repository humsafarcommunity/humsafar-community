import { waLink, telLink, track } from "../lib/whatsapp";

import WhatsAppLogo from "./WhatsAppLogo";

const CALL_ICON = (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

// Sticky WhatsApp + Call + Enquire bar at the bottom of the screen on phones.
// "Enquire" opens the existing enquiry popup (EnquiryModal listens for the "open-enquiry" event).
export default function MobileCtaBar({ site, message, source }) {
  const base = { minHeight: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontWeight: 800, fontSize: 15, textDecoration: "none", fontFamily: "var(--sans)", border: "none", cursor: "pointer", padding: "0 8px" };
  return (
    <>
      <div className="cta-bar" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 90, background: "rgba(255,255,255,0.97)", borderTop: "1px solid #e2e8f0", boxShadow: "0 -8px 30px rgba(0,0,0,0.10)", padding: "10px 12px max(10px, env(safe-area-inset-bottom))", gap: 8 }}>
        <a className="cta-whatsapp" href={waLink(site, message || "Hi Humsafar! I want to enquire about a trip.", source)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { event_label: `sticky_bar${source ? `:${source}` : ""}` })} style={{ ...base, flex: 1.5, background: "#25D366", color: "#fff" }}>
          <WhatsAppLogo size={25} /> <span>WhatsApp</span>
        </a>
        <a href={telLink(site)} onClick={() => track("call_click", { event_label: `sticky_bar${source ? `:${source}` : ""}` })} style={{ ...base, flex: 1, background: "#ecfdf5", color: "#064e3b" }}>
          {CALL_ICON} Call
        </a>
        <button type="button" onClick={() => { track("enquiry_open", { event_label: "sticky_bar" }); window.dispatchEvent(new Event("open-enquiry")); }} style={{ ...base, flex: 1, background: "#E8681E", color: "#fff" }}>
          Enquire
        </button>
      </div>
      <style jsx global>{`
        .cta-bar { display: none; }
        .cta-bar .cta-whatsapp { border-radius: 999px !important; box-shadow: 0 4px 12px rgba(37, 211, 102, .24); transition: background .18s ease, transform .18s ease, box-shadow .18s ease; }
        .cta-bar .cta-whatsapp:hover { background: #1ebe5d !important; box-shadow: 0 6px 16px rgba(37, 211, 102, .32); transform: translateY(-1px); text-decoration: none; }
        .cta-bar .cta-whatsapp:active { transform: scale(.98); }
        @media (max-width: 768px) { .cta-bar { display: flex; } body { padding-bottom: 78px; } }
      `}</style>
    </>
  );
}
