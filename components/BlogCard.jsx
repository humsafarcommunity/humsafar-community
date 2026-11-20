import Link from 'next/link';
import Image from 'next/image';
import { waLink, track } from "../lib/whatsapp";

import WhatsAppLogo from "./WhatsAppLogo";
export default function BlogCard({ blog, site }) {
  if (!blog) return null;
  return (
    <article
      className="bc"
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
      }}
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      {blog.coverImage && (
        <div className="bc-img" style={{ position: 'relative', height: 196, width: '100%' }}>
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            itemProp="image"
          />
        </div>
      )}
      <div className="bc-body" style={{ padding: "20px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 11 }}>
          <span
            style={{
              background: "#ecfdf5",
              color: "#065f46",
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 999,
              fontWeight: 600,
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
            itemProp="articleSection"
          >
            {blog.category}
          </span>
          <span
            style={{
              color: "#64748b",
              fontSize: 11,
              padding: "3px 0",
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            {blog.readTime} min read
          </span>
        </div>
        <h3
          className="bc-title"
          style={{
            fontFamily: "var(--sans)",
            fontSize: 18,
            fontWeight: 700,
            color: "#0e1117",
            marginBottom: 9,
            lineHeight: 1.3,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
          itemProp="headline"
        >
          {blog.title}
        </h3>
        <p
          className="bc-excerpt"
          style={{
            fontSize: 13,
            color: "#64748b",
            lineHeight: 1.65,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}
          itemProp="description"
        >
          {blog.excerpt}
        </p>
        <div className="bc-actions" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          <Link
            href={blog.slug ? `/blog/${blog.slug}` : "#"}
            style={{ fontSize: 13, fontWeight: 700, color: "#064e3b", textDecoration: "none", fontFamily: "Plus Jakarta Sans, sans-serif", marginRight: "auto" }}
          >
            {blog.slug ? "Read guide →" : "Content Unavailable"}
          </Link>
          <Link
            href="/packages"
            onClick={() => track("view_book_click", { event_label: `blog_${blog.slug || "card"}` })}
            style={{ background: "#E8681E", color: "#fff", fontSize: 12.5, fontWeight: 800, padding: "9px 14px", borderRadius: 999, textDecoration: "none", fontFamily: "Plus Jakarta Sans, sans-serif", whiteSpace: "nowrap" }}
          >
            View trips
          </Link>
          <a
            href={waLink(site, `Hi Humsafar! I read your guide "${blog.title}". Can you suggest a trip and share dates?`, `Blog: ${blog.slug || "card"}`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { event_label: `blog_${blog.slug || "card"}` })}
            aria-label="Ask about a trip on WhatsApp"
            style={{ width: 38, height: 38, borderRadius: 999, background: "#22c55e", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <WhatsAppLogo size={30} />
          </a>
        </div>
        <meta itemProp="datePublished" content={blog.publishedAt} />
      </div>
    </article>
  );
}
