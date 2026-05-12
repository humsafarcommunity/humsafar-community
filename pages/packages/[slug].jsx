// pages/packages/[slug].jsx — Dynamic tour detail page
// Full SEO + AEO + GEO + SXO + AIO optimization

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import SEOHead from "../../components/SEOHead";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  SITE,
  getFreshData,
  generateTourSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "../../data";

export default function TourDetailPage({ tour, relatedTours, site: freshSite }) {
  const dynamicSite = freshSite || SITE || { whatsapp: "916268496389", name: "Humsafar Community" };
  const router = useRouter();
  const [activeDate, setActiveDate] = useState(null);
  const [pax, setPax] = useState(1);
  const [sharing, setSharing] = useState("Quad");
  const [expandedDay, setExpandedDay] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Get next 5 Saturdays
  const saturdays = useMemo(() => getNextSaturdays(5), []);
  useEffect(() => {
    if (!activeDate && saturdays.length > 0) setActiveDate(saturdays[0]);
  }, [activeDate, saturdays]);

  if (router.isFallback) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!tour) return null;

  const sharingOptions = [
    { type: "Quad", surcharge: 0 },
    { type: "Triple", surcharge: 1500 },
    { type: "Double", surcharge: 3000 },
  ];

  const currentSurcharge = sharingOptions.find((o) => o.type === sharing)?.surcharge || 0;
  const pricePerPerson = Number(tour.price) + currentSurcharge;
  const totalPrice = pricePerPerson * pax;

  const waMessage = `Hi Humsafar! I am interested in *${tour.title}*.\n\n🗓 Date: ${activeDate ? new Date(activeDate).toDateString() : "TBD"}\n🏨 Sharing: ${sharing}\n👥 People: ${pax}\n💰 Total: ₹${totalPrice.toLocaleString("en-IN")}\n⏱ Duration: ${tour.duration}\n\nPlease share more details.`;

  const schemas = [
    generateOrganizationSchema(dynamicSite),
    generateTourSchema(tour, dynamicSite),
    ...(tour.faqs?.length > 0 ? [generateFAQSchema(tour.faqs, dynamicSite)] : []),
  ];

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Tour Packages", path: "/packages" },
    { name: tour.title, path: `/packages/${tour.slug}` },
  ];

  return (
    <>
      <SEOHead
        title={tour.seoTitle || tour.title}
        description={tour.seoDesc}
        keywords={tour.keywords}
        image={tour.img}
        url={`/packages/${tour.slug}`}
        type="product"
        schemas={schemas}
        breadcrumbs={breadcrumbs}
        site={dynamicSite}
      />

      <Navbar site={dynamicSite} isSolid={true} />

      {/* Schema breadcrumb display */}
      <nav
        aria-label="Breadcrumb"
        style={{
          background: "#f8fafc",
          padding: "85px 0 12px",
          borderBottom: "1px solid #e2e8f0",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 13,
          color: "#64748b",
        }}
      >
        <ol
          style={{ display: "flex", gap: 8, listStyle: "none", maxWidth: 1100, margin: "0 auto", padding: "0 24px", flexWrap: "wrap", boxSizing: "border-box" }}
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {breadcrumbs.map((crumb, i) => (
            <li
              key={i}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {i < breadcrumbs.length - 1 ? (
                <>
                  <Link href={crumb.path} itemProp="item" style={{ color: "#064e3b", textDecoration: "none" }}>
                    <span itemProp="name">{crumb.name}</span>
                  </Link>
                  <span>/</span>
                </>
              ) : (
                <span itemProp="name" style={{ color: "#94a3b8" }}>
                  {crumb.name}
                </span>
              )}
              <meta itemProp="position" content={i + 1} />
            </li>
          ))}
        </ol>
      </nav>

      {/* Mobile booking bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(14px)",
          borderTop: "1px solid #f1f5f9",
          padding: "14px 24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.06)",
          boxSizing: "border-box"
        }}
        className="mobile-book-bar"
      >
        <div>
          <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800, marginBottom: 2 }}>
            {pax} Pax · {sharing} Sharing
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "Playfair Display, serif", color: "#0f172a" }}>
            ₹{totalPrice.toLocaleString("en-IN")}
          </div>
        </div>
        <a
          href={`https://wa.me/${dynamicSite.whatsapp}?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#10b981",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 8,
            fontWeight: 800,
            fontSize: 13,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)"
          }}
          onClick={() => window.gtag?.("event", "whatsapp_click", { event_label: "Mobile Book Bar", value: totalPrice })}
        >
          💬 Book Now
        </a>
      </div>

      {/* Hero Section with Integrated Image Grid */}
      <section style={{ background: "#fff", paddingTop: 85 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 32px" }}>
            <div className="tour-gallery-grid" style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: 8, height: 520, borderRadius: 14, overflow: "hidden", position: "relative", boxShadow: "0 15px 40px rgba(0,0,0,0.08)" }}>
              {/* Main Featured Image with Overlay Content */}
              <div style={{ position: "relative", height: "100%", overflow: "hidden" }} className="featured-img-container">
                <Image src={tour.img} alt={tour.title} fill style={{ objectFit: "cover" }} priority />
              
              {/* Back Button */}
              <Link href="/packages" className="back-btn" style={{ position: "absolute", top: 20, left: 20, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 700, textDecoration: "none", zIndex: 10, textTransform: "uppercase", letterSpacing: 1 }}>
                ← Back
              </Link>

              {/* Gradient & Content Overlay */}
              <div className="hero-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 50%, transparent 80%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "32px" }}>
                <div className="hero-badges" style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                  <span style={{ background: "#10b981", color: "#fff", fontSize: 9, padding: "3px 10px", borderRadius: 4, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
                    {tour.region}
                  </span>
                  <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 9, padding: "3px 10px", borderRadius: 4, fontWeight: 700, textTransform: "uppercase" }}>
                    {tour.duration}
                  </span>
                </div>
                <h1 className="tour-title" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(24px, 4vw, 50px)", fontWeight: 900, color: "#fff", marginBottom: 10, lineHeight: 1.1 }}>
                  {tour.title}
                </h1>
                <div className="hero-meta" style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, display: "flex", gap: 16, flexWrap: "wrap", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  <span>📍 {tour.location}</span>
                  <span>⭐ {tour.rating}</span>
                </div>
              </div>
            </div>

            {/* Side Grid (Thumbnails) */}
            {tour.gallery && tour.gallery.length > 0 && (
              <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 8 }} className="gallery-side-grid">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ position: "relative" }}><Image src={tour.gallery[0] || tour.img} fill style={{ objectFit: "cover" }} alt="Gallery 1" /></div>
                  <div style={{ position: "relative" }}><Image src={tour.gallery[1] || tour.img} fill style={{ objectFit: "cover" }} alt="Gallery 2" /></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ position: "relative" }}><Image src={tour.gallery[2] || tour.img} fill style={{ objectFit: "cover" }} alt="Gallery 3" /></div>
                  <div style={{ position: "relative", filter: "brightness(0.6)" }}>
                    <Image src={tour.gallery[3] || tour.img} fill style={{ objectFit: "cover" }} alt="Gallery 4" />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>
                      +{tour.gallery.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
        </div>
      </section>



      {/* Main content */}
      <main style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 100, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        <div 
          className="responsive-grid"
          style={{ 
            maxWidth: 1100, 
            margin: "0 auto", 
            padding: "32px 24px", 
            display: "grid", 
            gridTemplateColumns: "2.5fr 1fr", 
            gap: 28 
          }}
        >
          <div>
            {/* Highlights */}
            {tour.highlights?.length > 0 && (
              <section aria-label="Trip highlights" style={{ background: "#fff", borderRadius: 12, padding: "24px", marginBottom: 20, border: "1px solid #eef2f6" }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 800, marginBottom: 16, color: "#0f172a" }}>Trip Highlights</h2>
              <ul className="highlights-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, listStyle: "none" }}>
                {tour.highlights.map((h, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "#10b981" }}>✓</div>
                    <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
            )}

            {/* Itinerary */}
            {tour.itinerary?.length > 0 && (
              <section aria-label="Trip itinerary" style={{ marginBottom: 22 }}>
                <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 800, marginBottom: 14, color: "#0f172a" }}>
                  📅 Day-by-Day Itinerary
                </h2>
                {tour.itinerary.map((day, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #eef2f6", marginBottom: 8, overflow: "hidden" }}>
                    <button
                      onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}
                      aria-expanded={expandedDay === i}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ padding: "4px 12px", height: 24, borderRadius: 4, background: expandedDay === i ? "#0f172a" : "#f1f5f9", color: expandedDay === i ? "#fff" : "#475569", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>
                          Day {day.day}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{day.title}</div>
                          {day.meals && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>🍽️ {day.meals}</div>}
                        </div>
                      </div>
                      <span style={{ fontSize: 16, color: "#94a3b8", marginLeft: 8 }}>{expandedDay === i ? "−" : "+"}</span>
                    </button>
                    {expandedDay === i && (
                      <div style={{ padding: "4px 20px 20px 20px", fontSize: 14, color: "#475569", lineHeight: 1.8 }}>
                        <div style={{ borderLeft: "2px solid #ecfdf5", paddingLeft: 16, marginLeft: 2 }}>
                          {day.desc.split(/[.\n]/).filter(p => p.trim()).map((point, idx) => (
                            <div key={idx} style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                              <span style={{ color: "#10b981", fontWeight: 900, flexShrink: 0 }}>•</span>
                              <span>{point.trim()}.</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Inclusions / Exclusions */}
            <div className="inclusions-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[
                { title: "What's Included", items: tour.inclusions, icon: "✓", bg: "#f0fdf4", col: "#16a34a" },
                { title: "What's Excluded", items: tour.exclusions, icon: "✗", bg: "#fef2f2", col: "#dc2626" },
              ].map((sec) => (
                <section key={sec.title} aria-label={sec.title} style={{ background: "#fff", borderRadius: 12, padding: "20px", border: "1px solid #f1f5f9", height: "100%", boxSizing: "border-box" }}>
                  <h3 style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: sec.col, marginBottom: 14 }}>{sec.title}</h3>
                  <ul style={{ listStyle: "none" }}>
                    {sec.items?.map((item, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 18, height: 18, borderRadius: 4, background: sec.bg, flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: sec.col }}>
                          {sec.icon}
                        </div>
                        <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, fontWeight: 500 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            {/* FAQs — AEO: Powers "People Also Ask" in Google */}
            {tour.faqs?.length > 0 && (
              <section
                aria-label="Frequently asked questions"
                style={{ background: "#fff", borderRadius: 18, padding: "26px 28px", border: "1px solid #e2e8f0" }}
                itemScope
                itemType="https://schema.org/FAQPage"
              >
                <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
                  Frequently Asked Questions
                </h2>
                <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
                  Everything you need to know before booking
                </p>
                {tour.faqs.map((faq, i) => (
                  <div
                    key={i}
                    style={{ border: "1px solid #e2e8f0", borderRadius: 13, overflow: "hidden", marginBottom: 10 }}
                    itemProp="mainEntity"
                    itemScope
                    itemType="https://schema.org/Question"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      aria-expanded={expandedFaq === i}
                      style={{ cursor: "pointer", padding: "18px 22px", fontWeight: 600, fontSize: 15, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", width: "100%", border: "none", textAlign: "left", fontFamily: "Plus Jakarta Sans, sans-serif", color: "#1e293b" }}
                    >
                      <span itemProp="name">{faq.q}</span>
                      <span style={{ marginLeft: 12, flexShrink: 0, fontSize: 18 }}>{expandedFaq === i ? "−" : "+"}</span>
                    </button>
                    {expandedFaq === i && (
                      <div
                        style={{ padding: "4px 22px 18px", fontSize: 14, color: "#475569", lineHeight: 1.75, fontFamily: "Plus Jakarta Sans, sans-serif" }}
                        itemProp="acceptedAnswer"
                        itemScope
                        itemType="https://schema.org/Answer"
                      >
                        <span itemProp="text">{faq.a}</span>
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* Booking Sidebar */}
          <aside style={{ position: "sticky", top: 90, height: "fit-content" }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
              <div style={{ background: "#064e3b", padding: "22px", textAlign: "center", color: "#fff" }}>
                <div style={{ fontSize: 10, opacity: 0.7, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Total Cost
                </div>
                <div style={{ fontSize: 38, fontWeight: 900, fontFamily: "Playfair Display, serif" }}>
                  ₹{totalPrice.toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {pax} Person(s) · {sharing} Sharing
                </div>
              </div>
              <div style={{ padding: 20 }}>
                {/* Date selection */}
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "#374151", marginBottom: 10, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Select Departure Date
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 18 }}>
                  {saturdays.map((d, i) => {
                    const dateStr = d.toISOString();
                    const isActive = activeDate === dateStr;
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveDate(dateStr)}
                        style={{ padding: "9px 4px", borderRadius: 10, border: `2px solid ${isActive ? "#064e3b" : "#e2e8f0"}`, background: isActive ? "#ecfdf5" : "#fff", cursor: "pointer", textAlign: "center", fontFamily: "Plus Jakarta Sans, sans-serif", transition: "all 0.15s" }}
                      >
                        <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
                          {d.toLocaleDateString("en-IN", { month: "short" })}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: "#0e1117", fontFamily: "Playfair Display, serif" }}>
                          {d.getDate()}
                        </div>
                        <div style={{ fontSize: 9, color: "#94a3b8" }}>Sat</div>
                      </button>
                    );
                  })}
                </div>

                {/* Sharing type */}
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "#374151", marginBottom: 10, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Occupancy Type
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 18 }}>
                  {sharingOptions.map((o) => (
                    <button
                      key={o.type}
                      onClick={() => setSharing(o.type)}
                      style={{ padding: "9px 4px", borderRadius: 10, border: `2px solid ${sharing === o.type ? "#064e3b" : "#e2e8f0"}`, background: sharing === o.type ? "#ecfdf5" : "#fff", cursor: "pointer", textAlign: "center", fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#0e1117" }}>{o.type}</div>
                      <div style={{ fontSize: 10, color: "#94a3b8" }}>
                        {o.surcharge === 0 ? "Base" : `+₹${o.surcharge.toLocaleString()}`}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Pax counter */}
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "#374151", marginBottom: 10, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Number of Travelers
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", borderRadius: 12, padding: "10px 14px", marginBottom: 18, border: "1px solid #e2e8f0" }}>
                  <button onClick={() => setPax(Math.max(1, pax - 1))} style={{ width: 32, height: 32, borderRadius: 6, background: "#fff", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <span style={{ fontSize: 20, fontWeight: 900, fontFamily: "Playfair Display, serif" }}>{pax}</span>
                  <button onClick={() => setPax(pax + 1)} style={{ width: 32, height: 32, borderRadius: 6, background: "#fff", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>

                <a
                  href={`https://wa.me/${dynamicSite.whatsapp}?text=${encodeURIComponent(waMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "#10b981", color: "#fff", padding: "14px", borderRadius: 10, fontWeight: 800, fontSize: 13, textDecoration: "none", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans, sans-serif", textTransform: "uppercase", letterSpacing: 0.5 }}
                  onClick={() => window.gtag?.("event", "whatsapp_click", { event_label: "Tour Sidebar", value: totalPrice })}
                >
                  💬 Book on WhatsApp
                </a>
                <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 10, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  No payment needed to enquire.
                </p>
              </div>
            </div>

            {/* Trust indicators */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginTop: 16, border: "1px solid #e2e8f0" }}>
              {[
                "✅ Trusted by 50,000+ travelers",
                "⭐ 4.8/5 Google Rating",
                "🔒 100% Secure WhatsApp Booking",
                "💰 No Advance Payment to Enquire",
                "↩️ Easy Cancellation Policy",
              ].map((item, i) => (
                <div key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 8, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <Footer dynamicSite={dynamicSite} />

      <style jsx global>{`
        @media (max-width: 768px) {
          main { padding-bottom: 100px !important; }
          
          .responsive-grid { 
            display: block !important;
            padding: 24px !important; 
            width: 100% !important; 
            box-sizing: border-box !important; 
          }
          
          .tour-gallery-grid {
            display: block !important;
            height: auto !important;
            border-radius: 8px !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .featured-img-container {
            height: 280px !important;
            border-radius: 8px !important;
            margin-bottom: 8px !important;
          }
          .gallery-side-grid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            grid-template-rows: 1fr !important;
            height: 65px !important;
            gap: 8px !important;
            width: 100% !important;
          }
          .hero-overlay {
            padding: 24px !important;
            background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 70%, transparent) !important;
          }
          .tour-title { font-size: 24px !important; font-weight: 900 !important; }
          .hero-meta { font-size: 11px !important; gap: 14px !important; }
          .hero-badges { gap: 8px !important; margin-bottom: 10px !important; }
          .back-btn { top: 16px !important; left: 16px !important; padding: 6px 12px !important; font-size: 10px !important; border-radius: 4px !important; }
          
          .mobile-book-bar { 
            display: flex !important; 
            padding: 14px 24px 32px !important; 
            height: auto !important; 
            border-top: 1px solid #f1f5f9 !important;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.06) !important;
          }
          .mobile-book-bar div:first-child div:last-child { font-size: 20px !important; font-weight: 900 !important; }
          .mobile-book-bar a { padding: 12px 24px !important; font-size: 13px !important; border-radius: 8px !important; }

          aside { 
            display: block !important; 
            position: static !important; 
            margin-top: 24px !important;
            width: 100% !important;
          }
          .inclusions-grid { grid-template-columns: 1fr !important; gap: 16px !important; width: 100% !important; box-sizing: border-box !important; }
          .inclusions-grid section { width: 100% !important; box-sizing: border-box !important; }
          .highlights-grid { grid-template-columns: 1fr !important; }
          
          h2 { font-size: 20px !important; letter-spacing: -0.02em !important; }
          section { padding: 24px !important; border-radius: 12px !important; border: 1px solid #f1f5f9 !important; width: 100% !important; box-sizing: border-box !important; }
        }
      `}</style>
    </>
  );
}

function getNextSaturdays(n = 5) {
  const dates = [];
  let d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  for (let i = 0; i < n; i++) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return dates;
}

// SSG with ISR for maximum SEO performance
export async function getStaticPaths() {
  const data = await getFreshData();
  const paths = data.TOURS
    .filter((tour) => tour && typeof tour.slug === 'string')
    .map((tour) => ({
      params: { slug: tour.slug },
    }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const data = await getFreshData();
  const tour = data.TOURS.find((t) => t.slug === params.slug);
  if (!tour) return { notFound: true };

  const relatedTours = data.TOURS.filter(
    (t) => t._id !== tour._id && t.region === tour.region
  ).slice(0, 3);

  return {
    props: { tour, relatedTours, site: data.SITE },
    revalidate: 60, // ISR: Update every 60s (SXO: Fresh content)
  };
}
