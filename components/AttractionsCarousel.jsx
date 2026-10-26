import Image from "next/image";
import Carousel from "./Carousel";

// "Attractions: must-see stops on this itinerary." Filled from the tour's Attractions list in Studio.
export default function AttractionsCarousel({ attractions = [], title = "Attractions", subtitle = "Must-see stops on this itinerary." }) {
  const items = (attractions || []).filter((a) => a && a.name);
  if (!items.length) return null;
  return (
    <Carousel title={title} subtitle={subtitle} autoplay={4500}>
      {items.map((a, i) => (
        <figure key={a.name + i} style={{ position: "relative", margin: 0, width: "min(78vw, 290px)", aspectRatio: "4 / 5.6", borderRadius: 28, overflow: "hidden", background: "#0f172a", boxShadow: "0 10px 30px rgba(15,23,42,0.12)" }}>
          {a.image && <Image src={a.image} alt={a.name} fill sizes="(max-width: 640px) 78vw, 290px" style={{ objectFit: "cover" }} />}
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0) 62%)" }} />
          <figcaption style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 20, color: "#fff" }}>
            <strong style={{ display: "block", fontSize: 22, lineHeight: 1.15, marginBottom: 6 }}>{a.name}</strong>
            {a.description && (
              <span style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: 14, lineHeight: 1.45, color: "rgba(255,255,255,0.92)" }}>{a.description}</span>
            )}
          </figcaption>
        </figure>
      ))}
    </Carousel>
  );
}
