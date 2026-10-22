import Link from "next/link";
import SEOHead from "./SEOHead";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TourCard from "./TourCard";
import BlogCard from "./BlogCard";
import FAQAccordion from "./FAQAccordion";
import LeadForm from "./LeadForm";
import ReviewsSection from "./ReviewsSection";
import MobileCtaBar from "./MobileCtaBar";
import { SITE, generateOrganizationSchema, generateFAQSchema } from "../data";
import { CITIES, CITY_SLUGS } from "../data/cities";
import { waLink, track } from "../lib/whatsapp";

// The Manali keyword page. With a `city`, it becomes "Manali tour packages from <city>".
export default function ManaliLanding({ tours = [], guides = [], reviews = [], site: freshSite, seo: seoData, minPrice, city }) {
  const site = freshSite?.whatsapp ? freshSite : SITE;
  const c = city ? CITIES[city] : null;
  const path = c ? `/manali-tour-packages/${city}` : "/manali-tour-packages";
  const from = c ? ` from ${c.name}` : "";
  const message = `Hi Humsafar! I want to know about Manali tour packages${from}.`;

  const faqs = [
    {
      q: `How much does a Manali tour package${from} cost?`,
      a: minPrice
        ? `Our Manali packages currently start from ₹${Number(minPrice).toLocaleString("en-IN")} per person${c ? `, from Delhi. Add your travel to Delhi from ${c.name}` : ""}. The final price depends on the trip length, the season and how many people share a room, and each package above shows its own price.`
        : "The price depends on the trip length, the season and how many people share a room. Each package on this page shows its own price, or message us on WhatsApp for the latest rates.",
    },
    ...(c
      ? [
          { q: `How do I reach the Delhi pickup from ${c.name}?`, a: c.reach },
          { q: `Can I join a Manali group trip from ${c.name} on my own?`, a: "Yes. Our batches are open to solo travellers, and a trip captain travels with the group. You do not need to bring friends." },
        ]
      : []),
    { q: "What is the best time to visit Manali?", a: "March to June is pleasant and green, with open roads and clear mountain views. December to February is for snow, with cold nights and some road closures. July to September is the monsoon, when landslides can disrupt travel. Our month-by-month guide has the details." },
    { q: "How many days are enough for Manali?", a: "Four to six days covers Manali's main sights: Solang Valley, Hidimba Temple, Old Manali and the Atal Tunnel side trip to Sissu. Add one or two days if you want to include Kasol or Jibhi." },
    { q: "How far is Manali from Delhi, and how do I get there?", a: "Manali is about 540 km from Delhi, roughly 12 to 14 hours by road. Our group trips leave from Delhi on batch dates, so you travel with the group instead of arranging transport yourself." },
    { q: "Do I need a permit for Rohtang Pass?", a: "Yes, vehicles need a permit to go to Rohtang Pass, and the rules and daily limits change from season to season. The pass is usually closed in winter. Check the inclusions of the package you pick, and confirm current rules before you travel." },
    { q: "How do I book a Manali trip with Humsafar Community?", a: "Pick a package, choose your departure date and tap Book on WhatsApp, or leave your number in the callback form and we will message you. No payment is needed to enquire." },
  ];

  const schemas = [
    generateOrganizationSchema(site),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Manali Tour Packages${from}`,
      itemListElement: tours.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.title, url: `${site.url}/packages/${t.slug}` })),
    },
    generateFAQSchema(faqs, site),
  ];

  const crumbs = [{ name: "Home", path: "/" }, { name: "Manali Tour Packages", path: "/manali-tour-packages" }, ...(c ? [{ name: c.name, path }] : [])];
  const section = { maxWidth: 1100, margin: "0 auto", padding: "0 20px" };
  const h2 = { fontSize: "clamp(24px, 4vw, 32px)", color: "#0e1117", marginBottom: 16 };
  const p = { fontSize: 17, lineHeight: 1.8, color: "#475569", marginBottom: 16, maxWidth: 720 };
  const btn = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48, padding: "0 26px", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none" };

  return (
    <>
      <SEOHead
        title={`Manali Tour Packages${from} 2026 | Humsafar Community`}
        description={
          c
            ? `Manali group tour packages${from}: fly to Delhi, join a weekly batch and travel with a trip captain. Compare itineraries, prices and dates.`
            : "Book Manali group tour packages with weekly departures from Delhi and Gwalior and experienced trip captains. Compare itineraries, prices and dates."
        }
        keywords={`Manali tour packages${from}, Manali group tour${from}, Manali tour package 2026`}
        url={path}
        schemas={schemas}
        breadcrumbs={crumbs}
        site={site}
        seo={seoData}
      />
      <Navbar site={site} isSolid={true} />

      <main style={{ background: "#f8fafc", paddingBottom: 72 }}>
        <section style={{ background: "#064e3b", color: "#fff", padding: "120px 0 56px", borderRadius: "0 0 32px 32px" }}>
          <div style={section}>
            <h1 style={{ color: "#fff", fontSize: "clamp(30px, 7vw, 54px)", marginBottom: 16 }}>Manali Tour Packages{from} 2026</h1>
            <p style={{ fontSize: "clamp(16px, 2.4vw, 19px)", lineHeight: 1.7, color: "rgba(255,255,255,0.92)", maxWidth: 680, marginBottom: 28 }}>
              {c ? c.intro : "Humsafar Community runs group Manali tours with weekly departures from Delhi and Gwalior. Pick a trip, choose your date and book on WhatsApp."}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href="#callback" style={{ ...btn, background: "#fff", color: "#064e3b" }}>Get a callback</a>
              <a href={waLink(site, message, path)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { event_label: path })} style={{ ...btn, background: "#047857", color: "#fff" }}>Book on WhatsApp</a>
            </div>
          </div>
        </section>

        <section id="packages" style={{ ...section, paddingTop: 48 }}>
          <h2 style={h2}>Manali group trips</h2>
          {tours.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 24 }}>
              {tours.map((t) => <TourCard key={t._id || t.slug} tour={t} />)}
            </div>
          ) : (
            <p style={p}>New Manali dates are being added. See <Link href="/packages">all packages</Link> or message us on WhatsApp for the next batch.</p>
          )}
        </section>

        {c && (
          <section style={{ ...section, paddingTop: 56 }}>
            <h2 style={h2}>Getting from {c.name} to Delhi</h2>
            <p style={p}>{c.reach}</p>
            <p style={p}>The Delhi pickup point is shown on each package page. If you are unsure about your flight or train timings, message us before you book.</p>
          </section>
        )}

        {reviews.length > 0 && (
          <section style={{ ...section, paddingTop: 56 }}>
            <ReviewsSection reviews={reviews} reviewsUrl={site.googleReviewsUrl} />
          </section>
        )}

        <section style={{ ...section, paddingTop: 56 }}>
          <h2 style={h2}>What a Manali trip covers</h2>
          <p style={p}>
            Most trips split the days between Manali town and the valleys around it. Solang Valley is the adventure stop for snow and ropeway rides. Hidimba Temple sits in a cedar forest in the old town. Old Manali has the cafes and the river walks. A day trip through the Atal Tunnel takes you to Sissu and the Lahaul side of the mountains.
          </p>
          <p style={p}>
            Want more than Manali? Many travellers pair it with Kasol, Jibhi or Spiti. See our <Link href="/packages?region=himachal">Himachal group tours</Link>, or build your own with a <Link href="/custom-trips">custom trip</Link>.
          </p>
        </section>

        <section id="callback" style={{ ...section, paddingTop: 56, maxWidth: 760 }}>
          <LeadForm site={site} source={path} trip={`Manali tour package${from}`} title={`Plan your Manali trip${from}`} />
        </section>

        {guides.length > 0 && (
          <section style={{ ...section, paddingTop: 56 }}>
            <h2 style={h2}>Manali travel guides</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 24 }}>
              {guides.map((b) => <BlogCard key={b._id || b.slug} blog={b} />)}
            </div>
          </section>
        )}

        <section style={{ ...section, paddingTop: 56 }}>
          <h2 style={h2}>Manali trip questions</h2>
          <div style={{ maxWidth: 820 }}>
            <FAQAccordion faqs={faqs} defaultOpen={null} />
          </div>
        </section>

        <section style={{ ...section, paddingTop: 56 }}>
          <h2 style={{ ...h2, fontSize: 22 }}>Manali packages from other cities</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {c && <Link href="/manali-tour-packages" style={{ ...btn, minHeight: 44, border: "2px solid #064e3b", color: "#064e3b", background: "#fff" }}>All Manali packages</Link>}
            {CITY_SLUGS.filter((s) => s !== city).map((s) => (
              <Link key={s} href={`/manali-tour-packages/${s}`} style={{ ...btn, minHeight: 44, border: "2px solid #064e3b", color: "#064e3b", background: "#fff" }}>{CITIES[s].name}</Link>
            ))}
          </div>
        </section>
      </main>

      <MobileCtaBar site={site} message={message} source={path} />
      <Footer dynamicSite={site} />
    </>
  );
}
