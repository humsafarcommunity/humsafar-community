import Link from "next/link";
import Image from "next/image";
import SEOHead from "../components/SEOHead";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SITE, getFreshData } from "../data";
import { urlFor } from "../lib/sanity.image";

// Shown for any field left empty in the CMS (Sanity Studio → About Us Page).
const DEFAULTS = {
  eyebrow: "Our Story",
  headline: "We are more than\na travel agency.",
  intro:
    "Humsafar Community was born from a simple idea: that travel is better when shared. We connect like-minded adventurers to create safe, budget-friendly, and truly authentic experiences across the majestic landscapes of North India.",
  values: [
    { icon: "🫂", title: "Community First", description: "We don't just sell tours; we build friendships. Every trip is an opportunity to meet people who share your passion for exploration." },
    { icon: "🏔️", title: "Authentic Slopes", description: "Our local experts take you beyond the tourist traps to the hidden gems of Himachal and Uttarakhand that only locals know." },
    { icon: "🛡️", title: "Safe & Student-Friendly", description: "We prioritize safety, especially for female and solo travelers, making high-altitude adventure accessible and affordable for everyone." },
  ],
  ctaTitle: "Ready to travel with us?",
  ctaText: "Pick a Saturday batch and meet your Humsafars.",
  ctaButtonLabel: "See upcoming trips",
  ctaButtonLink: "/packages",
  teamTitle: "Meet your trip captains",
  storyTitle: "How we started",
};

const card = { background: "#fff", borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" };

function isInternal(href) {
  return typeof href === "string" && href.startsWith("/");
}

export default function AboutPage({ site: freshSite, seo: seoData, about }) {
  const dynamicSite = freshSite?.whatsapp ? freshSite : (SITE || { name: "Humsafar Community", whatsapp: "916268496389" });
  const a = about || {};
  const pick = (k) => (a[k] && String(a[k]).trim() ? a[k] : DEFAULTS[k]);

  const headline = pick("headline");
  const values = a.values?.length ? a.values : DEFAULTS.values;
  const stats = a.stats || [];
  const team = a.team || [];
  const storyParagraphs = (a.story || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const ctaLink = pick("ctaButtonLink");

  const ctaStyle = {
    display: "inline-block", background: "#064e3b", color: "#fff", padding: "14px 28px",
    borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none",
  };

  return (
    <>
      <SEOHead
        title={a.seoTitle || "About Humsafar Community | Traveling India Together"}
        description={a.seoDescription || "We are more than a travel agency. Humsafar Community connects like-minded travelers for safe, budget-friendly, and unforgettable trips across North India."}
        keywords="Best community-led travel Himachal, Safe group tours for female travelers India, Travel buddies North India, Humsafar Community story"
        image={a.ogImage ? urlFor(a.ogImage) : undefined}
        url="/about"
        site={dynamicSite}
        seo={seoData}
      />

      <Navbar site={dynamicSite} isSolid={true} />

      <main style={{ minHeight: "80vh", background: "#f8fafc", paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#047857", marginBottom: 16 }}>{pick("eyebrow")}</p>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 60px)", color: "#0f172a", marginBottom: 24, whiteSpace: "pre-line" }}>
              {headline}
            </h1>
            <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.8, maxWidth: 700, margin: "0 auto" }}>{pick("intro")}</p>
          </div>

          {a.heroImage && (
            <div style={{ position: "relative", aspectRatio: "16 / 8", borderRadius: 28, overflow: "hidden", marginBottom: 48 }}>
              <Image
                src={urlFor(a.heroImage)}
                alt={a.heroImage.alt || "Humsafar Community travelers on a trip"}
                fill
                priority
                sizes="(max-width: 960px) 100vw, 960px"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          {/* Stats */}
          {stats.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: 16, marginBottom: 64 }}>
              {stats.map((s, i) => (
                <div key={s._key || i} style={{ ...card, padding: "24px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#064e3b" }}>{s.value}</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Story */}
          {storyParagraphs.length > 0 && (
            <section style={{ maxWidth: 720, margin: "0 auto 72px" }}>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 34px)", color: "#0f172a", marginBottom: 20 }}>{pick("storyTitle")}</h2>
              {storyParagraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 17, color: "#475569", lineHeight: 1.85, marginBottom: 18 }}>{p}</p>
              ))}
            </section>
          )}

          {/* Values */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 24, marginBottom: 72 }}>
            {values.map((v, i) => (
              <div key={v._key || i} style={{ ...card, padding: 36 }}>
                {v.icon && <div style={{ fontSize: 32, marginBottom: 18 }}>{v.icon}</div>}
                <h2 style={{ fontSize: 22, color: "#0f172a", marginBottom: 12 }}>{v.title}</h2>
                <p style={{ color: "#64748b", lineHeight: 1.65 }}>{v.description}</p>
              </div>
            ))}
          </div>

          {/* Team */}
          {team.length > 0 && (
            <section style={{ marginBottom: 72 }}>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 34px)", color: "#0f172a", marginBottom: 28 }}>{pick("teamTitle")}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))", gap: 20 }}>
                {team.map((m, i) => (
                  <div key={m._key || i} style={{ ...card, overflow: "hidden" }}>
                    <div style={{ position: "relative", aspectRatio: "1 / 1", background: "#e2e8f0" }}>
                      {m.photo && (
                        <Image src={urlFor(m.photo)} alt={m.name} fill sizes="(max-width: 600px) 50vw, 220px" style={{ objectFit: "cover" }} />
                      )}
                    </div>
                    <div style={{ padding: "16px 18px 20px" }}>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{m.name}</div>
                      {m.role && <div style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{m.role}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Closing call to action */}
          <section style={{ ...card, padding: "48px 28px", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", color: "#0f172a", marginBottom: 10 }}>{pick("ctaTitle")}</h2>
            <p style={{ color: "#64748b", marginBottom: 24 }}>{pick("ctaText")}</p>
            {isInternal(ctaLink) ? (
              <Link href={ctaLink} style={ctaStyle}>{pick("ctaButtonLabel")}</Link>
            ) : (
              <a href={ctaLink} style={ctaStyle} rel="noopener noreferrer">{pick("ctaButtonLabel")}</a>
            )}
          </section>
        </div>
      </main>

      <Footer dynamicSite={dynamicSite} />
    </>
  );
}

export async function getStaticProps() {
  const data = await getFreshData();
  return {
    props: {
      site: data.SITE,
      seo: data.SEODATA,
      about: JSON.parse(JSON.stringify(data.ABOUT || null)),
    },
    revalidate: 60,
  };
}
