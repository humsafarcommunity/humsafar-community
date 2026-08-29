import Link from 'next/link';
import Image from 'next/image';

export default function TourCard({ tour }) {
  if (!tour) return null;
  return (
    <article
      style={{
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, box-shadow",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(6, 78, 59, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.04)";
      }}
      itemScope
      itemType="https://schema.org/TouristTrip"
    >
      <div style={{ position: "relative", paddingTop: "60%", overflow: "hidden" }}>
        <Image
          src={tour.img || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"}
          alt={`${tour.title} — ${tour.location}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
          itemProp="image"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.1) 60%, transparent 100%)",
          }}
        />
        {tour.bestseller && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "#d97706",
              color: "#fff",
              fontSize: 10,
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              boxShadow: "0 2px 8px rgba(217, 119, 6, 0.3)",
            }}
          >
            🔥 Popular
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 4,
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          📍 <span itemProp="touristType">{tour.location}</span>
        </div>
      </div>

      <div
        style={{
          padding: "18px 20px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              background: "#ecfdf5",
              color: "#065f46",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 6,
              fontFamily: "Plus Jakarta Sans, sans-serif",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
            itemProp="duration"
          >
            ⏱️ {tour.duration}
          </span>
          <span
            style={{
              background: "#f1f5f9",
              color: "#475569",
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            {tour.type || tour.region || "Group Trip"}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 14,
            lineHeight: 1.35,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
          itemProp="name"
        >
          {tour.title}
        </h3>

        <div className="tour-card-footer" style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content="INR" />
            <meta itemProp="price" content={tour.price} />
            {tour.oldPrice && (
              <div style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through", fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: 1 }}>
                ₹{tour.oldPrice}
              </div>
            )}
            <div style={{ fontSize: 18, fontWeight: 800, color: "#064e3b", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}>
              ₹{Number(tour.price).toLocaleString("en-IN")}{" "}
              <span style={{ fontSize: 10, fontWeight: 500, color: "#64748b", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0 }}>
                / person
              </span>
            </div>
          </div>
          <Link
            href={`/packages/${tour.slug}`}
            style={{
              background: "linear-gradient(135deg, #064e3b 0%, #043f30 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "9px 16px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "none",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              boxShadow: "0 2px 8px rgba(6, 78, 59, 0.2)",
              transition: "transform 0.15s ease, background 0.15s ease",
            }}
            aria-label={`View ${tour.title} details`}
          >
            View Trip →
          </Link>
        </div>
      </div>
    </article>
  );
}

