import SEOHead from "../components/SEOHead";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SITE, getFreshData } from "../data";

export default function AboutPage({ site: freshSite, seo: seoData }) {
  const dynamicSite = freshSite?.whatsapp ? freshSite : (SITE || { name: "Humsafar Community", whatsapp: "916268496389" });

  return (
    <>
      <SEOHead
        title="About Humsafar Community | Traveling India Together"
        description="We are more than a travel agency. Humsafar Community connects like-minded travelers for safe, budget-friendly, and unforgettable trips across North India."
        keywords="Best community-led travel Himachal, Safe group tours for female travelers India, Travel buddies North India, Humsafar Community story"
        url="/about"
        site={dynamicSite}
        seo={seoData}
      />

      <Navbar site={dynamicSite} isSolid={true} />

      <main style={{ minHeight: "80vh", background: "#f8fafc", paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
              Our Story
            </p>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(36px, 6vw, 60px)", color: "#0f172a", marginBottom: 24, lineHeight: 1.1 }}>
              We are more than <br /> a travel agency.
            </h1>
            <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.8, maxWidth: 700, margin: "0 auto" }}>
              Humsafar Community was born from a simple idea: that travel is better when shared. We connect like-minded adventurers to create safe, budget-friendly, and truly authentic experiences across the majestic landscapes of North India.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, marginBottom: 80 }}>
            <div style={{ padding: 40, background: "#fff", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: 32, marginBottom: 20 }}>🫂</div>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginBottom: 12 }}>Community First</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6 }}>We don&apos;t just sell tours; we build friendships. Every trip is an opportunity to meet people who share your passion for exploration.</p>
            </div>
            <div style={{ padding: 40, background: "#fff", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: 32, marginBottom: 20 }}>🏔️</div>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginBottom: 12 }}>Authentic Slopes</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6 }}>Our local experts take you beyond the tourist traps to the hidden gems of Himachal and Uttarakhand that only locals know.</p>
            </div>
            <div style={{ padding: 40, background: "#fff", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: 32, marginBottom: 20 }}>🛡️</div>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginBottom: 12 }}>Safe & Student-Friendly</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6 }}>We prioritize safety, especially for female and solo travelers, making high-altitude adventure accessible and affordable for everyone.</p>
            </div>
          </div>
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
    },
    revalidate: 60,
  };
}
