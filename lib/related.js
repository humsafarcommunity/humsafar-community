// Connects blog posts and tour packages by the places they talk about.
// A post about "Kasol" gets the Kasol trips, and a Kasol trip gets the Kasol guides.
const PLACES = [
  "manali", "kasol", "jibhi", "tirthan", "spiti", "ladakh", "leh", "kheerganga", "triund", "mcleodganj", "dharamshala",
  "bir", "billing", "barot", "chopta", "tungnath", "kuari", "kedarnath", "kanatal", "mussoorie", "nainital", "rishikesh",
  "udaipur", "kumbhalgarh", "jaisalmer", "jodhpur", "jaipur", "goa", "meghalaya", "varanasi", "gwalior", "yulla", "kinnaur",
  "vietnam", "thailand", "phuket", "krabi", "bangkok", "pattaya", "nepal", "solang", "rohtang", "sissu", "atal",
];
const REGIONS = ["himachal", "uttarakhand", "rajasthan", "international"];

const text = (...parts) => parts.flat().filter(Boolean).join(" ").toLowerCase().replace(/[^a-z0-9]+/g, " ");
const has = (haystack, word) => new RegExp(`(^| )${word}( |$)`).test(haystack);

function score(a, b) {
  let s = 0;
  PLACES.forEach((p) => { if (has(a, p) && has(b, p)) s += 3; });
  REGIONS.forEach((r) => { if (has(a, r) && has(b, r)) s += 1; });
  return s;
}

const tourText = (t) => text(t.title, t.slug, t.location, t.region);
const blogText = (b) => text(b.title, b.slug, b.tags, b.category, b.keywords);

// Trips for a blog post. Trips picked in Studio (relatedTourSlugs) always come first.
export function toursForBlog(blog, tours = [], limit = 3) {
  const picked = (blog.relatedTourSlugs || []).map((s) => tours.find((t) => t.slug === s)).filter(Boolean);
  const bt = blogText(blog);
  const auto = tours
    .filter((t) => !picked.includes(t))
    .map((t) => ({ t, s: score(bt, tourText(t)) + (t.bestseller ? 0.5 : 0) }))
    .filter((x) => x.s >= 1)
    .sort((x, y) => y.s - x.s)
    .map((x) => x.t);
  const found = [...picked, ...auto];
  if (found.length === 0) {
    // A general post (tips, packing, budget): show the bestselling trips instead
    const best = tours.filter((t) => t.bestseller);
    return (best.length ? best : tours).slice(0, limit);
  }
  return found.slice(0, limit);
}

// Travel guides for a tour page.
export function blogsForTour(tour, blogs = [], limit = 3) {
  const tt = tourText(tour);
  return blogs
    .map((b) => ({ b, s: score(blogText(b), tt) }))
    .filter((x) => x.s >= 3)
    .sort((x, y) => y.s - x.s)
    .slice(0, limit)
    .map((x) => x.b);
}

// Only the fields a card needs, so the page data stays small.
export const slimTour = (t) => ({
  _id: t._id || t.slug, title: t.title || "", slug: t.slug || "", location: t.location || "", region: t.region || "",
  type: t.type || "group", duration: t.duration || "", price: t.price || 0, oldPrice: t.oldPrice || "", img: t.img || "",
  bestseller: !!t.bestseller, departureDay: t.departureDay || "", seoDesc: t.seoDesc || "",
});
export const slimBlog = (b) => ({
  id: b.id || b._id || b.slug, _id: b._id || b.id || b.slug, title: b.title || "", slug: b.slug || "", category: b.category || "Travel Guide",
  author: b.author || "Humsafar Team", date: b.date || b.publishedAt || "", coverImage: b.coverImage || "", excerpt: b.excerpt || "",
});
