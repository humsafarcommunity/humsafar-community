import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar({ site, isSolid = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.asPath]);

  const navLinks = [
    { href: "/", label: "Explore" },
    { href: "/packages", label: "Upcoming Tours" },
    { href: "/custom-trips", label: "Custom Trips" },
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Travel Blog" },
  ];

  const activeHeaderStyle = isScrolled || isSolid;

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          padding: activeHeaderStyle ? "12px 24px" : "20px 24px",
          background: activeHeaderStyle ? "rgba(255, 255, 255, 0.98)" : "transparent",
          backdropFilter: activeHeaderStyle ? "blur(14px)" : "none",
          borderBottom: activeHeaderStyle ? "1px solid rgba(0,0,0,0.06)" : "none",
          transition: "all 0.3s ease",
          boxSizing: "border-box"
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          {/* Logo Section */}
          <Link href="/" style={{ textDecoration: "none", zIndex: 1100 }}>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: activeHeaderStyle ? "#0e1117" : "#fff",
                  transition: "color 0.3s",
                }}
              >
                Humsafar
              </span>
              <span
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
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-only">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: activeHeaderStyle ? "#475569" : "rgba(255,255,255,0.95)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                className="nav-link"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${(site?.whatsapp || '916268496389').toString().replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#10b981",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                marginLeft: 12,
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)"
              }}
            >
              WhatsApp
            </a>
          </div>

          {/* Burger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 8,
              display: "none",
              zIndex: 1100,
            }}
            className="mobile-only"
          >
            <div style={{ width: 24, height: 2, background: (activeHeaderStyle && !isMobileMenuOpen) ? "#0e1117" : "#fff", marginBottom: 5, transition: "0.3s", transform: isMobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }}></div>
            <div style={{ width: 24, height: 2, background: (activeHeaderStyle && !isMobileMenuOpen) ? "#0e1117" : "#fff", marginBottom: 5, transition: "0.3s", opacity: isMobileMenuOpen ? 0 : 1 }}></div>
            <div style={{ width: 24, height: 2, background: (activeHeaderStyle && !isMobileMenuOpen) ? "#0e1117" : "#fff", transition: "0.3s", transform: isMobileMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }}></div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.95)",
          backdropFilter: "blur(20px)",
          zIndex: 1050,
          display: isMobileMenuOpen ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: 40,
        }}
      >
        <button 
           onClick={() => setIsMobileMenuOpen(false)}
           style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "#fff", fontSize: 40, cursor: "pointer" }}
        >
          &times;
        </button>

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              fontFamily: "Playfair Display, serif"
            }}
          >
            {link.label}
          </Link>
        ))}
        <a
          href={`https://wa.me/${(site?.whatsapp || '916268496389').toString().replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#10b981",
            color: "#fff",
            padding: "16px 40px",
            borderRadius: 14,
            fontSize: 18,
            fontWeight: 700,
            textDecoration: "none",
            marginTop: 20
          }}
        >
          Book on WhatsApp
        </a>
      </div>

      <style jsx global>{`
        @media (max-width: 960px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
        }
      `}</style>
    </>
  );
}
