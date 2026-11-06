const BRAND = "Humsafar Community";

function clean(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_\x60>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value, maxLength) {
  const text = clean(value);
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > Math.floor(maxLength * 0.65) ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

/**
 * Return page-specific metadata for a tour.
 * CMS values always take precedence; generated fallbacks prevent blank or
 * identical descriptions across package pages when editors leave SEO fields empty.
 */
export function getTourSeoMeta(tour = {}) {
  const name = clean(tour.title) || "Tour Package";
  const suppliedTitle = clean(tour.seoTitle);
  const title = suppliedTitle || truncate(`${name} | ${BRAND}`, 60);

  const suppliedDescription = clean(tour.seoDesc);
  const place = clean(tour.location);
  const duration = clean(tour.duration);
  const descriptionParts = [
    `Explore ${name}${place ? ` in ${place}` : ""} with ${BRAND}.`,
    duration ? `View the ${duration} itinerary,` : "View the itinerary,",
    "trip highlights, inclusions and booking details.",
    "Enquire on WhatsApp.",
  ];
  const description = suppliedDescription || truncate(descriptionParts.join(" "), 160);

  return { title, description };
}
