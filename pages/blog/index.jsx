import SEOHead from "../../components/SEOHead";
import Navbar from "../../components/Navbar";
import BlogCard from "../../components/BlogCard";
import Footer from "../../components/Footer";
import { getFreshData, SITE } from "../../data";
import Link from "next/link";

export default function BlogPage({ blogs, site: freshSite }) {
  const dynamicSite = freshSite || SITE || { name: "Humsafar Community", socials: {} };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "85px" }}>
      <SEOHead
        title="Travel Blog | Tips & Guides | Humsafar Community"
        description="Read our latest travel guides, tips, and stories from across the globe."
        site={dynamicSite}
        url="/blog"
      />

      <Navbar site={dynamicSite} isSolid={true} />

      <main style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 40, marginBottom: 10 }}>Travel Stories & Guides</h1>
        <p style={{ color: "#64748b", marginBottom: 40 }}>Expert advice and inspiration for your next adventure.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 30 }}>
          {blogs.map((blog, idx) => (
            <BlogCard key={blog._id || blog.slug || idx} blog={blog} />
          ))}
        </div>

        {blogs.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px", color: "#94a3b8" }}>
            No blog posts published yet.
          </div>
        )}
      </main>

      <Footer dynamicSite={dynamicSite} />
    </div>
  );
}

export async function getStaticProps() {
  const data = await getFreshData();
  return {
    props: {
      blogs: data.BLOGS,
      site: data.SITE,
    },
    revalidate: 60,
  };
}
