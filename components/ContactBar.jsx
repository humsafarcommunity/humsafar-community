// A white rounded card that sits across the top edge of the footer:
// WhatsApp number on the left, social media icons on the right.
const DEFAULT_INSTAGRAM = "https://www.instagram.com/humsafar.community/";

const tile = { width: 44, height: 44, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0, textDecoration: "none" };
const letter = { fontFamily: "var(--sans)", fontWeight: 800, fontSize: 22, lineHeight: 1 };

function Instagram() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="#fff" />
    </svg>
  );
}
function YouTube() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
      <path d="M9.5 8.2v7.6L16 12z" />
    </svg>
  );
}

export default function ContactBar({ site = {} }) {
  const wa = String(site.whatsapp || "916268496389").replace(/\D/g, "");
  const phone = site.phone || "+91 62684 96389";
  const socials = site.socials || {};
  const links = [
    { name: "Instagram", href: socials.instagram || DEFAULT_INSTAGRAM, style: { background: "linear-gradient(45deg,#f9a03f,#e1306c 55%,#833ab4)" }, icon: <Instagram /> },
    { name: "YouTube", href: socials.youtube, style: { background: "#ef4a23" }, icon: <YouTube /> },
    { name: "Facebook", href: socials.facebook, style: { background: "#2d5a9e" }, icon: <span style={letter}>f</span> },
    { name: "X", href: socials.twitter, style: { background: "#111" }, icon: <span style={letter}>X</span> },
    { name: "LinkedIn", href: socials.linkedin, style: { background: "#2b75c8" }, icon: <span style={{ ...letter, fontSize: 20 }}>in</span> },
  ].filter((l) => l.href);

  return (
    <div style={{ background: "linear-gradient(to bottom, #fff 50%, #080808 50%)", padding: "0 20px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div
        className="contact-bar"
        style={{ maxWidth: 1100, margin: "0 auto", background: "#fff", borderRadius: 32, boxShadow: "0 10px 40px rgba(15,23,42,0.14)", border: "1px solid #eef2f6", padding: "28px 32px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-around", gap: 28 }}
      >
        <a
          href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi Humsafar! I want to enquire about a trip.")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: "#0f172a" }}
        >
          <span style={{ width: 52, height: 52, borderRadius: 999, background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <span>
            <span style={{ display: "block", fontSize: 15, color: "#475569" }}>Don&apos;t wait any longer, contact us!</span>
            <span style={{ display: "block", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>{phone}</span>
          </span>
        </a>

        <span aria-hidden="true" className="contact-divider" style={{ width: 1, alignSelf: "stretch", background: "#e2e8f0" }} />

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "#475569", marginBottom: 12 }}>Be part of our social media journey!</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {links.map((l) => (
              <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${l.name} — Humsafar Community`} style={{ ...tile, ...l.style }}>
                {l.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 760px) {
          .contact-bar { padding: 24px 20px !important; justify-content: center !important; }
          .contact-divider { display: none; }
        }
      `}</style>
    </div>
  );
}
