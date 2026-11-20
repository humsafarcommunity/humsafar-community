import { waLink, telLink, track } from "../lib/whatsapp";

const WA_ICON = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4C18.6 23.7 24 18.4 24 11.8c0-3.2-1.2-6.2-3.5-8.3zm-8.5 18.1c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 0 1-1.5-5.1C2.1 6.5 6.5 2.1 12 2.1c2.6 0 5.1 1 6.9 2.9a9.6 9.6 0 0 1 2.9 6.9c0 5.4-4.4 9.7-9.8 9.7z" fill="currentColor" />
    <path d="M17.5 14.3c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.42.25-.7.25-1.3.17-1.42-.08-.13-.27-.2-.57-.35z" fill="currentColor" />
  </svg>
);
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
          {WA_ICON} <span>WhatsApp</span>
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
