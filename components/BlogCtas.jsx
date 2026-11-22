import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { waLink, track } from "../lib/whatsapp";

import WhatsAppLogo from "./WhatsAppLogo";


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
      {trip?.img && variant === "card" && <div className="bg-tcta__img"><Image src={trip.img} alt={trip.title || "Humsafar trip"} fill sizes="84px" /></div>}
      <div className="bg-tcta__txt">
        <span className="bg-tcta__kicker">{trip ? "Planning this trip?" : `Planning ${place || "a trip"}?`}</span>
        <strong>{trip ? trip.title : `Browse ${place || "all"} group trips`}</strong>
        {meta && <span className="bg-tcta__meta">{meta}</span>}
      </div>
      <div className="bg-tcta__btns">
        <Link href={href} className="bg-tcta__view" onClick={() => track("view_book_click", { event_label: `blog_${label}` })}>{trip ? "View trip" : "View trips"}</Link>
        <a href={waLink(site, msg, `Blog: ${slug}`)} target="_blank" rel="noopener noreferrer" className="bg-tcta__wa" onClick={() => track("whatsapp_click", { event_label: `blog_${label}` })}><WhatsAppLogo size={25} /> WhatsApp</a>
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
        <a href={waLink(site, `Hi Humsafar! I have a question about ${place || "a trip"} after reading your guide.`, `Blog: ${slug}`)} target="_blank" rel="noopener noreferrer" className="bg-ask__wa" onClick={() => track("whatsapp_click", { event_label: `blog_ask_${slug}` })}><WhatsAppLogo size={25} /> Ask on WhatsApp</a>
        <button type="button" className="bg-ask__cb" onClick={() => { track("enquiry_open", { event_label: `blog_ask_${slug}` }); window.dispatchEvent(new Event("open-enquiry")); }}>Request a call back</button>
      </div>
    </div>
  );
}
