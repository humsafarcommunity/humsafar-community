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
      title: "Top Tours",
      links: [
        { label: "Manali & Kasol", href: "/packages/manali-kasol-solang-valley-atal-tunnel" },
        { label: "Kedarnath Yatra", href: "/packages/kedarnath-yatra-char-dham-trek" },
        { label: "Jaisalmer Desert", href: "/packages/jaisalmer-desert-safari-golden-fort" },
        { label: "Bali Getaway", href: "/packages/bali-getaway-tropical-paradise" },
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

  const socialIcons = [
    {
      name: 'Instagram',
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
      href: dynamicSite.socials?.instagram || "#"
    },
    {
      name: 'Facebook',
      path: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z",
      href: dynamicSite.socials?.facebook || "#"
    },
    {
      name: 'Twitter',
      path: "M23.953 4.57c-.885.392-1.83.656-2.825.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
      href: dynamicSite.socials?.twitter || "#"
    }
  ];

  return (
    <footer
      style={{
        background: "#080808",
        color: "#64748b",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
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
                  fontFamily: "Playfair Display, serif",
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
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#64748b", marginBottom: 20 }}>
              {dynamicSite.description || "Curating authentic group travel experiences across the Himalayas and beyond since 2020."}
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              {socialIcons.map((icon) => (
                <a
                  key={icon.name}
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={icon.name}
                  style={{
                    color: "#475569",
                    transition: "color 0.2s ease",
                    display: "flex"
                  }}
                  className="social-icon"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d={icon.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Groups */}
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 style={{ color: "#fff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 20 }}>
                {group.title}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ color: "#64748b", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
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
            <h3 style={{ color: "#fff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 20 }}>
              Contact Us
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ fontSize: 13, color: "#64748b", display: "flex", gap: 12, alignItems: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <a href={`mailto:${dynamicSite.email || "humsafarcommunity4@gmail.com"}`} style={{ color: "inherit", textDecoration: "none" }}>{dynamicSite.email || "humsafarcommunity4@gmail.com"}</a>
              </div>
              <div style={{ fontSize: 13, color: "#64748b", display: "flex", gap: 12, alignItems: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href={`https://wa.me/${(dynamicSite.whatsapp || "916268496389").toString().replace(/\D/g, "")}`} style={{ color: "inherit", textDecoration: "none" }}>{dynamicSite.phone || "+91 62684 96389"}</a>
              </div>
              <div style={{ fontSize: 13, color: "#64748b", display: "flex", gap: 12, alignItems: "flex-start" }}>
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
            color: "#475569",
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
  );
}
