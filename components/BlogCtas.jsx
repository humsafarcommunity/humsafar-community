import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { waLink, track } from "../lib/whatsapp";

const WA_ICON = (
  <svg width="23" height="23" viewBox="0 0 64 64" aria-hidden="true" style={{ flexShrink: 0, display: "block" }}>
    <defs><linearGradient id="waGreenBlog" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#59F477" /><stop offset="100%" stopColor="#16B934" /></linearGradient></defs>
    <rect x="1" y="1" width="62" height="62" rx="15" fill="url(#waGreenMobile)" />
    <path d="M32 9.5c-12.1 0-21.9 9.6-21.9 21.5 0 4.2 1.2 8.1 3.4 11.4L10.8 54l12-3.1c2.8 1.4 5.9 2.1 9.2 2.1 12.1 0 21.9-9.6 21.9-21.5S44.1 9.5 32 9.5z" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinejoin="round" />
    <path d="M24.2 21.5c-.7-1.5-1.4-1.5-2-1.5h-1.7c-.6 0-1.5.2-2.3 1.1-.8.9-3 2.9-3 7.1s3.1 8.2 3.5 8.8c.4.6 6 9.5 14.7 12.9 7.3 2.9 8.8 2.3 10.4 2.1 1.6-.2 5.1-2.1 5.8-4.1.7-2 .7-3.7.5-4.1-.2-.4-.8-.6-1.7-1.1-.9-.4-5.1-2.5-5.9-2.8-.8-.3-1.4-.4-2 .5-.6.9-2.3 2.8-2.8 3.4-.5.6-1 .7-1.9.2-.9-.4-3.7-1.3-7-4.2-2.6-2.3-4.3-5.1-4.8-6-.5-.9 0-1.4.4-1.8.4-.4.9-1.1 1.3-1.6.4-.5.6-.9.9-1.5.3-.6.1-1.1-.1-1.6-.2-.4-1.9-4.6-2.7-6.2z" fill="#fff" transform="translate(3 0) scale(.88)" />
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
