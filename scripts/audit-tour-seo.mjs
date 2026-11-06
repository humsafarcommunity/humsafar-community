import { createClient } from "next-sanity";

const client = createClient({
  projectId: "fghdctku",
  dataset: "production",
  apiVersion: "2024-03-01",
  useCdn: false,
});

const query = `*[_type == "tour" && defined(slug.current) && !(_id in path("drafts.**"))]
  | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    seoTitle,
    seoDesc,
    keywords
  }`;

const tours = await client.fetch(query);
const issues = [];
const titleOwners = new Map();
const descriptionOwners = new Map();

const addIssue = (tour, issue) => {
  issues.push({
    slug: tour.slug || "(missing slug)",
    title: tour.title || "(missing title)",
    issue,
  });
};

for (const tour of tours) {
  const seoTitle = String(tour.seoTitle || "").trim();
  const seoDesc = String(tour.seoDesc || "").trim();

  if (!tour.title) addIssue(tour, "Missing package title");
  if (!tour.slug) addIssue(tour, "Missing URL slug");

  if (!seoTitle) {
    addIssue(tour, "Missing custom SEO title (website fallback is generated)");
  } else {
    if (seoTitle.length > 60) addIssue(tour, `SEO title is ${seoTitle.length} characters; target 50–60`);
    const key = seoTitle.toLowerCase();
    titleOwners.set(key, [...(titleOwners.get(key) || []), tour]);
  }

  if (!seoDesc) {
    addIssue(tour, "Missing custom SEO description (website fallback is generated)");
  } else {
    if (seoDesc.length > 160) addIssue(tour, `SEO description is ${seoDesc.length} characters; target 120–160`);
    if (seoDesc.length < 70) addIssue(tour, `SEO description is only ${seoDesc.length} characters; add useful trip context`);
    const key = seoDesc.toLowerCase();
    descriptionOwners.set(key, [...(descriptionOwners.get(key) || []), tour]);
  }
}

for (const owners of titleOwners.values()) {
  if (owners.length > 1) {
    owners.forEach((tour) => addIssue(tour, `Duplicate SEO title shared by ${owners.length} packages`));
  }
}
for (const owners of descriptionOwners.values()) {
  if (owners.length > 1) {
    owners.forEach((tour) => addIssue(tour, `Duplicate SEO description shared by ${owners.length} packages`));
  }
}

console.log(`Published packages audited: ${tours.length}`);
console.log(`Metadata findings: ${issues.length}`);
if (issues.length) console.table(issues);
else console.log("No missing, duplicate or over-length SEO metadata found.");
