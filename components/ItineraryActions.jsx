import { useState } from "react";
import { waLink, track } from "../lib/whatsapp";

// Buttons above the itinerary: download the branded PDF, copy the page link, share on WhatsApp.
export default function ItineraryActions({ tour, site, pageUrl }) {
  const [msg, setMsg] = useState("");
  const pdfHref = `/api/itinerary/${tour.slug}`;
  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(""), 2500); };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      flash("Link copied");
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = pageUrl; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); flash("Link copied"); } catch (err) { flash("Press and hold the address bar to copy"); }
      document.body.removeChild(ta);
    }
    track("copy_trip_link", { event_label: tour.slug });
  };

  const share = async () => {
    track("share_trip", { event_label: tour.slug });
    if (navigator.share) {
      try { await navigator.share({ title: tour.title, text: `${tour.title} - Humsafar Community`, url: pageUrl }); return; } catch (e) { /* cancelled */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${tour.title}\n${pageUrl}`)}`, "_blank", "noopener");
  };

  const btn = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 44, padding: "0 18px", borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: "pointer", textDecoration: "none", fontFamily: "var(--sans)", border: "1.5px solid #064e3b", whiteSpace: "nowrap" };
  const icon = (d) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;

  return (
    <div className="it-actions" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 16 }}>
      <a href={pdfHref} download onClick={() => track("download_itinerary", { event_label: tour.slug })} style={{ ...btn, background: "#064e3b", color: "#fff" }}>
        {icon("M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3")} Download itinerary (PDF)
      </a>
      <button type="button" onClick={copy} style={{ ...btn, background: "#fff", color: "#064e3b" }}>
        {icon("M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1")} Copy link
      </button>
      <button type="button" onClick={share} style={{ ...btn, background: "#fff", color: "#064e3b" }}>
        {icon("M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13")} Share
      </button>
      <span role="status" aria-live="polite" style={{ fontSize: 14, fontWeight: 700, color: "#047857" }}>{msg}</span>
      <style jsx>{`@media (max-width: 600px){ .it-actions :global(a), .it-actions :global(button){ flex: 1 1 100%; } }`}</style>
    </div>
  );
}
