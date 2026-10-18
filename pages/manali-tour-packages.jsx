import Link from "next/link";
import SEOHead from "../components/SEOHead";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TourCard from "../components/TourCard";
import FAQAccordion from "../components/FAQAccordion";
import BlogCard from "../components/BlogCard";
import { SITE, getFreshData, generateOrganizationSchema, generateFAQSchema } from "../data";

const isManali = (v) => String(v || "").toLowerCase().includes("manali");

export default function ManaliPackagesPage({ tours = [], guides = [], site: freshSite, seo: seoData, minPrice }) {
  const site = freshSite?.whatsapp ? freshSite : SITE;
  const waLink = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Humsafar! I want to know about Manali tour packages.")}`;

  const faqs = [
    {
      q: "How much does a Manali tour package cost?",
      a: minPrice
        ? `Our Manali packages currently start from ₹${Number(minPrice).toLocaleString("en-IN")} per person. The final price depends on the trip length, the season and how many people share a room, and each package above shows its own price.`
        : "The price depends on the trip length, the season and how many people share a room. Each package on this page shows its own price, or message us on WhatsApp for the latest rates.",
    },
    {
      q: "What is the best time to visit Manali?",
      a: "March to June is pleasant and green, with open roads and clear mountain views. December to February is for snow, with cold nights and some road closures. July to September is the monsoon, when landslides can disrupt travel. Our month-by-month guide has the details.",
    },
    {
      q: "How many days are enough for Manali?",
      a: "Four to six days covers Manali's main sights: Solang Valley, Hidimba Temple, Old Manali and the Atal Tunnel side trip to Sissu. Add one or two days if you want to include Kasol or Jibhi.",
    },
    {
      q: "How far is Manali from Delhi, and how do I get there?",
      a: "Manali is about 540 km from Delhi, roughly 12 to 14 hours by road. Our group trips leave from Delhi and Gwalior on batch dates, so you travel with the group instead of arranging transport yourself.",
    },
    {
      q: "Do I need a permit for Rohtang Pass?",
      a: "Yes, vehicles need a permit to go to Rohtang Pass, and the rules and daily limits change from season to season. The pass is usually closed in winter. Check the inclusions of the package you pick, and confirm current rules before you travel.",
    },
    {
      q: "How do I book a Manali trip with Humsafar Community?",
      a: "Pick a package, choose your departure date on the booking panel and tap Book on WhatsApp. Our team replies with the details and payment steps.",
    },
  ];

  const schemas = [
    generateOrganizationSchema(site),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Manali Tour Packages",
      itemListElement: tours.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.title,
        url: `${site.url}/packages/${t.slug}`,
      })),
    },
    generateFAQSchema(faqs, site),
  ];

  const section = { maxWidth: 1100, margin: "0 auto", padding: "0 20px" };
  const h2 = { fontSize: "clamp(24px, 4vw, 32px)", color: "#0e1117", marginBottom: 16 };
  const p = { fontSize: 17, lineHeight: 1.8, color: "#475569", marginBottom: 16, maxWidth: 720 };
  const btn = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48, padding: "0 26px", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none" };

  return (
    <>
      <SEOHead
        title="Manali Tour Packages 2026 | Humsafar Community"
        description="Book Manali group tour packages with weekly departures from Delhi and Gwalior and experienced trip captains. Compare itineraries, prices and dates."
        keywords="Manali tour packages, Manali tour packages from Delhi, Manali group tour, Manali tour package 2026, Manali backpacking trip"
        url="/manali-tour-packages"
        schemas={schemas}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Manali Tour Packages", path: "/manali-tour-packages" }]}
        site={site}
        seo={seoData}
      />
      <Navbar site={site} isSolid={true} />

      <main style={{ background: "#f8fafc", paddingBottom: 72 }}>
        <section style={{ background: "#064e3b", color: "#fff", padding: "120px 0 56px", borderRadius: "0 0 32px 32px" }}>
          <div style={section}>
            <h1 style={{ color: "#fff", fontSize: "clamp(32px, 7vw, 56px)", marginBottom: 16 }}>Manali Tour Packages 2026</h1>
            <p style={{ fontSize: "clamp(16px, 2.4vw, 19px)", lineHeight: 1.7, color: "rgba(255,255,255,0.92)", maxWidth: 680, marginBottom: 28 }}>
              Humsafar Community runs group Manali tours with weekly departures from Delhi and Gwalior. Pick a trip, choose your date and book on WhatsApp.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: "#10b981", color: "#fff" }}>Book on WhatsApp</a>
              <a href="#packages" style={{ ...btn, background: "rgba(255,255,255,0.14)", color: "#fff" }}>See packages</a>
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
            <p style={p}>
              New Manali dates are being added. See <Link href="/packages">all packages</Link> or message us on WhatsApp for the next batch.
            </p>
          )}
        </section>

        <section style={{ ...section, paddingTop: 56 }}>
          <h2 style={h2}>What a Manali trip covers</h2>
          <p style={p}>
            Most trips split the days between Manali town and the valleys around it. Solang Valley is the adventure stop for snow and ropeway rides. Hidimba Temple sits in a cedar forest in the old town. Old Manali has the cafes and the river walks. A day trip through the Atal Tunnel takes you to Sissu and the Lahaul side of the mountains.
          </p>
          <p style={p}>
            Want more than Manali? Many travellers pair it with Kasol, Jibhi or Spiti. See our <Link href="/packages?region=himachal">Himachal group tours</Link>, or build your own with a <Link href="/custom-trips">custom trip</Link>.
          </p>
        </section>

        {guides.length > 0 && (
          <section style={{ ...section, paddingTop: 40 }}>
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
      </main>

      <Footer dynamicSite={site} />
    </>
  );
}

export async function getStaticProps() {
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
  const guides = (data.BLOGS || [])
    .filter((b) => isManali(b.title) || isManali(b.slug))
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
  return {
    props: {
      tours,
      guides,
      minPrice: prices.length ? Math.min(...prices) : 0,
      site: data.SITE,
      seo: data.SEODATA,
    },
    revalidate: 60,
  };
}
