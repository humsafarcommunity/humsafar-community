import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SEOHead from "../components/SEOHead";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TourCard from "../components/TourCard";
import BlogCard from "../components/BlogCard";
import { SITE, getFreshData } from "../data";

export default function SearchPage({ tours, blogs, site: freshSite, seo: seoData }) {
  const dynamicSite = freshSite?.whatsapp ? freshSite : (SITE || { name: "Humsafar Community", whatsapp: "916268496389" });
  const router = useRouter();
  const { q } = router.query;
  
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'tours' | 'blogs'
  const [results, setResults] = useState({ tours: [], blogs: [] });
  const [loading, setLoading] = useState(true);

  // Sync initial query input
  useEffect(() => {
    if (q) setSearchInput(q);
  }, [q]);

  useEffect(() => {
    if (!router.isReady) return;
    
    setLoading(true);
    const query = (q || "").toLowerCase().trim();
    
    if (!query) {
      setResults({ tours: tours || [], blogs: blogs || [] });
      setLoading(false);
      return;
    }
    
    const filteredTours = (tours || []).filter(t => 
      t.title?.toLowerCase().includes(query) || 
      t.region?.toLowerCase().includes(query) ||
      t.location?.toLowerCase().includes(query) ||
      t.type?.toLowerCase().includes(query) ||
      t.shortDesc?.toLowerCase().includes(query) ||
      (t.highlights || []).some(h => String(h).toLowerCase().includes(query))
    );
    
    const filteredBlogs = (blogs || []).filter(b => 
      b.title?.toLowerCase().includes(query) ||
      b.category?.toLowerCase().includes(query) ||
      b.excerpt?.toLowerCase().includes(query) ||
      (b.tags || []).some(t => String(t).toLowerCase().includes(query))
    );
    
    setResults({ tours: filteredTours, blogs: filteredBlogs });
    setLoading(false);
  }, [q, router.isReady, tours, blogs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleTagClick = (tag) => {
    setSearchInput(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  const totalMatches = results.tours.length + results.blogs.length;
  const quickTags = ["Manali", "Kedarnath", "Rajasthan", "Trek", "Bali", "Kerala", "Spiti"];

  return (
    <>
      <SEOHead
        title={q ? `Search results for "${q}" | ${dynamicSite.name}` : `Search Tours & Travel Guides | ${dynamicSite.name}`}
        description={`Find the best tour packages, Himalayan treks, and travel guides for ${q || "your next adventure"}.`}
        url={`/search?q=${encodeURIComponent(q || "")}`}
        site={dynamicSite}
        seo={seoData}
        noindex={true}
      />

      <Navbar site={dynamicSite} isSolid={true} />

      <main style={{ minHeight: "85vh", background: "#f8fafc", paddingTop: 110, paddingBottom: 80, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Search Header Banner */}
        <div style={{
          background: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
          color: "#fff",
          padding: "50px 20px 60px",
          marginBottom: 40,
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Subtle background graphic glow */}
          <div style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: 450,
            height: 450,
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
            pointerEvents: "none"
          }} />

          <div style={{ maxWidth: 850, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <span style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#34d399",
              padding: "6px 14px",
              borderRadius: 20,
              marginBottom: 16,
              border: "1px solid rgba(52, 211, 153, 0.2)"
            }}>
              Search Hub
            </span>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 5vw, 46px)", fontWeight: 700, marginBottom: 20, lineHeight: 1.2 }}>
              {q ? <>Search results for &ldquo;<span style={{ color: "#34d399" }}>{q}</span>&rdquo;</> : "Explore Destinations & Guides"}
            </h1>

            {/* Interactive Search Bar */}
            <form onSubmit={handleSearchSubmit} style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 16,
              padding: "6px 8px 6px 20px",
              boxShadow: "0 12px 35px rgba(0, 0, 0, 0.25)",
              maxWidth: 680,
              margin: "0 auto 20px"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: 12 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search destinations, packages, or guides (e.g. Manali, Kasol, Trek)..."
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#0f172a",
                  background: "transparent",
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    fontSize: 16,
                    cursor: "pointer",
                    padding: "6px 10px",
                    lineHeight: 1
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                style={{
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "background 0.2s ease"
                }}
              >
                Search
              </button>
            </form>

            {/* Quick Tag Suggestions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Popular:</span>
              {quickTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  style={{
                    background: q?.toLowerCase() === tag.toLowerCase() ? "#10b981" : "rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    border: "none",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results Content */}
        <div style={{ maxWidth: 1150, margin: "0 auto", padding: "0 20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div className="search-spinner" style={{
                width: 44,
                height: 44,
                border: "4px solid #e2e8f0",
                borderTop: "4px solid #10b981",
                borderRadius: "50%",
                margin: "0 auto 20px",
                animation: "spin 0.8s linear infinite"
              }} />
              <p style={{ color: "#64748b", fontWeight: 600 }}>Finding best matches...</p>
            </div>
          ) : (
            <>
              {/* Filter Tabs Bar */}
              {totalMatches > 0 && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                  marginBottom: 36,
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: 16
                }}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => setActiveTab("all")}
                      style={{
                        padding: "8px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: activeTab === "all" ? "#064e3b" : "#fff",
                        color: activeTab === "all" ? "#fff" : "#64748b",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        boxShadow: activeTab === "all" ? "0 4px 12px rgba(6, 78, 59, 0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      All Results ({totalMatches})
                    </button>
                    <button
                      onClick={() => setActiveTab("tours")}
                      style={{
                        padding: "8px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: activeTab === "tours" ? "#064e3b" : "#fff",
                        color: activeTab === "tours" ? "#fff" : "#64748b",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        boxShadow: activeTab === "tours" ? "0 4px 12px rgba(6, 78, 59, 0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      Tour Packages ({results.tours.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("blogs")}
                      style={{
                        padding: "8px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: activeTab === "blogs" ? "#064e3b" : "#fff",
                        color: activeTab === "blogs" ? "#fff" : "#64748b",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        boxShadow: activeTab === "blogs" ? "0 4px 12px rgba(6, 78, 59, 0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      Travel Guides ({results.blogs.length})
                    </button>
                  </div>

                  <p style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>
                    Found {totalMatches} result{totalMatches === 1 ? "" : "s"}
                  </p>
                </div>
              )}

              {/* Tour Packages Section */}
              {(activeTab === "all" || activeTab === "tours") && results.tours.length > 0 && (
                <section style={{ marginBottom: 50 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                    <div style={{ background: "#ecfdf5", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      🏔️
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                      Tour Packages <span style={{ fontSize: 16, color: "#64748b", fontWeight: 600 }}>({results.tours.length})</span>
                    </h2>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 24
                  }}>
                    {results.tours.map(tour => (
                      <TourCard key={tour._id || tour.slug} tour={tour} />
                    ))}
                  </div>
                </section>
              )}

              {/* Travel Guides Section */}
              {(activeTab === "all" || activeTab === "blogs") && results.blogs.length > 0 && (
                <section style={{ marginBottom: 50 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                    <div style={{ background: "#ecfdf5", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      📖
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                      Travel Guides & Articles <span style={{ fontSize: 16, color: "#64748b", fontWeight: 600 }}>({results.blogs.length})</span>
                    </h2>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 28
                  }}>
                    {results.blogs.map(blog => (
                      <BlogCard key={blog._id || blog.slug} blog={blog} />
                    ))}
                  </div>
                </section>
              )}

              {/* No Results Empty State */}
              {totalMatches === 0 && (
                <div style={{
                  textAlign: "center",
                  padding: "70px 24px",
                  background: "#fff",
                  borderRadius: 24,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                  border: "1px solid #e2e8f0",
                  maxWidth: 600,
                  margin: "20px auto"
                }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    background: "#f1f5f9",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    margin: "0 auto 20px"
                  }}>
                    🔍
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
                    No exact matches found
                  </h2>
                  <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
                    We couldn&apos;t find anything for &ldquo;<strong>{q}</strong>&rdquo;. Try searching for regional destinations or explore our top trending packages.
                  </p>
                  
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                      onClick={() => { setSearchInput(""); router.push("/packages"); }}
                      style={{
                        background: "#064e3b",
                        color: "#fff",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer"
                      }}
                    >
                      View All Packages
                    </button>
                    <button
                      onClick={() => { setSearchInput(""); router.push("/blog"); }}
                      style={{
                        background: "#f1f5f9",
                        color: "#0f172a",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer"
                      }}
                    >
                      Browse Travel Blog
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer dynamicSite={dynamicSite} />

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export async function getStaticProps() {
  const data = await getFreshData();
  return {
    props: {
      tours: data.TOURS,
      blogs: data.BLOGS,
      site: data.SITE,
      seo: data.SEODATA,
    },
    revalidate: 60,
  };
}
