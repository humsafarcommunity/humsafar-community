// pages/packages/[slug].jsx — Dynamic tour detail page
// Full SEO + AEO + GEO + SXO + AIO optimization

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import FAQAccordion from "../../components/FAQAccordion";
import SEOHead from "../../components/SEOHead";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LeadForm from "../../components/LeadForm";
import ReviewsSection from "../../components/ReviewsSection";
import AttractionsCarousel from "../../components/AttractionsCarousel";
import TripSnapshot from "../../components/TripSnapshot";
import ItineraryActions from "../../components/ItineraryActions";
import BlogCard from "../../components/BlogCard";
import Icon, { highlightIcon } from "../../components/tour-page/Icon";
import HeroSlider from "../../components/tour-page/HeroSlider";
import TabsBar from "../../components/tour-page/TabsBar";
import DayList from "../../components/tour-page/DayList";
import Gallery from "../../components/tour-page/Gallery";
import { TOUR_PAGE_CSS } from "../../components/tour-page/css";
import { blogsForTour, slimBlog } from "../../lib/related";
import { waLink, telLink, track } from "../../lib/whatsapp";
import { getTourSeoMeta } from "../../lib/tourSeo";
import {
  SITE,
  getFreshData,
  generateTourSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "../../data";

export default function TourDetailPage({ tour, relatedTours, guides = [], reviews = [], site: freshSite }) {
  // Trips to a place with its own keyword page link back up to that page
  const hubText = `${tour?.title || ""} ${tour?.slug || ""} ${tour?.location || ""}`.toLowerCase();
  const hubSlug = ["manali", "spiti", "kasol", "jibhi"].find((k) => hubText.includes(k));
  const hubPlace = hubSlug ? { slug: hubSlug, name: hubSlug[0].toUpperCase() + hubSlug.slice(1) } : null;
  // Drop stray call-to-action lines that were pasted into the highlights list in the CMS.
  const cleanHighlights = (tour?.highlights || []).filter((h) => h && !/\[(book now|call us|whatsapp us)\]|ready to book/i.test(h));
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

  // Ensure every published package has unique, useful metadata even when CMS SEO fields are blank.
  const seoMeta = getTourSeoMeta(tour);
  const seoTour = { ...tour, seoTitle: seoMeta.title, seoDesc: seoMeta.description };

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
    generateTourSchema(seoTour, dynamicSite),
    ...(tour.faqs?.length > 0 ? [generateFAQSchema(tour.faqs, dynamicSite)] : []),
  ];

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Tour Packages", path: "/packages" },
    { name: tour.title, path: `/packages/${tour.slug}` },
  ];

  // ── Page layout data (photos, tabs, price strip) ──
  const heroImages = [tour.img, ...(tour.gallery || [])]
    .filter((src, i, arr) => src && arr.indexOf(src) === i)
    .map((src, i) => ({ src, alt: i === 0 ? `${tour.title} — ${tour.location || tour.region || "India"}` : `${tour.title} photo ${i + 1}` }));
  if (heroImages.length === 0) {
    heroImages.push({ src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200", alt: tour.title });
  }
  const galleryImages = (tour.gallery || []).filter(Boolean).map((src, i) => ({ src, alt: `${tour.title} traveller photo ${i + 1}` }));
  const itineraryDays = (tour.itinerary || []).map((day, i) => ({
    badge: `D${day.day || i + 1}`,
    title: day.title,
    subtitle: day.meals ? `Meals: ${day.meals}` : undefined,
    points: String(day.desc || "")
      .split(/\n+|\.\s+/)
      .map((x) => x.trim().replace(/\.$/, ""))
      .filter(Boolean)
      .map((x) => `${x}.`),
  }));
  const hasIncl = (tour.inclusions || []).length > 0 || (tour.exclusions || []).length > 0;
  const tabs = [
    cleanHighlights.length > 0 && { id: "highlights", label: "Highlights" },
    itineraryDays.length > 0 && { id: "itinerary", label: `Itinerary (${itineraryDays.length}D)` },
    hasIncl && { id: "inclusions", label: "Inclusions" },
    galleryImages.length > 0 && { id: "photos", label: `Photos (${galleryImages.length})` },
    tour.faqs?.length > 0 && { id: "faqs", label: "FAQs" },
  ].filter(Boolean);
  const oldPriceNum = Number(String(tour.oldPrice || "").replace(/[^\d]/g, ""));
  const basePrice = Number(tour.price);
  const showOld = oldPriceNum > basePrice && basePrice > 0;
  const savePct = showOld ? Math.round((1 - basePrice / oldPriceNum) * 100) : 0;
  const dayLabel = departureDay === "friday" ? "Friday" : departureDay === "both" ? "Friday & Saturday" : "Saturday";
  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const pageUrl = `${(dynamicSite.url || "https://www.humsafarcommunity.com").replace(/\/$/, "")}/packages/${tour.slug}`;

  const shareTrip = async () => {
    track("share_trip", { event_label: tour.slug });
    try {
      if (navigator.share) { await navigator.share({ title: tour.title, text: `${tour.title} - Humsafar Community`, url: pageUrl }); return; }
    } catch (e) { return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${tour.title}\n${pageUrl}`)}`, "_blank", "noopener");
  };

  return (
    <>
      <SEOHead
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={tour.keywords}
        image={tour.img}
        url={`/packages/${tour.slug}`}
        type="product"
        schemas={schemas}
        breadcrumbs={breadcrumbs}
        site={dynamicSite}
      />

      <Navbar site={dynamicSite} isSolid={true} />
      <style dangerouslySetInnerHTML={{ __html: TOUR_PAGE_CSS }} />

      <div className="tp">
        {/* Schema breadcrumb display */}
        <nav
          aria-label="Breadcrumb"
          style={{ background: "#f8fafc", padding: "85px 0 12px", borderBottom: "1px solid #e2e8f0", fontSize: 13, color: "#64748b" }}
        >
          <ol
            style={{ display: "flex", gap: 8, listStyle: "none", maxWidth: 1100, margin: "0 auto", padding: "0 24px", flexWrap: "wrap", boxSizing: "border-box" }}
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            {breadcrumbs.map((crumb, i) => (
              <li key={i} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {i < breadcrumbs.length - 1 ? (
                  <>
                    <Link href={crumb.path} itemProp="item" style={{ color: "var(--tp-accent)", textDecoration: "none" }}>
                      <span itemProp="name">{crumb.name}</span>
                    </Link>
                    <span>/</span>
                  </>
                ) : (
                  <span itemProp="name" style={{ color: "#64748b" }}>{crumb.name}</span>
                )}
                <meta itemProp="position" content={i + 1} />
              </li>
            ))}
          </ol>
        </nav>

        <HeroSlider images={heroImages} title={tour.title} bestseller={tour.bestseller} region={tour.region} onShare={shareTrip} />

        <div className="tp-summary-wrap">
          <section className="tp-summary" aria-label="Trip summary">
            <div className="tp-pills">
              {tour.duration && (
                <span className="tp-pill tp-pill-dur"><Icon name="clock" />{tour.duration}</span>
              )}
              {Number(tour.reviews) > 0 && Number(tour.rating) > 0 && (
                <span className="tp-pill tp-pill-rate"><Icon name="star" />{Number(tour.rating).toFixed(1)} <span className="tp-num">({tour.reviews} reviews)</span></span>
              )}
            </div>
            <h1 className="tp-title">{tour.title}</h1>
            <div className="tp-meta">
              {tour.location && <span className="pin"><Icon name="pin" />{tour.location}</span>}
              <span className="tp-chip-ok">{dayLabel} departures</span>
            </div>
          </section>
        </div>

        {tabs.length > 1 && <TabsBar tabs={tabs} />}

        {/* Main content */}
        <main className="tp-main">
          <div className="tp-grid">
            <div className="tp-col">
              {cleanHighlights.length > 0 && (
                <section id="highlights" className="tp-card" aria-label="Trip highlights">
                  <div className="tp-sec-head"><h2>Trip Highlights</h2></div>
                  <ul className="tp-hl-grid">
                    {cleanHighlights.map((h, i) => (
                      <li key={i} className="tp-hl">
                        <span className="tp-ico"><Icon name={highlightIcon(h)} /></span>
                        <span className="t">{h}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <TripSnapshot tour={tour} />

              <div style={{ marginBottom: 32 }}><AttractionsCarousel attractions={tour.attractions} /></div>

              {/* Itinerary */}
              <ItineraryActions tour={tour} site={dynamicSite} pageUrl={pageUrl} />
              {itineraryDays.length > 0 && (
                <section id="itinerary" className="tp-card" aria-label="Trip itinerary">
                  <DayList items={itineraryDays} />
                </section>
              )}

              {/* Inclusions / Exclusions */}
              {hasIncl && (
                <div id="inclusions" className="tp-incl">
                  {[
                    { title: "What's Included", items: tour.inclusions, icon: "check", cls: "tp-yes" },
                    { title: "What's Excluded", items: tour.exclusions, icon: "x", cls: "tp-no" },
                  ].map((sec) => (
                    <section key={sec.title} aria-label={sec.title} className={`tp-card ${sec.cls}`}>
                      <h3>{sec.title}</h3>
                      <ul>
                        {sec.items?.map((item, i) => (
                          <li key={i}><Icon name={sec.icon} /><span>{item}</span></li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}

              {galleryImages.length > 0 && (
                <section id="photos" className="tp-card" aria-label="Traveller photo gallery">
                  <div className="tp-sec-head"><h2>Traveller Photo Gallery</h2></div>
                  <Gallery images={galleryImages} />
                </section>
              )}

              {hasTerms && (
                <section aria-label="Booking terms" className="tp-card">
                  <h2>Booking terms</h2>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "#475569", lineHeight: 1.8, fontSize: 15 }}>
                    {tour.advanceAmount && <li><strong>Advance to book:</strong> {tour.advanceAmount}</li>}
                    {tour.taxNote && <li><strong>Taxes:</strong> {tour.taxNote}</li>}
                    {tour.cancellationPolicy && <li><strong>Cancellation:</strong> {tour.cancellationPolicy}</li>}
                    {tour.weatherNote && <li><strong>Weather and road closures:</strong> {tour.weatherNote}</li>}
                  </ul>
                </section>
              )}

              <LeadForm site={dynamicSite} source={`/packages/${tour.slug}`} trip={tour.title} title="Not ready to book? Get a callback" />

              {reviews.length > 0 && <ReviewsSection reviews={reviews} reviewsUrl={dynamicSite.googleReviewsUrl} tourSlug={tour.slug} />}

              {/* FAQs — Google reads these from the FAQ markup added in `schemas` above */}
              {tour.faqs?.length > 0 && (
                <section id="faqs" aria-label="Frequently asked questions" className="tp-card">
                  <FAQAccordion title="Frequently asked questions" faqs={tour.faqs} defaultOpen={null} />
                </section>
              )}
            </div>

            {/* Booking panel */}
            <aside id="booking" className="tp-aside">
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
                <div style={{ background: "var(--tp-accent)", padding: "22px", textAlign: "center", color: "#fff" }}>
                  <div style={{ fontSize: 10, opacity: 0.8, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Total Cost</div>
                  <div style={{ fontSize: 38, fontWeight: 900 }}>₹{totalPrice.toLocaleString("en-IN")}</div>
                  <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{pax} Person(s) · {sharing} Sharing</div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "#374151", marginBottom: 10 }}>Select Departure Date</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 18 }}>
                    {departures.map((d, i) => {
                      const dateStr = d.toISOString();
                      const isActive = activeDate === dateStr;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveDate(dateStr)}
                          aria-pressed={isActive}
                          style={{ padding: "9px 4px", borderRadius: 10, border: `2px solid ${isActive ? "var(--tp-accent)" : "#e2e8f0"}`, background: isActive ? "var(--tp-accent-soft)" : "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}
                        >
                          <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{d.toLocaleDateString("en-IN", { month: "short" })}</div>
                          <div style={{ fontSize: 18, fontWeight: 900, color: "#0e1117" }}>{d.getDate()}</div>
                          <div style={{ fontSize: 9, color: "#64748b" }}>{d.toLocaleDateString("en-IN", { weekday: "short" })}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "#374151", marginBottom: 10 }}>Occupancy Type</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 18 }}>
                    {sharingOptions.map((o) => (
                      <button
                        key={o.type}
                        type="button"
                        onClick={() => setSharing(o.type)}
                        aria-pressed={sharing === o.type}
                        style={{ padding: "9px 4px", borderRadius: 10, border: `2px solid ${sharing === o.type ? "var(--tp-accent)" : "#e2e8f0"}`, background: sharing === o.type ? "var(--tp-accent-soft)" : "#fff", cursor: "pointer", textAlign: "center" }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0e1117" }}>{o.type}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>{o.surcharge === 0 ? "Base" : `+₹${o.surcharge.toLocaleString()}`}</div>
                      </button>
                    ))}
                  </div>

                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "#374151", marginBottom: 10 }}>Number of Travelers</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", borderRadius: 12, padding: "10px 14px", marginBottom: 18, border: "1px solid #e2e8f0" }}>
                    <button type="button" aria-label="Fewer travellers" onClick={() => setPax(Math.max(1, pax - 1))} style={{ width: 32, height: 32, borderRadius: 6, background: "#fff", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontSize: 20, fontWeight: 900 }} aria-live="polite">{pax}</span>
                    <button type="button" aria-label="More travellers" onClick={() => setPax(pax + 1)} style={{ width: 32, height: 32, borderRadius: 6, background: "#fff", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>

                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "var(--tp-accent)", color: "#fff", padding: "14px", borderRadius: 10, fontWeight: 800, fontSize: 13, textDecoration: "none", boxSizing: "border-box", textTransform: "uppercase", letterSpacing: 0.5 }}
                    onClick={() => window.gtag?.("event", "whatsapp_click", { event_label: "Tour Sidebar", value: totalPrice })}
                  >
                    Book on WhatsApp
                  </a>
                  <p style={{ textAlign: "center", fontSize: 11, color: "#64748b", marginTop: 10 }}>No payment needed to enquire.</p>
                  <a href={telLink(dynamicSite)} onClick={() => track("call_click", { event_label: "Tour Sidebar" })} style={{ display: "block", textAlign: "center", marginTop: 6, fontSize: 13, fontWeight: 700, color: "var(--tp-accent)", textDecoration: "none" }}>
                    Prefer a call? Tap to call
                  </a>
                </div>
              </div>

              {/* Trust indicators */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginTop: 16, border: "1px solid #e2e8f0" }}>
                {trustLines.map((item, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 8 }}>{item}</div>
                ))}
              </div>
            </aside>
          </div>
        </main>

        {guides.length > 0 && (
          <section aria-label="Travel guides for this trip" style={{ background: "#f8fafc", padding: "48px 24px 56px", borderTop: "1px solid #e2e8f0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <h2 style={{ fontSize: "clamp(22px, 3.6vw, 30px)", fontWeight: 800, margin: "0 0 8px", color: "#0e1117" }}>Read before you go</h2>
              <p style={{ margin: "0 0 24px", color: "#475569", fontSize: 16 }}>Travel guides for this destination from the Humsafar team.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 24 }}>
                {guides.map((b) => <BlogCard key={b._id || b.slug} blog={b} />)}
              </div>
            </div>
          </section>
        )}

        {hubPlace && (
          <section aria-label={`More ${hubPlace.name} trips`} style={{ background: "#f8fafc", padding: guides.length ? "0 24px 48px" : "40px 24px 48px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 22px", borderRadius: 18, background: "#fff", border: "1px solid #e2e8f0", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontSize: 16, color: "#475569" }}>Comparing options? See every {hubPlace.name} group trip, dates and prices in one place.</span>
              <Link href={`/${hubPlace.slug}-tour-packages`} style={{ fontWeight: 700, fontSize: 15, color: "#047857", textDecoration: "none" }}>All {hubPlace.name} tour packages →</Link>
            </div>
          </section>
        )}

        {/* Mobile booking bar: price per person, call, and book on WhatsApp with the choices made above */}
        <div className="tp-bar">
          <div className="tp-bar-price">
            <div className="tp-bar-now">{fmt(pricePerPerson)}{showOld && <s>{fmt(oldPriceNum)}</s>}</div>
            <span className="tp-bar-sub">{savePct > 0 ? `Save ${savePct}% • ` : ""}Per person</span>
          </div>
          <a className="tp-bar-call" href={telLink(dynamicSite)} aria-label="Call Humsafar" onClick={() => track("call_click", { event_label: "Tour Mobile Bar" })}>
            <Icon name="phone" size={22} />
          </a>
          <a
            className="tp-bar-book"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => window.gtag?.("event", "whatsapp_click", { event_label: "Mobile Book Bar", value: totalPrice })}
          >
            Book Now<Icon name="right" size={18} />
          </a>
        </div>
      </div>

      <Footer dynamicSite={dynamicSite} />
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
    props: { tour, relatedTours, guides: blogsForTour(tour, data.BLOGS || [], 3).map(slimBlog), reviews: JSON.parse(JSON.stringify(data.REVIEWS || [])), site: data.SITE },
    revalidate: 60, // ISR: Update every 60s (SXO: Fresh content)
  };
}
