// Traveller reviews as a card carousel. Reviews come from Sanity Studio → Reviews (real ones only). Hidden when there are none.
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Carousel from "./Carousel";

const LIMIT = 190;
const initials = (n = "") => n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

function Card({ r }) {
  const [open, setOpen] = useState(false);
  const stars = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
  const long = (r.text || "").length > LIMIT;
  const text = open || !long ? r.text : r.text.slice(0, LIMIT).replace(/\s+\S*$/, "") + "…";
  return (
    <article style={{ width: "min(86vw, 420px)", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 28, padding: 24, display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 6px 24px rgba(15,23,42,0.05)" }}>
      <header style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <span style={{ position: "relative", width: 52, height: 52, borderRadius: 999, overflow: "hidden", flexShrink: 0, background: "#064e3b", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800 }}>
          {r.photo ? <Image src={r.photo} alt="" fill sizes="52px" style={{ objectFit: "cover" }} /> : initials(r.author)}
        </span>
        <div style={{ minWidth: 0 }}>
          <strong style={{ fontSize: 18, color: "#0f172a" }}>{r.author}</strong>
          <span style={{ display: "block", fontSize: 13, color: "#64748b" }}>
            {[r.city, r.source ? `via ${r.source}` : "Joined group trip"].filter(Boolean).join(" · ")}
          </span>
        </div>
      </header>
      {r.trip && (
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
          Booked:{" "}
          {r.tourSlug ? (
            <Link href={`/packages/${r.tourSlug}`} style={{ color: "#0f172a", fontWeight: 700 }}>{r.trip} ↗</Link>
          ) : (
            <strong style={{ color: "#0f172a" }}>{r.trip}</strong>
          )}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span role="img" aria-label={`${stars} out of 5 stars`} style={{ color: "#f59e0b", fontSize: 20, letterSpacing: 2 }}>
          {"★".repeat(stars)}<span style={{ color: "#e2e8f0" }}>{"★".repeat(5 - stars)}</span>
        </span>
        {r.date && <span style={{ fontSize: 13, color: "#64748b" }}>{r.date}</span>}
      </div>
      <blockquote style={{ margin: 0, color: "#334155", lineHeight: 1.65, fontSize: 15.5 }}>
        &ldquo;{text}&rdquo;
        {long && (
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} style={{ border: 0, background: "none", color: "#047857", fontWeight: 700, cursor: "pointer", padding: "0 0 0 6px", fontSize: 15 }}>
            {open ? "Show less" : "Read more"}
          </button>
        )}
      </blockquote>
    </article>
  );
}

export default function ReviewsSection({ reviews = [], title = "Reviews", reviewsUrl, tourSlug }) {
  if (!reviews.length) return null;
  const sorted = tourSlug ? [...reviews].sort((a, b) => (b.tourSlug === tourSlug) - (a.tourSlug === tourSlug)) : reviews;
  return (
    <Carousel
      title={title}
      autoplay={6000}
      subtitle="Real words from travellers on our group trips."
      action={reviewsUrl ? <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 6, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>View All</a> : null}
    >
      {sorted.map((r) => <Card key={r._id || r.author + r.text.slice(0, 12)} r={r} />)}
    </Carousel>
  );
}
