import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { waLink, track } from "../lib/whatsapp";

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4C18.6 23.7 24 18.4 24 11.8c0-3.2-1.2-6.2-3.5-8.3zm-8.5 18.1c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 0 1-1.5-5.1C2.1 6.5 6.5 2.1 12 2.1c2.6 0 5.1 1 6.9 2.9a9.6 9.6 0 0 1 2.9 6.9c0 5.4-4.4 9.7-9.8 9.7z" fill="currentColor" />
    <path d="M17.5 14.3c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.42.25-.7.25-1.3.17-1.42-.08-.13-.27-.2-.57-.35z" fill="currentColor" />
  </svg>
);

// Thin orange reading bar at the top of the screen. Also reports how far people read (GA4 events),
// so you can see which articles keep readers and which lose them.
export function ReadProgress({ targetId = "guide", slug = "" }) {
  const [p, setP] = useState(0);
  const fired = useRef({});
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = document.getElementById(targetId);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = Math.max(r.height - window.innerHeight * 0.5, 1);
      const done = Math.min(Math.max(-r.top + window.innerHeight * 0.2, 0), total);
      const pct = Math.round((done / total) * 100);
      setP(pct);
      [25, 50, 75, 90].forEach((m) => {
        if (pct >= m && !fired.current[m]) {
          fired.current[m] = true;
          track("blog_read_depth", { event_label: slug, value: m });
        }
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(calc); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [targetId, slug]);
  return <div className="bg-progress" aria-hidden="true"><span style={{ width: `${p}%` }} /></div>;
}

// Compact "trip from this guide" card. variant "strip" sits right under the hero on phones;
// variant "card" is dropped inside the article.
export function TripCta({ trip, place, site, slug, variant = "card", fallbackHref = "/packages" }) {
  const price = trip && Number(trip.price) > 0 ? `From ₹${Number(trip.price).toLocaleString("en-IN")}` : "";
  const meta = [trip?.duration, price].filter(Boolean).join(" · ");
  const msg = trip
    ? `Hi Humsafar! I read your guide and I'm interested in: ${trip.title}${price ? ` (${price})` : ""}. Please share dates and details.`
    : `Hi Humsafar! I read your ${place || "travel"} guide. Please suggest a trip.`;
  const href = trip ? `/packages/${trip.slug}` : fallbackHref;
  const label = `${variant}_${slug}`;
  return (
    <aside className={`bg-tcta bg-tcta--${variant}`} aria-label="Trip from this guide">
      {trip?.img && variant === "card" && <div className="bg-tcta__img"><Image src={trip.img} alt="" fill sizes="84px" /></div>}
      <div className="bg-tcta__txt">
        <span className="bg-tcta__kicker">{trip ? "Planning this trip?" : `Planning ${place || "a trip"}?`}</span>
        <strong>{trip ? trip.title : `Browse ${place || "all"} group trips`}</strong>
        {meta && <span className="bg-tcta__meta">{meta}</span>}
      </div>
      <div className="bg-tcta__btns">
        <Link href={href} className="bg-tcta__view" onClick={() => track("view_book_click", { event_label: `blog_${label}` })}>{trip ? "View trip" : "View trips"}</Link>
        <a href={waLink(site, msg, `Blog: ${slug}`)} target="_blank" rel="noopener noreferrer" className="bg-tcta__wa" onClick={() => track("whatsapp_click", { event_label: `blog_${label}` })}>{WA_ICON} WhatsApp</a>
      </div>
    </aside>
  );
}

// Mid/late-article nudge for readers who still have questions.
export function AskCta({ place, site, slug }) {
  return (
    <div className="bg-ask" role="note">
      <strong className="bg-ask__t">{place ? `Questions about ${place}?` : "Have a question about this trip?"}</strong>
      <span className="bg-ask__s">Ask our team on WhatsApp. We will help you pick dates, budget and the right trip.</span>
      <div className="bg-ask__btns">
        <a href={waLink(site, `Hi Humsafar! I have a question about ${place || "a trip"} after reading your guide.`, `Blog: ${slug}`)} target="_blank" rel="noopener noreferrer" className="bg-ask__wa" onClick={() => track("whatsapp_click", { event_label: `blog_ask_${slug}` })}>{WA_ICON} Ask on WhatsApp</a>
        <button type="button" className="bg-ask__cb" onClick={() => { track("enquiry_open", { event_label: `blog_ask_${slug}` }); window.dispatchEvent(new Event("open-enquiry")); }}>Request a call back</button>
      </div>
    </div>
  );
}
