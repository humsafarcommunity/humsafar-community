// ============================================================
// data/index.js — All tours, blogs, banners + SEO data
// Humsafar Community v5.0
// ============================================================

/**
 * Server-side only: Reads fresh data directly from disk to bypass Webpack cache.
 * Use this in getStaticProps/getServerSideProps.
 */
import { createClient } from 'next-sanity';
import { urlFor } from '../lib/sanity.image';

const staticData = require('./data.json');
export const SITE = staticData.SITE;
export const TOURS = staticData.TOURS;
export const BLOGS = staticData.BLOGS;
export const BANNERS = staticData.BANNERS;

const client = createClient({
  projectId: 'fghdctku',
  dataset: 'production',
  apiVersion: '2024-03-01',
  useCdn: false, // Ensures we always get fresh CMS data
});

export async function getFreshData() {
  try {
    const sanityData = await client.fetch(`{
      "SITE": *[_type == "siteSettings" && _id == "siteSettings"][0],
      "SEODATA": *[_type == "seoSettings" && _id == "seoSettings"][0],
      "TOURS": *[_type == "tour" && defined(slug.current)] {
        ...,
        "slug": slug.current,
        "img": img // Get full object for builder
      },
      "BLOGS": *[_type == "blog" && defined(slug.current)] {
        ...,
        "slug": slug.current,
        "coverImage": coverImage // Get full object for builder
      },
      "BANNERS": *[_type == "banner"] {
        ...,
        "url": image // Get full object for builder
      }
    }`);

    // Merge logic: Use Sanity data if it exists, otherwise use staticData
    // Ensure TOURS and BLOGS are arrays and only contain items with string slugs
    const tours = (sanityData.TOURS || []).map(t => ({
      ...t,
      img: t.img ? urlFor(t.img) : (staticData.TOURS.find(st => st.slug === t.slug)?.img || ""), // Fallback to static if image missing
      gallery: (t.gallery || []).map(g => urlFor(g)),
      price: t.price || 0,
      rating: t.rating || 5.0,
      reviews: t.reviews || 0
    }));

    const blogs = (sanityData.BLOGS || [])
      .filter(b => b.title && b.slug) // SXO: Filter out drafts/broken posts
      .map(b => {
        // Extract plain text for excerpt if missing
        const firstText = (b.content || [])
          .find(block => block._type === 'block' || block.type === 'para')
          ?.children?.map(c => c.text || "").join("") || 
          (b.content || []).find(block => block.text)?.text || "";

        return {
          ...b,
          category: b.category || "Travel",
          readTime: b.readTime || 5,
          excerpt: b.excerpt || (firstText ? (firstText.slice(0, 160) + "...") : "Read our latest travel guide and plan your next adventure with Humsafar Community."),
          coverImage: b.coverImage ? urlFor(b.coverImage) : "",
          // Normalize content format
          content: (b.content || []).map(block => {
            if (!block) return null;
            // Handle images in content
            if (block._type === 'image' || block.type === 'img') {
              return { 
                type: 'img', 
                url: urlFor(block.url || block),
                caption: block.caption || "" 
              };
            }
            // Handle PortableText blocks
            if (block._type === 'block') {
              return {
                type: block.style === 'h2' ? 'h2' : (block.style === 'h3' ? 'h3' : 'para'),
                text: (block.children || []).map(c => c.text || "").join("")
              };
            }
            return block;
          }).filter(Boolean)
        };
      });

    const banners = (sanityData.BANNERS || []).map(bn => ({
      ...bn,
      id: bn.id || bn._id || `banner-${Math.random()}`,
      url: bn.url ? urlFor(bn.url) : ""
    }));

    return {
      SITE: sanityData.SITE || staticData.SITE,
      SEODATA: sanityData.SEODATA || {},
      TOURS: tours.length > 0 ? tours : staticData.TOURS,
      BLOGS: blogs.length > 0 ? blogs : staticData.BLOGS,
      BANNERS: banners.length > 0 ? banners : staticData.BANNERS,
    };
  } catch (error) {
    console.error("Sanity fetch failed, falling back to static data", error);
    return staticData;
  }
}

export function generateOrganizationSchema(site = SITE) {
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: ["Humsafar", "Humsafar Travels", "Humsafar Tours"],
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/logo.png`,
      width: 200,
      height: 60,
    },
    description:
      "India's most trusted travel community. Award-winning group tours, custom Himalayan expeditions, and corporate retreats. Serving 50,000+ travelers since 2020.",
    telephone: site.phone,
    email: site.email,
    foundingDate: site.founded,
    address: {
      "@type": "PostalAddress",
      streetAddress: "4th Floor, Adventure Hub, Sector 15",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: "122001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.lat,
      longitude: site.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    priceRange: "₹₹",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.ratingValue,
      reviewCount: site.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: Object.values(site.socials || {}),
  };
}

export function generateTourSchema(tour, site = SITE) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${site.url}/packages/${tour.slug}/`,
    name: tour.title,
    description: tour.seoDesc,
    image: tour.img,
    url: `${site.url}/packages/${tour.slug}/`,
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString().split("T")[0],
      seller: {
        "@type": "TravelAgency",
        name: site.name,
        url: site.url,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tour.rating,
      reviewCount: tour.reviews,
      bestRating: "5",
    },
    provider: {
      "@type": "TravelAgency",
      "@id": `${site.url}/#organization`,
      name: site.name,
    },
    itinerary: (tour.itinerary || []).map((day) => ({
      "@type": "TouristAttraction",
      name: day.title,
      description: day.desc,
    })),
    ...(tour.faqs?.length > 0
      ? {
          mainEntity: tour.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : {}),
  };
}

export function generateArticleSchema(blog, site = SITE) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${site.url}/blog/${blog.slug}/`,
    headline: blog.seoTitle || blog.title,
    description: blog.seoDesc || blog.excerpt,
    image: {
      "@type": "ImageObject",
      url: blog.coverImage,
      width: 1200,
      height: 630,
    },
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    author: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/blog/${blog.slug}/`,
    },
    keywords: blog.keywords,
    articleSection: blog.category,
    wordCount: (blog.readTime || 5) * 200,
    inLanguage: "en-IN",
    ...(blog.faqs?.length > 0
      ? {
          mainEntity: blog.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : {}),
  };
}

export function generateFAQSchema(faqs, site = SITE) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
        author: { "@type": "Organization", name: site.name },
      },
    })),
  };
}

export function generateBreadcrumbSchema(items, site = SITE) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function generateWebsiteSchema(site = SITE) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description:
      "India's #1 travel community for group tours, Himalayan treks, and custom trips",
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
    },
  };
}
