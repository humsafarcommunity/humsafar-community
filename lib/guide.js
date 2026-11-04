// Helpers for the travel-guide (blog post) page: which place a guide is about,
// the headings to list under "Top things to do", and the photo tiles.

// Display names, longest first so "Bir Billing" is tried before "Bir".
const PLACES = [
  "Bir Billing", "McLeodganj", "Dharamshala", "Kheerganga", "Kumbhalgarh", "Meghalaya", "Jaisalmer", "Mussoorie",
  "Rishikesh", "Nainital", "Tungnath", "Kedarnath", "Varanasi", "Thailand", "Jodhpur", "Udaipur", "Manali", "Ladakh",
  "Triund", "Tirthan", "Chopta", "Kanatal", "Kinnaur", "Vietnam", "Gwalior", "Jaipur", "Barot", "Jibhi", "Kasol",
  "Spiti", "Nepal", "Goa", "Leh",
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hit = (hay, name) => hay.search(new RegExp(`(^|[^a-z0-9])${esc(name.toLowerCase())}([^a-z0-9]|$)`));

// The place a guide is about: title first, then tags/keywords/slug. Returns "" for general posts.
export function guidePlace(blog = {}) {
  const sources = [
    blog.title || "",
    [].concat(blog.tags || []).join(" "),
    `${blog.keywords || ""} ${(blog.slug || "").replace(/-/g, " ")}`,
  ].map((s) => s.toLowerCase());
  for (const hay of sources) {
    let best = null;
    PLACES.forEach((p) => {
      const at = hit(hay, p);
      if (at >= 0 && (best === null || at < best.at || (at === best.at && p.length > best.p.length))) best = { at, p };
    });
    if (best) return best.p;
  }
  return "";
}

const clean = (t) =>
  String(t || "")
    .replace(/\*\*|__|\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s*\d+[.)]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

export const slugify = (t) =>
  clean(t).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// h2 headings in the post body (blocks may hold "## Heading" lines inside paragraphs).
export function guideHeadings(content = [], limit = 4) {
  const out = [];
  (content || []).forEach((b) => {
    if (!b) return;
    if (b.type === "h2" && b.text) out.push(clean(b.text));
    else if (b.type === "para" && b.text) {
      String(b.text).split("\n").forEach((line) => {
        const m = line.match(/^#{1,2}\s+(.*)$/);
        if (m) out.push(clean(m[1]));
      });
    }
  });
  const seen = new Set();
  return out
    .filter((t) => t && t.length <= 70 && !seen.has(t.toLowerCase()) && seen.add(t.toLowerCase()))
    .slice(0, limit)
    .map((text) => ({ text, id: slugify(text) }));
}

// True when the headings are about activities/places, so "Top things to do" is an honest title.
export function isThingsToDo(blog = {}) {
  return /things to do|places to visit|attractions|sightseeing|what to do|top \d+/i.test(`${blog.title || ""} ${blog.slug || ""}`.replace(/-/g, " "));
}

// Up to 4 photo tiles: the matching trip's attractions first, else images placed inside the post.
export function guideTiles(blog = {}, tours = [], place = "", limit = 4) {
  const p = place.toLowerCase();
  if (p) {
    const trip = tours.find((t) => `${t.title} ${t.slug} ${t.location}`.toLowerCase().includes(p) && (t.attractions || []).filter((a) => a.image).length >= 2);
    if (trip) return trip.attractions.filter((a) => a.image).slice(0, limit).map((a) => ({ src: a.image, label: a.name }));
  }
  return (blog.content || [])
    .filter((b) => b && b.type === "img" && b.url)
    .slice(0, limit)
    .map((b) => ({ src: b.url, label: clean(b.caption || "").slice(0, 40) }));
}

// Where "View packages" should go: the place's own packages page when the site has one.
export function packagesHref(place = "") {
  const p = place.toLowerCase();
  return ["manali", "kasol", "jibhi"].includes(p) ? `/${p}-tour-packages` : "/packages";
}

// Which of the four trip icons to show, taken from what the trip really includes.
export function tourPerks(tour = {}) {
  const inc = [].concat(tour.inclusions || []).join(" | ").toLowerCase();
  const perks = [];
  if (/transport|tempo|traveller|traveler|bus|cab|volvo|innova|sedan|suv|pick.?up|drop/.test(inc)) perks.push({ icon: "bus", label: "Transport Included" });
  if (/stay|hotel|accommodation|homestay|home stay|camp|resort|hostel/.test(inc)) perks.push({ icon: "bed", label: "Stays Included" });
  if (/meal|breakfast|dinner|lunch/.test(inc)) perks.push({ icon: "meal", label: "Meals Included" });
  if ((tour.type || "group") === "group") perks.push({ icon: "people", label: "Trip Captain Support" });
  return perks.slice(0, 4);
}
