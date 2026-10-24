import ContactBar from "./ContactBar";
import Link from 'next/link';

export default function Footer({ dynamicSite }) {
  if (!dynamicSite) return null;

  const navGroups = [
    {
      title: "Explore",
      links: [
        { label: "Himachal Trips", href: "/packages?region=himachal" },
        { label: "Uttarakhand", href: "/packages?region=uttarakhand" },
        { label: "Rajasthan", href: "/packages?region=rajasthan" },
        { label: "International", href: "/packages?region=international" },
      ]
    },
    {
      title: "Top Destinations",
      links: [
        { label: "All Tour Packages", href: "/packages" },
        { label: "Manali Tour Packages", href: "/manali-tour-packages" },
        { label: "Spiti Valley Packages", href: "/spiti-tour-packages" },
        { label: "Kasol Tour Packages", href: "/kasol-tour-packages" },
        { label: "Jibhi Tour Packages", href: "/jibhi-tour-packages" },
        { label: "Himachal Group Tours", href: "/packages?region=himachal" },
        { label: "Uttarakhand Treks", href: "/packages?region=uttarakhand" },
        { label: "International Getaways", href: "/packages?region=international" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Travel Blog", href: "/blog" },
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
      ]
    }
  ];


  const trustLogos = (dynamicSite?.trustLogos || []).filter((l) => l?.logo);

  return (
    <>
      {trustLogos.length > 0 && (
        <section aria-label="Registrations and partners" style={{ background: "#fff", padding: "56px 24px 48px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 36 }}>
              <span aria-hidden="true" className="trust-line" style={{ height: 2, width: 64, background: "#334155" }} />
              <h2 style={{ fontSize: "clamp(20px, 3.4vw, 28px)", fontWeight: 800, color: "#1e293b", textAlign: "center", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
                {dynamicSite.trustHeading || "Brands who trust us"}
              </h2>
              <span aria-hidden="true" className="trust-line" style={{ height: 2, width: 64, background: "#334155" }} />
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "28px 56px" }}>
              {trustLogos.map((l, i) => {
                const img = (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.logo} alt={l.name} loading="lazy" style={{ height: 56, width: "auto", maxWidth: 180, objectFit: "contain", filter: "grayscale(1)", opacity: 0.8 }} />
                );
                return (
                  <li key={i}>
                    {l.url ? <a href={l.url} target="_blank" rel="noopener noreferrer" aria-label={l.name}>{img}</a> : img}
                  </li>
                );
              })}
            </ul>
          </div>
          <style jsx>{`
            @media (max-width: 520px) { .trust-line { display: none; } }
          `}</style>
        </section>
      )}
      <ContactBar site={dynamicSite} />
    <footer
      style={{
        background: "#080808",
        color: "#94a3b8",
        padding: "50px 24px 30px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        borderTop: "1px solid #161b22",
      }}
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
            gap: "40px 24px",
            marginBottom: 40,
          }}
          className="footer-grid"
        >
          {/* Logo & About Section */}
          <div className="footer-logo-section" style={{ maxWidth: 280 }}>
            <Link
              href="/"
              style={{ textDecoration: "none", lineHeight: 1.1, display: "flex", flexDirection: "column", marginBottom: 16 }}
            >
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                Humsafar
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#10b981",
                  marginTop: 2,
                }}
              >
                Community
              </div>
            </Link>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#94a3b8", marginBottom: 20 }}>
              {dynamicSite.description || "Curating authentic group travel experiences across the Himalayas and beyond."}
            </p>
          </div>

          {/* Navigation Groups */}
          {navGroups.map((group) => (
            <div key={group.title}>
              <p style={{ color: "#fff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 20 }}>
                {group.title}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ color: "#94a3b8", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <p style={{ color: "#fff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 20 }}>
              Contact Us
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ fontSize: 13, color: "#94a3b8", display: "flex", gap: 12, alignItems: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <a href={`mailto:${dynamicSite.email || "humsafarcommunity4@gmail.com"}`} style={{ color: "inherit", textDecoration: "none" }}>{dynamicSite.email || "humsafarcommunity4@gmail.com"}</a>
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", display: "flex", gap: 12, alignItems: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href={`https://wa.me/${(dynamicSite.whatsapp || "916268496389").toString().replace(/\D/g, "")}`} style={{ color: "inherit", textDecoration: "none" }}>{dynamicSite.phone || "+91 62684 96389"}</a>
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, marginTop: 2 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span>{dynamicSite.address || "Maharaj Wada, Gwalior, India"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid #161b22",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          <span>© {new Date().getFullYear()} {dynamicSite.name} Pvt. Ltd.</span>
          <div style={{ display: "flex", gap: 20 }}>
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-link:hover { color: #10b981 !important; }
        .social-icon:hover { color: #fff !important; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .footer-logo-section { max-width: 100% !important; }
        }
      `}</style>
    </footer>
    </>
  );
}
