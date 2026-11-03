// components/SEOHead.jsx
// Shared metadata, canonical URL, social preview and structured data output.
import Head from "next/head";
import { SITE } from "../data";
import { urlFor } from "../lib/sanity.image";

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  schemas = [],
  noindex = false,
  canonical,
  publishedAt,
  updatedAt,
  author,
  breadcrumbs,
  site: freshSite,
  seo: freshSeo,
}) {
  const site = freshSite || SITE;
  const seo = freshSeo || {};
  const siteUrl = String(site.url || "https://www.humsafarcommunity.com").replace(/\/+$/, "");

  // Resolve relative paths against the canonical site origin. Social crawlers
  // require absolute image URLs, and canonical links must identify one URL.
  const absoluteUrl = (value, fallback = "/") => {
    const candidate = typeof value === "string" && value.trim() ? value.trim() : fallback;
    try {
      return new URL(candidate, `${siteUrl}/`).toString();
    } catch {
      return new URL(fallback, `${siteUrl}/`).toString();
    }
  };

  const metaTitle = title || seo.seoTitle || "Group Tours, Himalayan Treks & Custom Trips in India";
  const fullTitle = title
    ? (title.toLowerCase().includes(String(site.name).toLowerCase()) || title.length > 56 ? title : `${title} | ${site.name}`)
    : `${site.name} — ${metaTitle}`;

  // Keep the search description concise and free of markup.
  const tidy = (v) => {
    const t = String(v || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/[#*_\`>|]+/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
    if (t.length <= 160) return t;
    const cut = t.slice(0, 157);
    return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 100))}…`;
  };

  const metaDescription = tidy(description || seo.seoDescription) || "Explore group tours, Himalayan treks and custom trips across India with Humsafar Community.";
  const metaKeywords = keywords || seo.seoKeywords;
  const fullUrl = absoluteUrl(url || "/");
  const canonicalUrl = absoluteUrl(canonical || fullUrl);
  const cmsOgImage = seo.ogImage ? urlFor(seo.ogImage) : null;
  const ogImage = absoluteUrl(image || cmsOgImage || site.defaultOGImage, "/og-default.png");
  const favicon = "/favicon.ico";

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <meta name="author" content={author || site.name} />
      <link rel="canonical" href={canonicalUrl} />
      {seo.googleVerification && <meta name="google-site-verification" content={seo.googleVerification} />}

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-snippet:-1" />
        </>
      )}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title || metaTitle} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={site.socials?.twitter ? `@${site.socials.twitter.split('/').pop()}` : "@humsafar_travel"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {type === "article" && publishedAt && (
        <>
          <meta property="article:published_time" content={publishedAt} />
          <meta property="article:modified_time" content={updatedAt || publishedAt} />
          <meta property="article:author" content={author || site.name} />
          {site.socials?.facebook && <meta property="article:publisher" content={site.socials.facebook} />}
        </>
      )}

      <meta name="geo.region" content="IN-MP" />
      <meta name="geo.placename" content="Gwalior, Madhya Pradesh, India" />
      {site.lat && site.lng && (
        <>
          <meta name="geo.position" content={`${site.lat};${site.lng}`} />
          <meta name="ICBM" content={`${site.lat}, ${site.lng}`} />
        </>
      )}

      <meta httpEquiv="content-language" content="en-in" />
      <meta name="language" content="English" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta httpEquiv="x-dns-prefetch-control" content="on" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://cdn.sanity.io" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

      <link rel="icon" href={favicon} sizes="any" />
      <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {breadcrumbs && breadcrumbs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: breadcrumbs.map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: item.name,
                item: absoluteUrl(item.path),
              })),
            }),
          }}
        />
      )}
    </Head>
  );
}
