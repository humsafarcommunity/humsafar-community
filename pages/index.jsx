// pages/index.jsx — Homepage with complete 5-layer optimization
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import SEOHead from "../components/SEOHead";
import TourCard from "../components/TourCard";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import FAQAccordion from "../components/FAQAccordion";
import Footer from "../components/Footer";
import {
  SITE,
  REVIEWS,
  getFreshData,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateFAQSchema,
} from "../data";

// ──────────────────────────────────────────────────────────────────
// HOMEPAGE COMPONENT
// ──────────────────────────────────────────────────────────────────

export default function HomePage({ tours = [], blogs = [], banners = [], site: freshSite, seo: seoData }) {
  const dynamicSite = freshSite?.whatsapp ? freshSite : (SITE || { name: "Humsafar Community", whatsapp: "916268496389" });
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Auto-advance hero slider
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % (banners.length || 1)),
      5500
    );
    return () => clearInterval(timer);
  }, [banners?.length]);

  // SXO: Scroll detection for sticky nav
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset loading state if route transition terminates or errors
  useEffect(() => {
    const handleStop = () => setIsSearching(false);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);
    return () => {
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router.events]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const filtered = (tours || []).filter(
    (t) =>
      t &&
      (selectedRegion === "all" || t.region === selectedRegion) &&
      (selectedType === "all" || t.type === selectedType)
  );
  
  const bestsellers = (tours || []).some(t => t?.bestseller) 
    ? (tours || []).filter((t) => t?.bestseller).slice(0, 4)
    : (tours || []).slice(0, 4);

  const internationalTours = (tours || []).filter((t) => t?.region === "international").slice(0, 4);

  const isDefault = selectedRegion === "all" && selectedType === "all";

  // AEO: Homepage FAQs for "People Also Ask"
  const homepageFAQs = dynamicSite.faqs?.length > 0 ? dynamicSite.faqs : [
    {
      q: "Which is the best travel company for Manali tour packages?",
      a: "Humsafar Community is one of India's most trusted travel companies for Manali tours. Packages start at ₹6,999/person for 6 days 5 nights including transport, hotel, meals, and sightseeing.",
    },
    {
      q: "What tour packages does Humsafar Community offer?",
      a: "Humsafar Community offers group tours to Himachal Pradesh (Manali, Kasol, Spiti), Uttarakhand (Kedarnath, Rishikesh), Rajasthan (Jaisalmer, Jodhpur), Kerala backwaters, and international tours. Custom private trips and corporate retreats are also available.",
    },
    {
      q: "How can I book a tour with Humsafar Community?",
      a: "Book via WhatsApp at +91 62684 96389 — no advance payment required to enquire. Select your tour on humsafarcommunity.com, choose your departure date, and click 'Book on WhatsApp'. Our team responds within 2 hours.",
    },
    {
      q: "What is the cheapest tour package from Delhi?",
      a: "Humsafar's most affordable package is Rishikesh Rafting & Camping at ₹3,999/person (2 days). Kasol weekend trip: ₹4,999. Manali group tour: ₹6,999/person for 6 days. All prices include transport, accommodation, and most meals.",
    },
  ];

  // Schema.org structured data for homepage (GEO + AIO)
  const schemas = [
    generateOrganizationSchema(dynamicSite),
    generateWebsiteSchema(dynamicSite),
    generateFAQSchema(homepageFAQs, dynamicSite),
    // ItemList schema for tours (helps AI systems understand your offerings)
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Best Tour Packages India 2025",
      description:
        "Curated travel packages by Humsafar Community for India and international destinations",
      numberOfItems: tours.length,
      itemListElement: tours.map((tour, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tour.title,
        url: `${dynamicSite.url}/packages/${tour.slug}`,
        description: tour.seoDesc,
      })),
    },
  ];

  const regions = [
    { id: "all", label: "All Destinations" },
    { id: "himachal", label: "Himachal Pradesh" },
    { id: "uttarakhand", label: "Uttarakhand" },
    { id: "rajasthan", label: "Rajasthan" },
    { id: "international", label: "International" },
    { id: "other", label: "Rest of India" },
  ];

  const types = [
    { id: "all", label: "All Types" },
    { id: "group", label: "Group Tours" },
    { id: "corporate", label: "Corporate" },
    { id: "custom", label: "Custom" },
    { id: "educational", label: "Educational" },
  ];

  return (
    <>
      {/* ── SEO HEAD ─────────────────────────────────────────────── */}
      <SEOHead
        title="Humsafar Community | Best Group Tours in Himachal & Uttarakhand"
        description="Join Humsafar Community for budget-friendly group tours, backpacking trips, and authentic travel experiences across India. Plan your 2026 adventure today!"
        keywords="Humsafar Community, India travel community, Group tours to Himachal, Uttarakhand tour packages 2026, Adventure tours North India"
        url="/"
        schemas={schemas}
        breadcrumbs={[{ name: "Home", path: "/" }]}
        site={dynamicSite}
        seo={seoData}
      />

      <Navbar site={dynamicSite} />

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section
        aria-label="Hero section with featured destinations"
        style={{
          position: "relative",
          minHeight: "94vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#064e3b",
        }}
      >
        {/* Background images */}
        {(banners || []).map((b, i) => (
          <div
            key={b?.id || i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === currentSlide ? 1 : 0,
              transition: "opacity 1.3s ease",
              zIndex: i === currentSlide ? 1 : 0,
            }}
          >
            <Image
              src={b.url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"}
              alt={b.tag || "Travel Destination"}
              fill
              priority={i === 0}
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.75) 100%)",
            zIndex: 2,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 3,
            textAlign: "center",
            width: "100%",
            maxWidth: 860,
            padding: "100px 24px 120px",
          }}
        >
          {/* AEO/GEO: Hero content is what AI reads first */}
          <div style={{ minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "center" }}>


            {/* AEO: H1 must contain primary keyword — AI systems weight H1 very heavily */}
            <h1
              className="speakable hero-title"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(36px, 7vw, 84px)",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: 20,
                letterSpacing: "-0.02em",
                textShadow: "0 4px 20px rgba(0,0,0,0.4)",
                animation: "fadeIn 1s ease-out",
              }}
            >
              {banners[currentSlide]?.title || "Discover Your Next"}{" "}
              <span style={{ color: "#6ee7b7", fontStyle: "italic" }}>{banners[currentSlide]?.hi || "Adventure."}</span>
            </h1>
            {banners[currentSlide]?.sub && (
              <p
                style={{
                  color: "rgba(255,255,255,0.92)",
                  fontSize: "clamp(15px, 1.8vw, 19px)",
                  lineHeight: 1.6,
                  maxWidth: 580,
                  margin: "0 auto 36px",
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                  animation: "fadeIn 1.2s ease-out",
                }}
              >
                {banners[currentSlide]?.sub}
              </p>
            )}
          </div>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            role="search"
            aria-label="Search destinations"
            className="hero-search-form"
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              borderRadius: 999,
              padding: "6px 6px 6px 22px",
              maxWidth: 580, // Prevent too wide on desktop
              width: "100%",
              margin: "0 auto 32px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.28)",
              alignItems: "center",
              gap: 8,
            }}
          >
            <label htmlFor="hero-search" style={{ display: "none" }}>
              Search travel destinations
            </label>
            <input
              id="hero-search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Manali, Kedarnath, Jaisalmer..."
              aria-label="Search destinations"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 15,
                color: "#0e1117",
                background: "transparent",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                padding: "10px 0",
              }}
            />
            <button
              type="submit"
              aria-label="Search"
              disabled={isSearching}
              style={{
                background: "#064e3b",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "12px 28px",
                fontWeight: 700,
                fontSize: 14,
                cursor: isSearching ? "not-allowed" : "pointer",
                flexShrink: 0,
                fontFamily: "Plus Jakarta Sans, sans-serif",
                opacity: isSearching ? 0.85 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {isSearching ? (
                <>
                  <span className="spinner" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </form>



          {/* Slider dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 32,
            }}
          >
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === currentSlide ? 32 : 8,
                  height: 8,
                  borderRadius: 999,
                  background:
                    i === currentSlide
                      ? "#6ee7b7"
                      : "rgba(255,255,255,0.35)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ───────────────────────────────────────────── */}
      <div style={{ width: "100%", padding: "0 24px", boxSizing: "border-box" }}>
        <div
          className="filter-strip-card"
          style={{
            background: "#fff",
            borderRadius: 20,
            margin: "-32px auto 0",
            maxWidth: 1156, // 1100 content + 28*2 padding
            width: "100%",
            padding: "24px 28px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            border: "1px solid #e2e8f0",
            position: "relative",
            zIndex: 20,
            boxSizing: "border-box"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px 60px" }}>
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 11,
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                Destination
              </p>
              <div className="filter-scroll-container">
                <div style={{ display: "flex", gap: 8 }} className="filter-inner">
                  {regions.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRegion(r.id)}
                      aria-pressed={selectedRegion === r.id}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 12,
                        border: `1.5px solid ${selectedRegion === r.id ? "#064e3b" : "#e2e8f0"}`,
                        background:
                          selectedRegion === r.id ? "#064e3b" : "#f8fafc",
                        color:
                          selectedRegion === r.id ? "#fff" : "#475569",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        whiteSpace: "nowrap",
                        boxShadow: selectedRegion === r.id ? "0 4px 14px rgba(6, 78, 59, 0.2)" : "none",
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 11,
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                Experience
              </p>
              <div className="filter-scroll-container">
                <div style={{ display: "flex", gap: 8 }} className="filter-inner">
                  {types.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      aria-pressed={selectedType === t.id}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 12,
                        border: `1.5px solid ${selectedType === t.id ? "#064e3b" : "#e2e8f0"}`,
                        background:
                          selectedType === t.id ? "#064e3b" : "#f8fafc",
                        color:
                          selectedType === t.id ? "#fff" : "#475569",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        whiteSpace: "nowrap",
                        boxShadow: selectedType === t.id ? "0 4px 14px rgba(6, 78, 59, 0.2)" : "none",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOURS SECTION ────────────────────────────────────────── */}
      <main>
        <section
          aria-label="Tour packages"
          style={{ padding: "60px 24px", background: "#fff" }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {!isDefault ? (
              <>
                <h2
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: 34,
                    fontWeight: 700,
                    color: "#0e1117",
                    marginBottom: 8,
                  }}
                >
                  Showing {filtered.length} Package
                  {filtered.length !== 1 ? "s" : ""}
                </h2>
                <p
                  style={{
                    color: "#64748b",
                    marginBottom: 32,
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontSize: 14,
                  }}
                >
                  Filtered by:{" "}
                  {selectedRegion !== "all" &&
                    regions.find((r) => r.id === selectedRegion)?.label}
                  {selectedType !== "all" &&
                    ` · ${types.find((t) => t.id === selectedType)?.label}`}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill,minmax(280px,1fr))",
                    gap: 24,
                  }}
                >
                  {filtered.map((tour) => (
                    <TourCard key={tour._id} tour={tour} />
                  ))}
                </div>
                {filtered.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: 80,
                      color: "#94a3b8",
                    }}
                  >
                    No packages match your filters.
                  </div>
                )}
              </>
            ) : (
              <>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#10b981",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    marginBottom: 8,
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                  }}
                >
                  Traveler Favorites
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: 32,
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: "clamp(28px, 5vw, 38px)",
                      fontWeight: 700,
                      color: "#0e1117",
                    }}
                  >
                    Bestselling Tour Packages
                  </h2>
                  <Link
                    href="/packages"
                    style={{
                      color: "#064e3b",
                      fontWeight: 700,
                      fontSize: 14,
                      textDecoration: "none",
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                    }}
                  >
                    View All Packages →
                  </Link>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill,minmax(280px,1fr))",
                    gap: 24,
                  }}
                >
                  {bestsellers.map((tour, idx) => (
                    <TourCard key={tour._id || tour.slug || idx} tour={tour} />
                  ))}
                </div>

                {/* International Tours Section */}
                {internationalTours.length > 0 && (
                  <div style={{ marginTop: 64 }}>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#3b82f6",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: 8,
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                      }}
                    >
                      Global Adventures
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        marginBottom: 32,
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontSize: "clamp(28px, 5vw, 38px)",
                          fontWeight: 700,
                          color: "#0e1117",
                        }}
                      >
                        International Tour Packages
                      </h2>
                      <Link
                        href="/packages?region=international"
                        style={{
                          color: "#3b82f6",
                          fontWeight: 700,
                          fontSize: 14,
                          textDecoration: "none",
                          fontFamily: "Plus Jakarta Sans, sans-serif",
                        }}
                      >
                        View All International →
                      </Link>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill,minmax(280px,1fr))",
                        gap: 24,
                      }}
                    >
                      {internationalTours.map((tour, idx) => (
                        <TourCard key={tour._id || tour.slug || idx} tour={tour} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── AEO SECTION: Direct answers for voice search ──────── */}
        <section
          aria-label="Frequently asked questions"
          style={{ padding: "60px 24px", background: "#f8fafc" }}
        >
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#7c3aed",
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: 10,
                fontFamily: "Plus Jakarta Sans, sans-serif",
                textAlign: "center",
              }}
            >
              Quick Answers
            </p>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 34,
                fontWeight: 700,
                color: "#0e1117",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Common Travel Questions
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 14,
                marginBottom: 40,
                textAlign: "center",
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              Direct answers to help you plan your perfect trip
            </p>
            <FAQAccordion faqs={homepageFAQs} />
          </div>
        </section>

        {/* ── BLOG SECTION ─────────────────────────────────────────── */}
        {blogs.length > 0 && (
          <section
            aria-label="Travel blog and guides"
            style={{ padding: "60px 24px", background: "#fff" }}
          >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#10b981",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 8,
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                Travel Knowledge
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: 32,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <h2
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "clamp(28px, 5vw, 38px)",
                    fontWeight: 700,
                    color: "#0e1117",
                  }}
                >
                  From Our Travel Blog
                </h2>
                <Link
                  href="/blog"
                  style={{
                    color: "#064e3b",
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: "none",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                  }}
                >
                  All Blog Posts →
                </Link>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                  gap: 24,
                }}
              >
                {blogs.slice(0, 3).map((blog, idx) => (
                  <BlogCard key={blog._id || blog.slug || idx} blog={blog} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── NEWSLETTER (SXO: Engagement signal) ─────────────────── */}
        <section
          aria-label="Newsletter signup"
          style={{
            padding: "72px 24px",
            background: "#064e3b",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: "relative",
              maxWidth: 560,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6ee7b7",
                textTransform: "uppercase",
                letterSpacing: 3,
                marginBottom: 14,
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              Join {dynamicSite.newsletterCount || "20,000+"} Travelers
            </p>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(28px,4vw,48px)",
                color: "#fff",
                marginBottom: 16,
                lineHeight: 1.15,
              }}
            >
              {dynamicSite.newsletterTitle || "Get Exclusive Deals. Delivered Weekly."}
            </h2>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="newsletter-form"
              style={{ display: "flex", gap: 10, maxWidth: 440, margin: "0 auto" }}
            >
              <label htmlFor="newsletter-email" style={{ display: "none" }}>
                Email address for newsletter
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                required
                style={{
                  flex: 1,
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: 14,
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 22px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <Footer dynamicSite={dynamicSite} />

      {/* ── WHATSAPP FLOAT ───────────────────────────────────────── */}
      <a
        href={`https://wa.me/${(dynamicSite.whatsapp || '916268496389').toString().replace(/\D/g, '')}?text=Hi Humsafar! I want to enquire about tour packages.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="whatsapp-float pulse-glow"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#22c55e",
          color: "#fff",
          width: 56,
          height: 56,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 25px rgba(34,197,94,0.45)",
          zIndex: 100,
          textDecoration: "none",
          transition: "transform 0.2s ease, background 0.2s ease",
        }}
        onClick={() => {
          if (window.gtag) {
            window.gtag("event", "whatsapp_click", {
              event_category: "Conversion",
              event_label: "Float Button",
            });
          }
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382C17.115 14.204 15.361 13.342 15.034 13.223C14.707 13.104 14.469 13.045 14.231 13.402C13.993 13.759 13.31 14.561 13.102 14.8C12.894 15.038 12.686 15.068 12.329 14.889C11.972 14.711 10.822 14.333 9.458 13.117C8.396 12.17 7.679 10.999 7.471 10.642C7.263 10.285 7.449 10.091 7.628 9.913C7.789 9.753 7.987 9.493 8.165 9.285C8.343 9.077 8.402 8.928 8.521 8.69C8.64 8.452 8.581 8.244 8.492 8.066C8.402 7.888 7.689 6.134 7.392 5.421C7.102 4.727 6.81 4.821 6.596 4.811C6.394 4.801 6.156 4.801 5.918 4.801C5.68 4.801 5.294 4.89 4.967 5.247C4.64 5.604 3.719 6.466 3.719 8.22C3.719 9.974 4.997 11.668 5.175 11.906C5.353 12.144 7.688 15.733 11.263 17.278C12.113 17.645 12.776 17.865 13.292 18.028C14.145 18.3 14.921 18.261 15.534 18.17C16.218 18.068 17.643 17.307 17.94 16.474C18.237 15.641 18.237 14.927 18.148 14.779C18.058 14.63 17.829 14.56 17.472 14.382Z" fill="currentColor"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 13.82 2.489 15.526 3.344 17L2 22L7.174 20.686C8.618 21.523 10.256 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM4 12C4 7.582 7.582 4 12 4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20C10.457 20 9.015 19.562 7.785 18.802L4.85 19.55L5.617 16.711C4.595 15.385 4 13.76 4 12Z" fill="currentColor"/>
        </svg>
      </a>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          display: inline-block;
          animation: spin 0.8s linear infinite;
        }
        .filter-scroll-container {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .filter-scroll-container::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 640px) {
          .filter-strip-card {
            padding: 24px 16px !important;
          }
          .hero-search-form {
            border-radius: 18px !important;
            flex-direction: column !important;
            padding: 16px !important;
            gap: 12px !important;
          }
          .hero-search-form input {
            width: 100% !important;
            text-align: center !important;
            padding: 4px 0 !important;
          }
          .hero-search-form button {
            width: 100% !important;
            padding: 14px !important;
          }
          .newsletter-form {
            flex-direction: column !important;
          }
          .newsletter-form button {
            width: 100% !important;
          }
          .hero-stats {
            gap: 16px 24px !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .whatsapp-float {
             left: 20px !important;
             right: auto !important;
             bottom: 20px !important;
          }
        }
      `}</style>
    </>
  );
}

export async function getStaticProps() {
  const data = await getFreshData();

  // SXO Optimization: Strip heavy fields (itinerary, blog body, full galleries) for homepage preview payload
  const tours = (data.TOURS || []).map(t => ({
    _id: t._id || t.id || t.slug,
    title: t.title || "",
    slug: t.slug || "",
    location: t.location || "",
    region: t.region || "domestic",
    type: t.type || "group",
    duration: t.duration || "",
    price: t.price || 0,
    oldPrice: t.oldPrice || "",
    img: t.img || "",
    bestseller: !!t.bestseller,
    seoDesc: t.seoDesc || "",
  }));

  const blogs = (data.BLOGS || []).map(b => ({
    _id: b._id || b.id || b.slug,
    title: b.title || "",
    slug: b.slug || "",
    category: b.category || "Travel Guide",
    author: b.author || "Humsafar Team",
    date: b.date || b.publishedAt || "",
    coverImage: b.coverImage || b.img || "",
    excerpt: b.excerpt || b.summary || "",
  }));

  const banners = (data.BANNERS || []).map(b => ({
    id: b.id || b._id || b.slug,
    title: b.title || "",
    hi: b.hi || "",
    sub: b.sub || "",
    url: b.url || "",
  }));

  return {
    props: {
      tours,
      blogs,
      banners,
      site: data.SITE,
      seo: data.SEODATA,
    },
    // ISR: Revalidate every 60 seconds (SXO: Always fresh content)
    revalidate: 60,
  };
}
