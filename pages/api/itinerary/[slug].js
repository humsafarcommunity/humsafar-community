import { getFreshData, SITE } from "../../../data";
import { buildItineraryPdf } from "../../../lib/itineraryPdf";

// GET /api/itinerary/<tour-slug>          -> downloads the branded itinerary PDF
// GET /api/itinerary/<tour-slug>?view=1   -> opens it in the browser instead
export default async function handler(req, res) {
  const slug = String(req.query.slug || "").replace(/\.pdf$/i, "");
  if (!/^[a-z0-9-_%]+$/i.test(slug)) return res.status(400).json({ error: "Bad trip name" });
  try {
    const data = await getFreshData();
    const tour = (data.TOURS || []).find((t) => t.slug === slug);
    if (!tour) return res.status(404).json({ error: "Trip not found" });
    const site = data.SITE?.whatsapp ? data.SITE : SITE;
    const pdf = await buildItineraryPdf(tour, site);
    const inline = req.query.view === "1";
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `${inline ? "inline" : "attachment"}; filename="Humsafar-${slug}-itinerary.pdf"`);
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
    res.setHeader("X-Robots-Tag", "noindex");
    res.status(200).send(pdf);
  } catch (e) {
    res.status(500).json({ error: "Could not build the itinerary right now. Please try again." });
  }
}
