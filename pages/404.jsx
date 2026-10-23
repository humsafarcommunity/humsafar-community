import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SITE } from "../data";
import { waLink } from "../lib/whatsapp";

// Friendly "page not found" with ways to keep going. Search engines are told not to index it.
export default function NotFoundPage() {
  const site = SITE || { name: "Humsafar Community", whatsapp: "916268496389" };
  const pill = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48, padding: "0 24px", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none" };
  return (
    <>
      <Head>
        <title>Page not found | Humsafar Community</title>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <Navbar site={site} isSolid={true} />
      <main style={{ minHeight: "70vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 20px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 560 }}>
          <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, letterSpacing: "0.3em", color: "#047857" }}>ERROR 404</p>
          <h1 style={{ margin: "0 0 14px", fontSize: "clamp(32px, 6vw, 48px)", color: "#0e1117" }}>This trail leads nowhere</h1>
          <p style={{ margin: "0 0 28px", color: "#475569", fontSize: 17, lineHeight: 1.7 }}>
            The page you wanted has moved or never existed. Pick a path below and we will get you back on the road.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 20 }}>
            <Link href="/packages" style={{ ...pill, background: "#064e3b", color: "#fff" }}>See tour packages</Link>
            <Link href="/manali-tour-packages" style={{ ...pill, background: "#fff", color: "#064e3b", border: "2px solid #064e3b" }}>Manali trips</Link>
            <Link href="/" style={{ ...pill, background: "#fff", color: "#064e3b", border: "2px solid #064e3b" }}>Home</Link>
          </div>
          <a href={waLink(site, "Hi Humsafar! I could not find a page on your website.", "404")} target="_blank" rel="noopener noreferrer" style={{ color: "#047857", fontWeight: 700, textDecoration: "underline" }}>
            Ask us on WhatsApp
          </a>
        </div>
      </main>
      <Footer dynamicSite={site} />
    </>
  );
}
