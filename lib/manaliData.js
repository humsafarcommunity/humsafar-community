import { getFreshData } from "../data";

const isManali = (v) => String(v || "").toLowerCase().includes("manali");

// "Popular Manali trips" shortcuts. Each one links to the best match we really have
// (a trip first, then a guide), so a shortcut never points at a page that does not exist.
const THEMES = [
  { key: "honeymoon", label: "Honeymoon", blurb: "Romantic plans for couples", words: ["honeymoon", "couple", "romantic"] },
  { key: "family", label: "Family", blurb: "Easy plans for kids and parents", words: ["family", "kids"] },
  { key: "budget", label: "Budget", blurb: "Low-cost ways to do Manali", words: ["budget", "cheap", "affordable"] },
  { key: "kasol", label: "Manali + Kasol", blurb: "Pair Manali with Parvati Valley", words: ["kasol"] },
  { key: "delhi", label: "From Delhi", blurb: "Weekly batches from Delhi", words: ["from-delhi", "from delhi", "delhi"] },
];
const hay = (...v) => v.flat().filter(Boolean).join(" ").toLowerCase().replace(/[^a-z0-9]+/g, " ");
const hit = (text, words) => words.some((w) => text.includes(w.replace(/-/g, " ")));

function buildThemes(tours, blogs) {
  return THEMES.map((th) => {
    const tour = tours.find((t) => hit(hay(t.title, t.slug), th.words));
    const blog = blogs.find((b) => hit(hay(b.title, b.slug), th.words));
    if (tour) return { key: th.key, label: th.label, blurb: th.blurb, href: `/packages/${tour.slug}`, kind: "Trip", name: tour.title };
    if (blog) return { key: th.key, label: th.label, blurb: th.blurb, href: `/blog/${blog.slug}`, kind: "Guide", name: blog.title };
    return null;
  }).filter(Boolean);
}

// Shared by /manali-tour-packages and /manali-tour-packages/[city]
export async function getManaliProps() {
  const data = await getFreshData();
  const tours = (data.TOURS || [])
    .filter((t) => isManali(t.title) || isManali(t.location) || isManali(t.slug))
    .map((t) => ({
      _id: t._id || t.slug,
      title: t.title || "",
      slug: t.slug || "",
      location: t.location || "",
      region: t.region || "",
      type: t.type || "group",
      duration: t.duration || "",
      price: t.price || 0,
      oldPrice: t.oldPrice || "",
      img: t.img || "",
      bestseller: !!t.bestseller,
      departureDay: t.departureDay || "",
      seoDesc: t.seoDesc || "",
    }));
  const prices = tours.map((t) => Number(t.price)).filter((n) => n > 0);
  const manaliBlogs = (data.BLOGS || []).filter((b) => isManali(b.title) || isManali(b.slug));
  const themes = buildThemes(tours, manaliBlogs);
  const guides = manaliBlogs
    .slice(0, 6)
    .map((b) => ({
      _id: b._id || b.slug,
      title: b.title || "",
      slug: b.slug || "",
      category: b.category || "Travel Guide",
      author: b.author || "Humsafar Team",
      date: b.date || b.publishedAt || "",
      coverImage: b.coverImage || "",
      excerpt: b.excerpt || "",
    }));
  const reviews = JSON.parse(JSON.stringify(data.REVIEWS || []));
  return {
    tours,
    themes,
    guides,
    reviews,
    minPrice: prices.length ? Math.min(...prices) : 0,
    site: data.SITE,
    seo: data.SEODATA,
  };
}
