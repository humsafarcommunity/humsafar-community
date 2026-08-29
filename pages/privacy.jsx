import SEOHead from "../components/SEOHead";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SITE, getFreshData } from "../data";

export default function PrivacyPage({ site: freshSite, seo: seoData }) {
  const dynamicSite = freshSite?.whatsapp ? freshSite : (SITE || { name: "Humsafar Community", whatsapp: "916268496389" });

  return (
    <>
      <SEOHead
        title="Privacy Policy | Humsafar Community"
        description="Privacy Policy for Humsafar Community. Read about how we collect, use, and protect your personal information when booking group tours."
        keywords="Privacy Policy, Humsafar Community, travel booking safety, data protection"
        url="/privacy"
        site={dynamicSite}
        seo={seoData}
      />

      <Navbar site={dynamicSite} isSolid={true} />

      <main style={{ minHeight: "80vh", background: "#f8fafc", paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          <div style={{ background: "#ffffff", borderRadius: 24, padding: "48px 40px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(32px, 5vw, 48px)", color: "#0f172a", marginBottom: 8 }}>
              Privacy Policy
            </h1>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>Last updated: August 27, 2026</p>

            <div style={{ color: "#334155", lineHeight: 1.8, fontSize: 16 }}>
              <p style={{ marginBottom: 24 }}>
                At <strong>Humsafar Community</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our booking services.
              </p>

              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>
                1. Information We Collect
              </h2>
              <p style={{ marginBottom: 16 }}>
                We collect personal information that you voluntarily provide to us when registering, booking tours, subscribing to our newsletter, or contacting us. This may include:
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                <li>Name, email address, phone number, and physical address.</li>
                <li>Emergency contact details and companion traveler information.</li>
                <li>Government-issued identification (e.g., Aadhaar, Passport) required for tour registrations and permits.</li>
                <li>Payment details processed securely through our payment gateway partners.</li>
              </ul>

              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>
                2. How We Use Your Information
              </h2>
              <p style={{ marginBottom: 16 }}>
                We use the information we collect to:
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                <li>Process and manage your tour bookings and registrations.</li>
                <li>Provide travel support, itinerary updates, and trip coordination.</li>
                <li>Fulfill legal and government requirements (e.g., Char Dham Yatra registrations, forest permits).</li>
                <li>Send promotional emails and newsletters (you can opt out at any time).</li>
              </ul>

              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>
                3. Information Sharing & Disclosure
              </h2>
              <p style={{ marginBottom: 24 }}>
                We do not sell, rent, or trade your personal information. We may share information with trusted third-party service providers (such as hotel partners, local transport operators, and permit authorities) solely to execute your booked travel itineraries.
              </p>

              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>
                4. Data Security
              </h2>
              <p style={{ marginBottom: 24 }}>
                We implement industry-standard security measures to safeguard your personal data. However, please note that no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>
                5. Contact Us
              </h2>
              <p style={{ marginBottom: 24 }}>
                If you have any questions or concerns regarding this Privacy Policy, you can reach out to us at:
              </p>
              <p style={{ background: "#f1f5f9", padding: 20, borderRadius: 12, display: "inline-block", width: "100%", boxSizing: "border-box" }}>
                <strong>Email:</strong> {dynamicSite.email || "hello@humsafarcommunity.com"}<br />
                <strong>WhatsApp / Phone:</strong> {dynamicSite.phone || "+91 62684 96389"}<br />
                <strong>Address:</strong> {dynamicSite.address || "Gurugram, Haryana, India"}
              </p>
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
