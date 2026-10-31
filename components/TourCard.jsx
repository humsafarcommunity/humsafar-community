import Link from 'next/link';
import Image from 'next/image';

const ORANGE = "#E8681E";
const CREAM = "#FFEBDA";
const FONT = "'Plus Jakarta Sans', sans-serif";

/* ---------- tiny inline icons (stroke = currentColor) ---------- */
function Icon({ name, size = 16 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    style: { flexShrink: 0 },
  };
  switch (name) {
    case "clock":
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
    case "calendar":
      return (<svg {...common}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>);
    case "group":
      return (<svg {...common}><circle cx="9" cy="8.5" r="3" /><circle cx="17" cy="9.5" r="2.4" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M15.5 14.8c3 0 5.5 1.7 5.5 4.7" /></svg>);
    case "bus":
      return (<svg {...common}><rect x="4" y="3.5" width="16" height="14" rx="3" /><path d="M4 11h16M4 8h16" /><circle cx="8.5" cy="14.5" r=".6" fill="currentColor" /><circle cx="15.5" cy="14.5" r=".6" fill="currentColor" /><path d="M7 17.5V20M17 17.5V20" /></svg>);
    case "book":
      return (<svg {...common}><path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5v13" /></svg>);
    case "bed":
      return (<svg {...common}><path d="M3 18V6M3 14h18v4M21 14v-2.5a2.5 2.5 0 0 0-2.5-2.5H11v5" /><circle cx="7" cy="11" r="1.8" /></svg>);
    case "meal":
      return (<svg {...common}><path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.2 1.2-3.5 3.6-3.5 7v3H17" /></svg>);
    case "chat":
      return (<svg {...common}><path d="M20 12a7.5 7.5 0 0 1-10.9 6.7L4 20l1.3-4.6A7.5 7.5 0 1 1 20 12z" /></svg>);
    case "mountain":
      return (<svg {...common}><path d="M3 19l6.5-11 4 6.5 2.5-4L21 19H3z" /></svg>);
    default:
      return null;
  }
}

/* Build up to 4 "what you get" items from the tour's own data, so nothing
   is shown that the package doesn't actually include. */
function buildFeatures(tour) {
  const inc = (tour.inclusions || []).filter(Boolean).join(" | ").toLowerCase();
  const feats = [];
  if (/transport|tempo|traveller|traveler|bus|cab|volvo|innova|sedan|suv|pick.?up|drop/.test(inc)) feats.push({ icon: "bus", label: "Includes Transport" });
  if ((tour.itinerary || []).length > 0) feats.push({ icon: "book", label: "Curated Itinerary" });
  if (/stay|hotel|accommodation|homestay|home stay|camp|resort|hostel/.test(inc)) feats.push({ icon: "bed", label: "Stays Included" });
  if (/meal|breakfast|dinner|lunch/.test(inc)) feats.push({ icon: "meal", label: "Meals Included" });
  if (feats.length < 4 && (tour.type || "group") === "group") feats.push({ icon: "chat", label: "Group Experiences" });
  if (feats.length < 4 && tour.altitude) feats.push({ icon: "mountain", label: `Up to ${tour.altitude}` });
  return feats.slice(0, 4);
}

function buildBlurb(tour) {
  const raw =
    tour.directAnswer ||
    tour.seoDesc ||
    (tour.highlights || []).filter((h) => h && !/\[(book now|call us|whatsapp us)\]|ready to book/i.test(h)).slice(0, 2).join(". ");
  return (raw || "").replace(/\s+/g, " ").trim();
}

export default function TourCard({ tour }) {
  if (!tour) return null;

  const departure = tour.departureDay
    ? tour.departureDay === "both"
      ? "Leaves Fri & Sat"
      : tour.departureDay === "friday"
      ? "Leaves Friday"
      : "Leaves Saturday"
    : null;
  const secondChip = departure
    ? { icon: "calendar", label: departure }
    : { icon: "group", label: tour.type ? `${tour.type.charAt(0).toUpperCase()}${tour.type.slice(1)} Trip` : "Group Trip" };

  const feats = buildFeatures(tour);
  const blurb = buildBlurb(tour);
  const href = `/packages/${tour.slug}`;
  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "#fff6ee",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: FONT,
    textShadow: "0 1px 3px rgba(0,0,0,0.45)",
  };

  return (
    <article
      style={{
        position: "relative",
        borderRadius: 26,
        overflow: "hidden",
        background: ORANGE,
        boxShadow: "0 10px 28px rgba(60, 30, 10, 0.16)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, box-shadow",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 22px 44px rgba(232, 104, 30, 0.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(60, 30, 10, 0.16)";
      }}
      itemScope
      itemType="https://schema.org/TouristTrip"
    >
      {/* ---------- photo hero with chips + title ---------- */}
      <Link href={href} aria-label={`${tour.title} — view details`} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
        <div style={{ position: "relative", paddingTop: "84%", overflow: "hidden" }}>
          <Image
            src={tour.img || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"}
            alt={`${tour.title} — ${tour.location}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            itemProp="image"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(26,18,10,0.72) 0%, rgba(26,18,10,0.38) 38%, rgba(26,18,10,0.08) 70%, rgba(26,18,10,0.12) 100%)",
            }}
          />

          {tour.bestseller && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: ORANGE,
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: 999,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                fontFamily: FONT,
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              }}
            >
              🔥 Popular
            </div>
          )}

          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: tour.bestseller ? 46 : 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 18px" }}>
              <span style={chipStyle} itemProp="duration">
                <span style={{ color: ORANGE, display: "inline-flex" }}><Icon name="clock" size={15} /></span>
                {tour.duration}
              </span>
              <span style={chipStyle}>
                <span style={{ color: ORANGE, display: "inline-flex" }}><Icon name={secondChip.icon} size={15} /></span>
                {secondChip.label}
              </span>
            </div>
            <h3
              style={{
                fontFamily: "var(--sans)",
                fontSize: "clamp(19px, 5.4vw, 24px)",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.25,
                margin: 0,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
              itemProp="name"
            >
              {tour.title}
            </h3>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 34,
              left: 16,
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 4,
              textShadow: "0 1px 3px rgba(0,0,0,0.6)",
            }}
          >
            📍 <span itemProp="touristType">{tour.location}</span>
          </div>
        </div>
      </Link>

      {/* ---------- orange info panel (overlaps the photo) ---------- */}
      <div
        style={{
          position: "relative",
          marginTop: -26,
          background: ORANGE,
          borderRadius: "26px 26px 0 0",
          padding: "22px 20px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          color: CREAM,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
        }}
      >
        {feats.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              margin: "0 0 14px",
              padding: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px 10px",
            }}
          >
            {feats.map((f) => (
              <li
                key={f.label}
                style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, fontFamily: FONT, lineHeight: 1.2 }}
              >
                <Icon name={f.icon} size={18} />
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        )}

        {blurb && (
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 13,
              lineHeight: 1.55,
              fontFamily: FONT,
              color: "rgba(255, 235, 218, 0.92)",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {blurb}
          </p>
        )}

        <div
          className="tour-card-footer"
          style={{
            marginTop: "auto",
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.25)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content="INR" />
            <meta itemProp="price" content={tour.price} />
            {tour.oldPrice && (
              <div style={{ fontSize: 11.5, color: "rgba(255,235,218,0.8)", textDecoration: "line-through", fontFamily: FONT, lineHeight: 1.1 }}>
                ₹{tour.oldPrice}
              </div>
            )}
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: FONT, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              ₹{Number(tour.price).toLocaleString("en-IN")}{" "}
              <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,235,218,0.85)", letterSpacing: 0 }}>/ person</span>
            </div>
          </div>
          <Link
            href={href}
            style={{
              background: "#fff",
              color: "#7A3A12",
              border: "none",
              borderRadius: 999,
              padding: "11px 20px",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              textDecoration: "none",
              fontFamily: FONT,
              boxShadow: "0 4px 14px rgba(0,0,0,0.18), 0 0 0 4px rgba(255,255,255,0.18)",
              whiteSpace: "nowrap",
              transition: "transform 0.15s ease",
            }}
            aria-label={`View ${tour.title} details`}
          >
            View &amp; Book →
          </Link>
        </div>
      </div>
    </article>
  );
}
