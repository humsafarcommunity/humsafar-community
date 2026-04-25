import { useState } from "react";
import SEOHead from "../../components/SEOHead";
import TourCard from "../../components/TourCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getFreshData, SITE } from "../../data";
import Link from "next/link";

export default function PackagesPage({ tours, site: freshSite, seo: seoData }) {
  const dynamicSite = freshSite || SITE || { name: "Humsafar Community", socials: {} };
  const [selectedRegion, setSelectedRegion] = useState("all");
  
  const regions = [
    { id: "all", label: "All Destinations" },
    { id: "himachal", label: "Himachal Pradesh" },
    { id: "uttarakhand", label: "Uttarakhand" },
    { id: "rajasthan", label: "Rajasthan" },
    { id: "international", label: "International" },
    { id: "other", label: "Rest of India" },
  ];

  const seoConfig = {
    himachal: {
      title: "Himachal Pradesh Group Tours & Packages 2026 | Humsafar Community",
      desc: "Explore Manali, Kasol, and Spiti Valley with Humsafar Community. Affordable, safe, and fun Himachal backpacking trips for students and solo travelers.",
      keys: "Himachal group tours for students, Humsafar Community Manali itinerary, Spiti Valley group departures, Budget Kasol tours"
    },
    uttarakhand: {
      title: "Offbeat Uttarakhand Tours & Treks | Humsafar Community",
      desc: "Discover hidden gems in Uttarakhand. Book budget-friendly group departures, Kedarnath yatra, and adventure treks with India's best travel community.",
      keys: "Affordable Uttarakhand backpacker trips, Kedarnath group departure 2026, Offbeat stay options in Uttarakhand, Weekend trips from Delhi to Uttarakhand"
    },
    all: {
      title: "All Tour Packages | Humsafar Community",
      desc: "Explore all our group tours and travel packages across India and International destinations.",
      keys: "group tours india, travel packages 2026, humsafar community tours"
    }
  };

  const currentSEO = seoConfig[selectedRegion] || seoConfig.all;

  const filtered = tours.filter(
    (t) => selectedRegion === "all" || t.region === selectedRegion
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "85px" }}>
      <SEOHead
        title={currentSEO.title}
        description={currentSEO.desc}
        keywords={currentSEO.keys}
        site={dynamicSite}
        seo={seoData}
        url="/packages"
      />

      <Navbar site={dynamicSite} isSolid={true} />

      <main style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 40, marginBottom: 20 }}>Our Tour Packages</h1>
        
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                border: "none",
                background: selectedRegion === r.id ? "#064e3b" : "#fff",
                color: selectedRegion === r.id ? "#fff" : "#64748b",
                cursor: "pointer",
                fontWeight: 600,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 30 }}>
          {filtered.map((tour, idx) => (
            <TourCard key={tour._id || tour.slug || idx} tour={tour} />
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px", color: "#94a3b8" }}>
            No packages found in this category.
          </div>
        )}
      </main>

      <Footer dynamicSite={dynamicSite} />
    </div>
  );
}

export async function getStaticProps() {
  const data = await getFreshData();
  return {
    props: {
      tours: data.TOURS,
      site: data.SITE,
      seo: data.SEODATA,
    },
    revalidate: 60,
  };
}
