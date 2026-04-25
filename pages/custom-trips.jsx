import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import { getFreshData, SITE } from "../data";

export default function CustomTripsPage({ site: freshSite, seo: seoData }) {
  const dynamicSite = freshSite || SITE || { name: "Humsafar Community", whatsapp: "916268496389" };
  const [status, setStatus] = useState("idle"); // idle | success

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Create WhatsApp message
    const message = `Hi Humsafar! I want to plan a *Custom Trip*.\n\n👤 Name: ${data.name}\n📍 Destination: ${data.destination}\n👥 Travelers: ${data.pax}\n📅 Date: ${data.date}\n⏱ Duration: ${data.duration}\n💰 Budget: ${data.budget}\n📝 Notes: ${data.notes}`;
    
    const waUrl = `https://wa.me/${dynamicSite.whatsapp}?text=${encodeURIComponent(message)}`;
    
    setStatus("success");
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1000);
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "85px" }}>
      <SEOHead
        title="Custom Trip Planning | Design Your Dream Vacation"
        description="Plan your perfect private trip with Humsafar Community. Tell us your requirements and we'll craft a curated itinerary just for you."
        site={dynamicSite}
        seo={seoData}
        url="/custom-trips"
      />
      <Navbar site={dynamicSite} isSolid={true} />

      <main style={{ maxWidth: 800, margin: "20px auto", padding: "0 16px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 8vw, 48px)", fontWeight: 700, color: "#0e1117", marginBottom: 16 }}>
             Design Your Dream Trip
          </h1>
          <p style={{ color: "#64748b", fontSize: 16, maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>
            Tell us where you want to go and how you want to travel. Our experts will craft a personalized itinerary that fits your rhythm and style.
          </p>
        </div>

        {status === "success" ? (
          <div style={{ background: "#fff", padding: "60px 40px", borderRadius: 24, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
             <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
             <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 12 }}>Request Received!</h2>
             <p style={{ color: "#64748b", marginBottom: 24 }}>Redirecting you to WhatsApp to finalize the details with our expert...</p>
             <button 
               onClick={() => setStatus("idle")}
               style={{ background: "#064e3b", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}
             >
               Plan Another Trip
             </button>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit}
            style={{ 
              background: "#fff", 
              padding: "40px", 
              borderRadius: 24, 
              boxShadow: "0 20px 50px rgba(0,0,0,0.05)", 
              border: "1px solid #e2e8f0",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px"
            }}
          >
            <div style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>Full Name *</label>
              <input name="name" required placeholder="e.g. Rahul Sharma" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>WhatsApp Number *</label>
              <input name="phone" required placeholder="10-digit number" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Destination *</label>
              <input name="destination" required placeholder="e.g. Spiti Valley" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Approx Departure Date</label>
              <input name="date" type="date" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>No. of Travelers</label>
              <input name="pax" type="number" placeholder="e.g. 4" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Trip Duration (Days)</label>
              <input name="duration" placeholder="e.g. 5 Days" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Approx Budget (Per Person)</label>
              <input name="budget" placeholder="e.g. ₹15,000" style={inputStyle} />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>Special Requirements / Notes</label>
              <textarea name="notes" rows="4" placeholder="Mention any specific activities, preferences, or celebrations..." style={{ ...inputStyle, resize: "none" }}></textarea>
            </div>

            <div style={{ gridColumn: "span 2", marginTop: 12 }}>
              <button 
                type="submit"
                style={{ 
                  width: "100%", 
                  background: "#064e3b", 
                  color: "#fff", 
                  border: "none", 
                  padding: "18px", 
                  borderRadius: 14, 
                  fontWeight: 800, 
                  fontSize: 16, 
                  cursor: "pointer", 
                  transition: "all 0.2s ease"
                }}
              >
                Send Trip Requirement
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 16 }}>
                By submitting, you agree to receive trip updates on WhatsApp.
              </p>
            </div>
          </form>
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
      site: data.SITE,
      seo: data.SEODATA,
    },
    revalidate: 60,
  };
}

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 800,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: 1.5,
  marginBottom: 8,
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1.5px solid #e2e8f0",
  fontSize: 14,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  outline: "none",
  color: "#0e1117",
  background: "#fcfdfe",
  boxSizing: "border-box"
};
