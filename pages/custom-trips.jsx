import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import { getFreshData, SITE } from "../data";
import { waLink, track } from "../lib/whatsapp";

export default function CustomTripsPage({ site: freshSite, seo: seoData }) {
  const dynamicSite = freshSite?.whatsapp ? freshSite : (SITE || { name: "Humsafar Community", whatsapp: "916268496389" });
  const [status, setStatus] = useState("idle"); // idle | success
  const [waUrl, setWaUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Create WhatsApp message
    const message = `Hi Humsafar! I want to plan a *Custom Trip*.\n\n👤 Name: ${data.name}\n📍 Destination: ${data.destination}\n👥 Travelers: ${data.pax}\n📅 Date: ${data.date}\n⏱ Duration: ${data.duration}\n💰 Budget: ${data.budget}\n📝 Notes: ${data.notes}`;
    
    setWaUrl(waLink(dynamicSite, message, "/custom-trips"));
    track("generate_lead", { event_label: "Custom trip" });
    setStatus("success");
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

      <main style={{ maxWidth: 800, margin: "20px auto", padding: "0 16px 80px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--sans)", fontSize: "clamp(28px, 8vw, 48px)", fontWeight: 700, color: "#0e1117", marginBottom: 16 }}>
             Design Your Dream Trip
          </h1>
          <p style={{ color: "#64748b", fontSize: 16, maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>
            Tell us where you want to go and how you want to travel. Our experts will craft a personalized itinerary that fits your rhythm and style.
          </p>
        </div>

        {status === "success" ? (
          <div className="p-6 sm:p-12" style={{ background: "#fff", borderRadius: 24, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
             <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
             <h2 style={{ fontFamily: "var(--sans)", fontSize: 28, marginBottom: 12 }}>Request Received!</h2>
             <p style={{ color: "#64748b", marginBottom: 24 }}>Tap the button to send these details to our team on WhatsApp.</p>
             <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#047857", color: "#fff", padding: "14px 28px", borderRadius: 999, fontWeight: 800, textDecoration: "none", marginBottom: 16 }}>Continue on WhatsApp</a><br />
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 p-5 sm:p-10 w-full box-border"
            style={{ 
              background: "#fff", 
              borderRadius: 24, 
              boxShadow: "0 20px 50px rgba(0,0,0,0.05)", 
              border: "1px solid #e2e8f0",
              maxWidth: "100%"
            }}
          >
            <div className="col-span-1 sm:col-span-2 min-w-0 w-full">
              <label htmlFor="ct-1" style={labelStyle}>Full Name *</label>
              <input id="ct-1" name="name" required placeholder="e.g. Rahul Sharma" style={inputStyle} />
            </div>

            <div className="col-span-1 min-w-0 w-full">
              <label htmlFor="ct-2" style={labelStyle}>WhatsApp Number *</label>
              <input id="ct-2" name="phone" type="tel" required placeholder="10-digit number" style={inputStyle} />
            </div>

            <div className="col-span-1 min-w-0 w-full">
              <label htmlFor="ct-3" style={labelStyle}>Destination *</label>
              <input id="ct-3" name="destination" required placeholder="e.g. Spiti Valley" style={inputStyle} />
            </div>

            <div className="col-span-1 min-w-0 w-full">
              <label htmlFor="ct-4" style={labelStyle}>Approx Departure Date</label>
              <input id="ct-4" name="date" type="date" style={inputStyle} />
            </div>

            <div className="col-span-1 min-w-0 w-full">
              <label htmlFor="ct-5" style={labelStyle}>No. of Travelers</label>
              <input id="ct-5" name="pax" type="number" min="1" placeholder="e.g. 4" style={inputStyle} />
            </div>

            <div className="col-span-1 min-w-0 w-full">
              <label htmlFor="ct-6" style={labelStyle}>Trip Duration (Days)</label>
              <input id="ct-6" name="duration" placeholder="e.g. 5 Days" style={inputStyle} />
            </div>

            <div className="col-span-1 min-w-0 w-full">
              <label htmlFor="ct-7" style={labelStyle}>Approx Budget (Per Person)</label>
              <input id="ct-7" name="budget" placeholder="e.g. ₹15,000" style={inputStyle} />
            </div>

            <div className="col-span-1 sm:col-span-2 min-w-0 w-full">
              <label htmlFor="ct-8" style={labelStyle}>Special Requirements / Notes</label>
              <textarea id="ct-8" name="notes" rows="4" placeholder="Mention any specific activities, preferences, or celebrations..." style={{ ...inputStyle, resize: "none" }}></textarea>
            </div>

            <div className="col-span-1 sm:col-span-2 min-w-0 w-full mt-2">
              <button 
                type="submit"
                style={{ 
                  width: "100%", 
                  background: "#064e3b", 
                  color: "#fff", 
                  border: "none", 
                  padding: "16px 20px", 
                  borderRadius: 14, 
                  fontWeight: 800, 
                  fontSize: 16, 
                  cursor: "pointer", 
                  transition: "all 0.2s ease",
                  boxSizing: "border-box"
                }}
              >
                Send Trip Requirement
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "#64748b", marginTop: 16 }}>
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
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: 1.5,
  marginBottom: 8,
};

const inputStyle = {
  width: "100%",
  maxWidth: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1.5px solid #e2e8f0",
  fontSize: 16,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  outline: "none",
  color: "#0e1117",
  background: "#fcfdfe",
  boxSizing: "border-box",
  minWidth: 0,
};

