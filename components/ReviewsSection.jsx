// Traveller reviews from the CMS (Sanity Studio → Reviews). Hidden when there are none.
import Image from "next/image";

export default function ReviewsSection({ reviews = [], title = "What travellers say", reviewsUrl }) {
  if (!reviews.length) return null;
  return (
    <section aria-label={title}>
      <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", color: "#0e1117", marginBottom: 20 }}>{title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 20 }}>
        {reviews.slice(0, 6).map((r) => (
          <figure key={r._id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <div aria-label={`${r.rating || 5} out of 5 stars`} style={{ color: "#f59e0b", fontSize: 18, letterSpacing: 2 }}>
              {"★".repeat(Math.round(r.rating || 5))}
              <span style={{ color: "#e2e8f0" }}>{"★".repeat(5 - Math.round(r.rating || 5))}</span>
            </div>
            <blockquote style={{ margin: 0, color: "#334155", lineHeight: 1.7, fontSize: 15 }}>&ldquo;{r.text}&rdquo;</blockquote>
            <figcaption style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
              {r.photo && (
                <span style={{ position: "relative", width: 44, height: 44, borderRadius: 999, overflow: "hidden", flexShrink: 0 }}>
                  <Image src={r.photo} alt={r.author} fill sizes="44px" style={{ objectFit: "cover" }} />
                </span>
              )}
              <span>
                <strong style={{ display: "block", color: "#0f172a", fontSize: 15 }}>{r.author}</strong>
                <span style={{ fontSize: 13, color: "#64748b" }}>
                  {[r.city, r.trip, r.date].filter(Boolean).join(" · ")}
                  {r.source ? ` · via ${r.source}` : ""}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {reviewsUrl && (
        <p style={{ marginTop: 18 }}>
          <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>Read all reviews on Google</a>
        </p>
      )}
    </section>
  );
}
