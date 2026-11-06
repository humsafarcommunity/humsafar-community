import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "fghdctku",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-03-01",
  useCdn: false,
});

const query = `*[
  _type == "tour" &&
  region == "himachal" &&
  defined(slug.current) &&
  !(_id in path("drafts.**"))
] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  region,
  location,
  type,
  duration,
  departureDay,
  price,
  oldPrice,
  img,
  highlights,
  inclusions,
  exclusions,
  itinerary,
  faqs,
  seoTitle,
  seoDesc,
  keywords,
  directAnswer
}`;

const tours = await client.fetch(query);
const findings = [];
const titleMap = new Map();
const descriptionMap = new Map();

function add(tour, severity, field, message) {
  findings.push({
    severity,
    title: tour.title || "(untitled)",
    slug: tour.slug || "(missing slug)",
    field,
    message,
  });
}

function remember(map, value, tour, field) {
  const key = String(value || "").trim().toLocaleLowerCase();
  if (!key) return;
  map.set(key, [...(map.get(key) || []), tour]);
}

for (const tour of tours) {
  const title = String(tour.seoTitle || "").trim();
  const description = String(tour.seoDesc || "").trim();
  const highlights = Array.isArray(tour.highlights) ? tour.highlights : [];
  const inclusions = Array.isArray(tour.inclusions) ? tour.inclusions : [];
  const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary : [];
  const faqs = Array.isArray(tour.faqs) ? tour.faqs : [];
  const marketingText = [...highlights, ...inclusions].join(" ");

  if (!tour.title) add(tour, "high", "title", "Package title is missing");
  if (!tour.slug) add(tour, "high", "slug", "Published package has no URL slug");
  if (!tour.location) add(tour, "medium", "location", "Location is missing");
  if (!tour.duration) add(tour, "medium", "duration", "Trip duration is missing");
  if (!tour.img) add(tour, "medium", "img", "Cover image is missing");
  if (!highlights.length) add(tour, "medium", "highlights", "No package highlights");
  if (!inclusions.length) add(tour, "medium", "inclusions", "No inclusions listed");
  if (!itinerary.length) add(tour, "medium", "itinerary", "No itinerary days found");
  if (!faqs.length) add(tour, "low", "faqs", "No package FAQs; consider adding genuine booking questions");

  if (!title) {
    add(tour, "medium", "seoTitle", "Custom SEO title is blank; page fallback is generated");
  } else {
    if (title.length > 60) add(tour, "medium", "seoTitle", `Title is ${title.length} characters; target 50–60`);
    if (title.length < 30) add(tour, "low", "seoTitle", `Title is only ${title.length} characters; check search intent coverage`);
    remember(titleMap, title, tour, "seoTitle");
  }

  if (!description) {
    add(tour, "medium", "seoDesc", "Custom SEO description is blank; page fallback is generated");
  } else {
    if (description.length > 160) add(tour, "medium", "seoDesc", `Description is ${description.length} characters; target 120–160`);
    if (description.length < 100) add(tour, "low", "seoDesc", `Description is only ${description.length} characters; add useful trip detail`);
    remember(descriptionMap, description, tour, "seoDesc");
  }

  if (!tour.keywords) add(tour, "low", "keywords", "SEO keyword field is blank");
  if (!tour.directAnswer) add(tour, "low", "directAnswer", "AEO direct-answer summary is blank");

  if (!(Number(tour.price) > 0) && /₹\s?[\d,]+|INR\s?[\d,]+/i.test(marketingText)) {
    add(tour, "high", "price", "CMS numeric price is empty/zero while highlights or inclusions contain a price; reconcile visible price and structured data");
  }
  if (Number(tour.price) > 0 && !Number.isFinite(Number(tour.price))) {
    add(tour, "high", "price", "CMS price is not a valid positive number");
  }
}

for (const [value, owners] of titleMap) {
  if (owners.length > 1) {
    owners.forEach((tour) => add(tour, "medium", "seoTitle", `Duplicate SEO title used by ${owners.length} Himachal packages`));
  }
}
for (const [value, owners] of descriptionMap) {
  if (owners.length > 1) {
    owners.forEach((tour) => add(tour, "medium", "seoDesc", `Duplicate SEO description used by ${owners.length} Himachal packages`));
  }
}

const severityOrder = { high: 0, medium: 1, low: 2 };
findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

console.log(`Published Himachal packages audited: ${tours.length}`);
console.log(`Total findings: ${findings.length}`);
console.table(findings);

if (!tours.length) {
  console.error("No published Himachal packages matched region == \"himachal\". Verify CMS region values and Sanity access.");
  process.exitCode = 2;
}
