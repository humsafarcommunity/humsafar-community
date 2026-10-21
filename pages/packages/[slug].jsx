// pages/packages/[slug].jsx — Dynamic tour detail page
// Full SEO + AEO + GEO + SXO + AIO optimization

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Accordion from "../../components/Accordion";
import FAQAccordion from "../../components/FAQAccordion";
import SEOHead from "../../components/SEOHead";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LeadForm from "../../components/LeadForm";
import ReviewsSection from "../../components/ReviewsSection";
import { waLink, telLink, track } from "../../lib/whatsapp";
import {
  SITE,
  getFreshData,
  generateTourSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "../../data";

export default function TourDetailPage({ tour, relatedTours, reviews = [], site: freshSite }) {
  const dynamicSite = freshSite || SITE || { whatsapp: "916268496389", name: "Humsafar Community" };
  const router = useRouter();
  const [activeDate, setActiveDate] = useState(null);
  const [pax, setPax] = useState(1);
  const [sharing, setSharing] = useState("Quad");

  // Next departure dates for the day(s) chosen in the CMS (Friday, Saturday or both)
  const departureDay = tour?.departureDay;
  const departures = useMemo(() => getNextDepartures(departureDay, 6), [departureDay]);
  useEffect(() => {
    if (!activeDate && departures.length > 0) setActiveDate(departures[0].toISOString());
  }, [activeDate, departures]);

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

  const selectedDate = activeDate || (departures[0] ? departures[0].toISOString() : null);
  const dateLine = selectedDate ? `🗓 Date: ${new Date(selectedDate).toDateString()}\n` : "";
  const waMessage = `Hi Humsafar! I am interested in *${tour.title}*.\n\n${dateLine}🏨 Sharing: ${sharing}\n👥 People: ${pax}\n💰 Total: ₹${totalPrice.toLocaleString("en-IN")}\n⏱ Duration: ${tour.duration}\n\nPlease share more details.`;
  const waHref = waLink(dynamicSite, waMessage, `/packages/${tour.slug}`);
  const hasTerms = tour.advanceAmount || tour.taxNote || tour.cancellationPolicy || tour.weatherNote;
  const trustLines = [
    dynamicSite.totalTravelers ? `✅ ${dynamicSite.totalTravelers} travellers with us` : "✅ Experienced trip captain on every trip",
    "💰 No payment needed to enquire",
    ...(tour.cancellationPolicy ? ["↩️ Cancellation policy listed below"] : []),
  ];

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
          boxShadow: "0 -10px 40px rgba(0,0,0,0.06)",
          boxSizing: "border-box"
        }}
        className="mobile-book-bar"
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", boxSizing: "border-box" }}>
          <div>
            <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800, marginBottom: 2 }}>
              {pax} Pax · {sharing} Sharing
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "var(--sans)", color: "#0f172a" }}>
              ₹{totalPrice.toLocaleString("en-IN")}
            </div>
          </div>
          <a
            href={telLink(dynamicSite)}
            onClick={() => track("call_click", { event_label: "Tour Mobile Bar" })}
            aria-label="Call Humsafar"
            style={{ background: "#fff", color: "#064e3b", border: "2px solid #064e3b", padding: "10px 16px", borderRadius: 8, fontWeight: 800, fontSize: 13, textDecoration: "none", marginLeft: "auto", marginRight: 8 }}
          >
            📞 Call
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#10b981",
              color: "#fff",
              padding: "12px 24px",
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
      </div>

      {/* Hero Section with Integrated Image Grid */}
      <section style={{ background: "#fff", paddingTop: 85 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 32px" }}>
            <div className="tour-gallery-grid" style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: 8, height: 520, borderRadius: 14, overflow: "hidden", position: "relative", boxShadow: "0 15px 40px rgba(0,0,0,0.08)" }}>
              {/* Main Featured Image with Overlay Content */}
              <div style={{ position: "relative", height: "100%", overflow: "hidden" }} className="featured-img-container">
                <Image src={tour.img || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"} alt={tour.title} fill style={{ objectFit: "cover" }} priority />
              
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
                <h1 className="tour-title" style={{ fontFamily: "var(--sans)", fontSize: "clamp(24px, 4vw, 50px)", fontWeight: 900, color: "#fff", marginBottom: 10, lineHeight: 1.1 }}>
                  {tour.title}
                </h1>
                <div className="hero-meta" style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, display: "flex", gap: 16, flexWrap: "wrap", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  <span>📍 {tour.location}</span>
                </div>
              </div>
            </div>

            {/* Side Grid (Thumbnails) */}
            {tour.gallery && tour.gallery.length > 0 && (
              <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 8 }} className="gallery-side-grid">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ position: "relative" }}><Image src={tour.gallery[0] || tour.img || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"} fill style={{ objectFit: "cover" }} alt="Gallery 1" /></div>
                  <div style={{ position: "relative" }}><Image src={tour.gallery[1] || tour.img || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"} fill style={{ objectFit: "cover" }} alt="Gallery 2" /></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ position: "relative" }}><Image src={tour.gallery[2] || tour.img || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"} fill style={{ objectFit: "cover" }} alt="Gallery 3" /></div>
                  <div style={{ position: "relative", filter: "brightness(0.6)" }}>
                    <Image src={tour.gallery[3] || tour.img || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"} fill style={{ objectFit: "cover" }} alt="Gallery 4" />
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
              <h2 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 800, marginBottom: 16, color: "#0f172a" }}>Trip Highlights</h2>
              <ul className="highlights-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 10, listStyle: "none" }}>
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
              <section aria-label="Trip itinerary" style={{ background: "#fff", borderRadius: 28, padding: "clamp(18px, 4vw, 32px)", border: "1px solid #e2e8f0", marginBottom: 22 }}>
                <Accordion
                  title="Itinerary"
                  expandAll
                  items={tour.itinerary.map((day) => ({
                    badge: `Day ${day.day}`,
                    title: day.title,
                    subtitle: day.meals ? `🍽️ ${day.meals}` : undefined,
                    body: (
                      <div>
                        {String(day.desc || "").split(/[.\n]/).filter((x) => x.trim()).map((point, idx) => (
                          <div key={idx} style={{ marginBottom: 8, display: "flex", gap: 10 }}>
                            <span style={{ color: "#10b981", fontWeight: 900, flexShrink: 0 }}>•</span>
                            <span>{point.trim()}.</span>
                          </div>
                        ))}
                      </div>
                    ),
                  }))}
                />
              </section>
            )}

            {/* Inclusions / Exclusions */}
            <div className="inclusions-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[
                { title: "What's Included", items: tour.inclusions, icon: "✓", bg: "#f0fdf4", col: "#16a34a" },
                { title: "What's Excluded", items: tour.exclusions, icon: "✗", bg: "#fef2f2", col: "#dc2626" },
              ].map((sec) => (
                <section key={sec.title} aria-label={sec.title} style={{ background: "#fff", borderRadius: 24, padding: "24px", border: "1px solid #e2e8f0", height: "100%", boxSizing: "border-box" }}>
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

            {hasTerms && (
              <section aria-label="Booking terms" style={{ background: "#fff", borderRadius: 28, padding: "clamp(18px, 4vw, 32px)", border: "1px solid #e2e8f0" }}>
                <h2 style={{ fontSize: 22, marginBottom: 14, color: "#0e1117" }}>Booking terms</h2>
                <ul style={{ margin: 0, paddingLeft: 20, color: "#475569", lineHeight: 1.8, fontSize: 15 }}>
                  {tour.advanceAmount && <li><strong>Advance to book:</strong> {tour.advanceAmount}</li>}
                  {tour.taxNote && <li><strong>Taxes:</strong> {tour.taxNote}</li>}
                  {tour.cancellationPolicy && <li><strong>Cancellation:</strong> {tour.cancellationPolicy}</li>}
                  {tour.weatherNote && <li><strong>Weather and road closures:</strong> {tour.weatherNote}</li>}
                </ul>
              </section>
            )}

            <LeadForm site={dynamicSite} source={`/packages/${tour.slug}`} trip={tour.title} title="Not ready to book? Get a callback" />

            {reviews.length > 0 && <ReviewsSection reviews={reviews} reviewsUrl={dynamicSite.googleReviewsUrl} />}

            {/* FAQs — Google reads these from the FAQ markup added in `schemas` above */}
            {tour.faqs?.length > 0 && (
              <section aria-label="Frequently asked questions" style={{ background: "#fff", borderRadius: 28, padding: "clamp(18px, 4vw, 32px)", border: "1px solid #e2e8f0" }}>
                <FAQAccordion title="Frequently asked questions" faqs={tour.faqs} defaultOpen={null} />
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
                <div style={{ fontSize: 38, fontWeight: 900, fontFamily: "var(--sans)" }}>
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
                  {departures.map((d, i) => {
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
                        <div style={{ fontSize: 18, fontWeight: 900, color: "#0e1117", fontFamily: "var(--sans)" }}>
                          {d.getDate()}
                        </div>
                        <div style={{ fontSize: 9, color: "#94a3b8" }}>{d.toLocaleDateString("en-IN", { weekday: "short" })}</div>
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
                  <span style={{ fontSize: 20, fontWeight: 900, fontFamily: "var(--sans)" }}>{pax}</span>
                  <button onClick={() => setPax(pax + 1)} style={{ width: 32, height: 32, borderRadius: 6, background: "#fff", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>

                <a
                  href={waHref}
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
                <a href={telLink(dynamicSite)} onClick={() => track("call_click", { event_label: "Tour Sidebar" })} style={{ display: "block", textAlign: "center", marginTop: 6, fontSize: 13, fontWeight: 700, color: "#064e3b", textDecoration: "none" }}>
                  📞 Prefer a call? Tap to call
                </a>
              </div>
            </div>

            {/* Trust indicators */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginTop: 16, border: "1px solid #e2e8f0" }}>
              {trustLines.map((item, i) => (
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
            display: block !important; 
            padding: 0 !important; 
            height: auto !important; 
            border-top: 1px solid #f1f5f9 !important;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.06) !important;
          }
          .mobile-book-bar > div {
            padding: 14px 24px 32px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
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

// departureDay: "saturday" (default), "friday" or "both"
function getNextDepartures(departureDay, n = 6) {
  const weekdays = departureDay === "friday" ? [5] : departureDay === "both" ? [5, 6] : [6];
  const dates = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1); // earliest departure is tomorrow
  while (dates.length < n) {
    if (weekdays.includes(d.getDay())) dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
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
    props: { tour, relatedTours, reviews: JSON.parse(JSON.stringify(data.REVIEWS || [])), site: data.SITE },
    revalidate: 60, // ISR: Update every 60s (SXO: Fresh content)
  };
}
