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
import { DESTINATIONS, DEST_SLUGS } from "../data/destinations";
import { waLink, track } from "../lib/whatsapp";

// "<Destination> tour packages" page. With a `city`, it becomes "<Destination> tour packages from <city>".
export default function DestinationLanding({ dest: slug, tours = [], guides = [], reviews = [], site: freshSite, seo: seoData, minPrice, city }) {
  const d = DESTINATIONS[slug];
  const site = freshSite?.whatsapp ? freshSite : SITE;
  const c = city ? CITIES[city] : null;
  const base = `/${slug}-tour-packages`;
  const path = c ? `${base}/${city}` : base;
  const from = c ? ` from ${c.name}` : "";
  const message = `Hi Humsafar! I want to know about ${d.name} tour packages${from}.`;

  const faqs = [
    {
      q: `How much does a ${d.short} tour package${from} cost?`,
      a: minPrice
        ? `Our ${d.short} packages currently start from ₹${Number(minPrice).toLocaleString("en-IN")} per person${c ? `, from Delhi. Add your travel to Delhi from ${c.name}` : ""}. The final price depends on the trip length, the season and room sharing, and each package above shows its own price.`
        : `The price depends on the trip length, the season and room sharing. Message us on WhatsApp for the latest ${d.short} rates and batch dates.`,
    },
    ...(c
      ? [
          { q: `How do I reach the Delhi pickup from ${c.name}?`, a: c.reach },
          { q: `Can I join a ${d.short} group trip from ${c.name} on my own?`, a: "Yes. Our batches are open to solo travellers, and a trip captain travels with the group. You do not need to bring friends." },
        ]
      : []),
    ...d.faqs,
    { q: `How do I book a ${d.short} trip with Humsafar Community?`, a: "Pick a package, choose your departure date and tap Book on WhatsApp, or leave your number in the callback form and we will message you. No payment is needed to enquire." },
  ];

  const schemas = [
    generateOrganizationSchema(site),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${d.name} Tour Packages${from}`,
      itemListElement: tours.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.title, url: `${site.url}/packages/${t.slug}` })),
    },
    generateFAQSchema(faqs, site),
  ];

  const crumbs = [{ name: "Home", path: "/" }, { name: `${d.short} Tour Packages`, path: base }, ...(c ? [{ name: c.name, path }] : [])];
  const section = { maxWidth: 1100, margin: "0 auto", padding: "0 20px" };
  const h2 = { fontSize: "clamp(24px, 4vw, 32px)", color: "#0e1117", marginBottom: 16 };
  const p = { fontSize: 17, lineHeight: 1.8, color: "#475569", marginBottom: 16, maxWidth: 720 };
  const btn = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48, padding: "0 26px", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none" };
  const pill = { ...btn, minHeight: 44, border: "2px solid #064e3b", color: "#064e3b", background: "#fff" };
  const intro = c
    ? `Planning ${d.short} from ${c.name}? Our group trips leave from Delhi. ${c.reach.split(". ")[0]}. Then you join the batch and travel with a trip captain, with stays and road travel planned.`
    : d.heroLine;

  return (
    <>
      <SEOHead
        title={`${d.name} Tour Packages${from} 2026 | Humsafar Community`}
        description={
          c
            ? `${d.name} group tour packages${from}: fly to Delhi, join a weekly batch and travel with a trip captain. Compare itineraries, prices and dates.`
            : `Book ${d.name} group tour packages with weekly departures from Delhi and an experienced trip captain. Compare itineraries, prices and dates.`
        }
        keywords={`${d.short} tour packages${from}, ${d.short} group tour${from}, ${d.name} trip 2026`}
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
            <h1 style={{ color: "#fff", fontSize: "clamp(30px, 7vw, 54px)", marginBottom: 16 }}>{d.name} Tour Packages{from} 2026</h1>
            <p style={{ fontSize: "clamp(16px, 2.4vw, 19px)", lineHeight: 1.7, color: "rgba(255,255,255,0.92)", maxWidth: 680, marginBottom: 28 }}>{intro}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href="#callback" style={{ ...btn, background: "#fff", color: "#064e3b" }}>Get a callback</a>
              <a href={waLink(site, message, path)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { event_label: path })} style={{ ...btn, background: "#047857", color: "#fff" }}>Book on WhatsApp</a>
            </div>
          </div>
        </section>

        <section id="packages" style={{ ...section, paddingTop: 48 }}>
          <h2 style={h2}>{d.short} group trips</h2>
          {tours.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 24 }}>
              {tours.map((t) => <TourCard key={t._id || t.slug} tour={t} />)}
            </div>
          ) : (
            <p style={p}>New {d.short} dates are being added. See <Link href="/packages">all packages</Link> or message us on WhatsApp for the next batch.</p>
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
          <h2 style={h2}>What a {d.short} trip covers</h2>
          {d.covers.map((t) => <p key={t} style={p}>{t}</p>)}
          <p style={p}>
            Want more? See our <Link href="/packages?region=himachal">Himachal group tours</Link>, the <Link href="/manali-tour-packages">Manali packages</Link>, or build your own with a <Link href="/custom-trips">custom trip</Link>.
          </p>
        </section>

        <section id="callback" style={{ ...section, paddingTop: 56, maxWidth: 760 }}>
          <LeadForm site={site} source={path} trip={`${d.name} tour package${from}`} title={`Plan your ${d.short} trip${from}`} />
        </section>

        {guides.length > 0 && (
          <section style={{ ...section, paddingTop: 56 }}>
            <h2 style={h2}>{d.short} travel guides</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 24 }}>
              {guides.map((b) => <BlogCard key={b._id || b.slug} blog={b} />)}
            </div>
          </section>
        )}

        <section style={{ ...section, paddingTop: 56 }}>
          <h2 style={h2}>{d.short} trip questions</h2>
          <div style={{ maxWidth: 820 }}>
            <FAQAccordion faqs={faqs} defaultOpen={null} />
          </div>
        </section>

        <section style={{ ...section, paddingTop: 56 }}>
          <h2 style={{ ...h2, fontSize: 22 }}>{d.short} packages from other cities</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {c && <Link href={base} style={pill}>All {d.short} packages</Link>}
            {CITY_SLUGS.filter((s) => s !== city).map((s) => (
              <Link key={s} href={`${base}/${s}`} style={pill}>{CITIES[s].name}</Link>
            ))}
          </div>
          <h2 style={{ ...h2, fontSize: 22, marginTop: 32 }}>More destinations</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/manali-tour-packages" style={pill}>Manali</Link>
            {DEST_SLUGS.filter((s) => s !== slug).map((s) => (
              <Link key={s} href={`/${s}-tour-packages`} style={pill}>{DESTINATIONS[s].short}</Link>
            ))}
          </div>
        </section>
      </main>

      <MobileCtaBar site={site} message={message} source={path} />
      <Footer dynamicSite={site} />
    </>
  );
}
