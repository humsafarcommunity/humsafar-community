import SEOHead from "../components/SEOHead";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SITE, getFreshData } from "../data";

export default function TermsPage({ site: freshSite, seo: seoData }) {
  const dynamicSite = freshSite?.whatsapp ? freshSite : (SITE || { name: "Humsafar Community", whatsapp: "916268496389" });

  return (
    <>
      <SEOHead
        title="Terms of Service | Humsafar Community"
        description="Terms and Conditions of Humsafar Community. Read the booking terms, cancellation policies, and traveler guidelines before booking."
        keywords="Terms of Service, Terms and Conditions, Humsafar Community, Booking Terms, Cancellation Policy"
        url="/terms"
        site={dynamicSite}
        seo={seoData}
      />

      <Navbar site={dynamicSite} isSolid={true} />

      <main style={{ minHeight: "80vh", background: "#f8fafc", paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          <div style={{ background: "#ffffff", borderRadius: 24, padding: "48px 40px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(32px, 5vw, 48px)", color: "#0f172a", marginBottom: 8 }}>
              Terms of Service
            </h1>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>Last updated: August 27, 2026</p>

            <div style={{ color: "#334155", lineHeight: 1.8, fontSize: 16 }}>
              <p style={{ marginBottom: 24 }}>
                Welcome to <strong>Humsafar Community</strong>. Please read these Terms of Service carefully before booking a tour, expedition, or trip with us. By using our website and services, you agree to be bound by these terms.
              </p>

              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>
                1. Booking & Payments
              </h2>
              <p style={{ marginBottom: 16 }}>
                All bookings are subject to availability and are confirmed only upon receipt of the initial booking amount or full payment as specified:
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                <li>A booking is only secured once a confirmation voucher/email is issued by Humsafar Community.</li>
                <li>The remaining balance must be paid before or at the start of the trip, as per the booking terms.</li>
                <li>Failure to pay the remaining balance on time may result in cancellation of the booking with no refund of the advance.</li>
              </ul>

              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>
                2. Cancellation & Refund Policy
              </h2>
              <p style={{ marginBottom: 16 }}>
                Our standard cancellation policy is structured as follows (unless stated otherwise in specific package itineraries):
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                <li><strong>30 days or more before departure:</strong> 90% refund of the total package cost.</li>
                <li><strong>15 to 29 days before departure:</strong> 50% refund of the total package cost.</li>
                <li><strong>Less than 15 days before departure:</strong> No refund or transfers.</li>
                <li>In case of natural calamities, landslides, roadblocks, or government restrictions, we will offer trip vouchers or alternative arrangements, but cash refunds may not be possible.</li>
              </ul>

              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>
                3. Traveler Guidelines & Conduct
              </h2>
              <p style={{ marginBottom: 24 }}>
                Humsafar Community is a group travel community. Travelers are expected to maintain respectful behavior toward trip leaders, local hosts, and fellow travelers. The use of illegal substances is strictly prohibited on our trips. We reserve the right to expel any traveler from a trip if their behavior is disruptive or dangerous, without any refunds.
              </p>

              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>
                4. Liability & Insurance
              </h2>
              <p style={{ marginBottom: 24 }}>
                Travel involves inherent risks, especially in high-altitude terrain. Humsafar Community is not liable for injuries, delays, losses, or damages resulting from weather, road blockages, physical ailments, or other unforeseen events. We strongly recommend that all travelers purchase travel insurance before departure.
              </p>

              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>
                5. Changes to Terms
              </h2>
              <p style={{ marginBottom: 24 }}>
                We reserve the right to modify these terms at any time. Any changes will be posted on this page with the updated date.
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
