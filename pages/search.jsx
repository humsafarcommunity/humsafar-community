import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SEOHead from "../components/SEOHead";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TourCard from "../components/TourCard";
import BlogCard from "../components/BlogCard";
import { SITE, getFreshData } from "../data";

export default function SearchPage({ tours, blogs, site: freshSite }) {
  const dynamicSite = freshSite || SITE;
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState({ tours: [], blogs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    
    setLoading(true);
    const query = (q || "").toLowerCase();
    
    const filteredTours = (tours || []).filter(t => 
      t.title?.toLowerCase().includes(query) || 
      t.region?.toLowerCase().includes(query) ||
      t.type?.toLowerCase().includes(query) ||
      t.shortDesc?.toLowerCase().includes(query)
    );
    
    const filteredBlogs = (blogs || []).filter(b => 
      b.title?.toLowerCase().includes(query) ||
      b.excerpt?.toLowerCase().includes(query)
    );
    
    setResults({ tours: filteredTours, blogs: filteredBlogs });
    setLoading(false);
  }, [q, router.isReady, tours, blogs]);

  return (
    <>
      <SEOHead
        title={`Search results for "${q || ""}"`}
        description={`Find the best tour packages and travel guides for ${q || ""}. Explore curated trips by Humsafar Community.`}
        url={`/search?q=${q}`}
        site={dynamicSite}
      />

      <Navbar site={dynamicSite} />

      <main style={{ minHeight: "80vh", background: "#f8fafc", paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
              Search Results
            </p>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(32px, 5vw, 48px)", color: "#0f172a", marginBottom: 16 }}>
              Showing results for "{q}"
            </h1>
            <p style={{ color: "#64748b", fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
              {results.tours.length + results.blogs.length} matches found across our tours and travel guides.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "#64748b" }}>Searching our database...</p>
            </div>
          ) : (
            <>
              {/* Tours Section */}
              {results.tours.length > 0 && (
                <section style={{ marginBottom: 60 }}>
                  <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginBottom: 24, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
                    Tour Packages ({results.tours.length})
                  </h2>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 24
                  }}>
                    {results.tours.map(tour => (
                      <TourCard key={tour._id} tour={tour} />
                    ))}
                  </div>
                </section>
              )}

              {/* Blogs Section */}
              {results.blogs.length > 0 && (
                <section>
                  <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginBottom: 24, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
                    Travel Guides & Blogs ({results.blogs.length})
                  </h2>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 32
                  }}>
                    {results.blogs.map(blog => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                  </div>
                </section>
              )}

              {results.tours.length === 0 && results.blogs.length === 0 && (
                <div style={{ textAlign: "center", padding: "100px 20px", background: "#fff", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
                  <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, color: "#0f172a", marginBottom: 12 }}>
                    No results found
                  </h2>
                  <p style={{ color: "#64748b", fontSize: 16, maxWidth: 400, margin: "0 auto 32px" }}>
                    We couldn't find anything matching "{q}". Try searching for popular destinations like "Manali", "Kerala", or "Ladakh".
                  </p>
                  <button 
                    onClick={() => router.push("/")}
                    style={{
                      background: "#064e3b",
                      color: "#fff",
                      border: "none",
                      padding: "14px 28px",
                      borderRadius: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "background 0.3s ease"
                    }}
                  >
                    Go Back Home
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer dynamicSite={dynamicSite} />
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
    },
    revalidate: 60,
  };
}
