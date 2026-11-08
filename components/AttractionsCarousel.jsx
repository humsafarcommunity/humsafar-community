import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/router";
import Carousel from "./Carousel";
import useSelectedStops from "../lib/selectedStops";
import { track } from "../lib/whatsapp";

// "Attractions: must-see stops on this itinerary." Filled from the tour's Attractions list in Studio.
// Tap a stop to open it. "Add to PDF" puts it in the downloadable itinerary (see lib/itineraryPdf.js).
const niceName = (s) => { const t = String(s || "").trim(); return t && t === t.toLowerCase() ? t.replace(/\b[a-z]/g, (c) => c.toUpperCase()) : t; };

const P = {
  plus: "M12 5v14M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6L6 18",
  left: "M15 5l-7 7 7 7",
  right: "M9 5l7 7-7 7",
  down: "M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14",
};
const Ic = ({ d, size = 18, sw = 2.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

export default function AttractionsCarousel({ attractions = [], tourSlug, title = "Attractions", subtitle = "Tap a stop to explore it, then add it to your itinerary PDF." }) {
  const router = useRouter();
  const slug = tourSlug || (router && router.query && router.query.slug) || "";
  const items = (attractions || []).filter((a) => a && a.name);
  const sel = useSelectedStops(slug, items.length);
  const [open, setOpen] = useState(null);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  useEffect(() => setMounted(true), []);

  const isOpen = open !== null && items[open];

  // Modal: lock page scroll, keyboard control, return focus to the card on close.
  useEffect(() => {
    if (!isOpen) return undefined;
    lastFocus.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current && closeRef.current.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") setOpen((i) => (i + 1) % items.length);
      else if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + items.length) % items.length);
      else if (e.key === "Tab") {
        const box = document.getElementById("as-dialog");
        const f = box && box.querySelectorAll("button, a[href]");
        if (!f || !f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
    };
  }, [isOpen, items.length]);

  if (!items.length) return null;

  const pdfHref = `/api/itinerary/${slug}${sel.list.length ? `?stops=${sel.list.join(",")}` : ""}`;
  const onDownload = () => track("download_itinerary", { event_label: slug, stops: sel.list.length });
  const toggle = (i) => { sel.toggle(i); track(sel.has(i) ? "remove_stop" : "add_stop", { event_label: `${slug}:${items[i].name}` }); };
  const canPick = Boolean(slug);
  const cur = isOpen ? items[open] : null;

  return (
    <>
      <Carousel title={title} subtitle={subtitle} autoplay={isOpen ? 0 : 4500} label={title}>
        {items.map((a, i) => {
          const on = sel.has(i);
          return (
            <div key={a.name + i} className={`as-card${on ? " on" : ""}`}>
              {a.image && <Image src={a.image} alt="" fill sizes="(max-width: 640px) 78vw, 290px" style={{ objectFit: "cover" }} className="as-img" />}
              <span aria-hidden="true" className="as-shade" />
              <button type="button" className="as-open" onClick={() => setOpen(i)} aria-haspopup="dialog" aria-label={`Open ${niceName(a.name)}`} />
              {canPick && (
                <button type="button" className={`as-add${on ? " on" : ""}`} onClick={() => toggle(i)} aria-pressed={on} aria-label={on ? `Remove ${niceName(a.name)} from PDF` : `Add ${niceName(a.name)} to PDF`}>
                  <Ic d={on ? P.check : P.plus} />
                </button>
              )}
              <div className="as-body">
                <strong>{niceName(a.name)}</strong>
                {a.description && <span className="as-desc">{a.description}</span>}
                <span className="as-cta">Explore stop <Ic d={P.right} size={14} sw={2.8} /></span>
              </div>
            </div>
          );
        })}
      </Carousel>

      {canPick && sel.list.length > 0 && (
        <div className="as-bar" role="status" aria-live="polite">
          <span className="as-count">{sel.list.length}</span>
          <span className="as-bar-txt">{sel.list.length === 1 ? "stop" : "stops"} added to your itinerary PDF</span>
          <button type="button" className="as-clear" onClick={sel.clear}>Clear</button>
          <a className="as-dl" href={pdfHref} download onClick={onDownload}><Ic d={P.down} size={17} />Download PDF</a>
        </div>
      )}

      {mounted && cur && createPortal(
        <div className="as-overlay" onClick={() => setOpen(null)}>
          <div id="as-dialog" className="as-sheet" role="dialog" aria-modal="true" aria-label={niceName(cur.name)} onClick={(e) => e.stopPropagation()}>
            <div className="as-pic">
              {cur.image && <Image src={cur.image} alt={niceName(cur.name)} fill sizes="(max-width: 720px) 100vw, 470px" style={{ objectFit: "cover" }} priority />}
              <span aria-hidden="true" className="as-picshade" />
              {items.length > 1 && (
                <div className="as-pager">
                  <button type="button" aria-label="Previous stop" onClick={() => setOpen((open - 1 + items.length) % items.length)}><Ic d={P.left} size={17} /></button>
                  <span>{open + 1} / {items.length}</span>
                  <button type="button" aria-label="Next stop" onClick={() => setOpen((open + 1) % items.length)}><Ic d={P.right} size={17} /></button>
                </div>
              )}
            </div>
            <div className="as-info">
              <button type="button" ref={closeRef} className="as-x" aria-label="Close" onClick={() => setOpen(null)}><Ic d={P.close} size={17} sw={2.4} /></button>
              <span className="as-chip">Must-see stop {open + 1}</span>
              <h3>{niceName(cur.name)}</h3>
              {cur.description && <p className="as-text">{cur.description}</p>}
              {canPick && (
                <div className="as-actions">
                  <button type="button" className={`as-primary${sel.has(open) ? " done" : ""}`} onClick={() => toggle(open)} aria-pressed={sel.has(open)}>
                    <Ic d={sel.has(open) ? P.check : P.plus} />{sel.has(open) ? "Added to your PDF" : "Add to itinerary PDF"}
                  </button>
                  {sel.list.length > 0 && <a className="as-link" href={pdfHref} download onClick={onDownload}>Download PDF ({sel.list.length})</a>}
                </div>
              )}
              <p className="as-hint">Stops you add appear with photos in your downloadable itinerary.</p>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style jsx>{`
        .as-card { position: relative; width: min(56vw, 290px); aspect-ratio: 4 / 5.6; border-radius: 22px; overflow: hidden; background: linear-gradient(160deg, #0D4C52 0%, #0a363b 60%, #C9963A 160%); box-shadow: 0 10px 30px rgba(15,23,42,.12); transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; }
        .as-card:hover { transform: translateY(-6px); box-shadow: 0 22px 40px -14px rgba(15,23,42,.45); }
        .as-card.on { box-shadow: 0 0 0 3px var(--tp-accent, #d9561a), 0 18px 36px -14px rgba(217,86,26,.5); }
        .as-card :global(.as-img) { transition: transform .8s cubic-bezier(.2,.8,.2,1); }
        .as-card:hover :global(.as-img) { transform: scale(1.07); }
        .as-shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.86) 0%, rgba(0,0,0,.38) 40%, rgba(0,0,0,0) 64%); pointer-events: none; }
        .as-open { position: absolute; inset: 0; z-index: 1; background: transparent; border: 0; cursor: pointer; border-radius: 22px; }
        .as-open:focus-visible { outline: 3px solid var(--tp-accent, #d9561a); outline-offset: -3px; }
        .as-add { position: absolute; top: 12px; right: 12px; z-index: 2; width: 42px; height: 42px; border-radius: 50%; border: 0; background: #fff; color: #0f172a; display: grid; place-items: center; cursor: pointer; box-shadow: 0 6px 16px rgba(0,0,0,.28); transition: transform .2s, background .2s, color .2s; }
        .as-add:hover { transform: scale(1.1); }
        .as-add.on { background: var(--tp-accent, #d9561a); color: #fff; }
        .as-add:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
        .as-body { position: absolute; left: 0; right: 0; bottom: 0; padding: clamp(12px, 3vw, 20px); color: #fff; pointer-events: none; }
        .as-body strong { display: block; font-size: clamp(16px, 4.6vw, 22px); line-height: 1.15; margin-bottom: 6px; }
        .as-desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: clamp(12px, 3.3vw, 14px); line-height: 1.4; color: rgba(255,255,255,.92); }
        .as-cta { display: inline-flex; align-items: center; gap: 4px; margin-top: 10px; font-size: 13px; font-weight: 800; color: #ffc9a3; opacity: 0; transform: translateY(6px); transition: all .3s; }
        .as-card:hover .as-cta, .as-card:focus-within .as-cta { opacity: 1; transform: none; }
        @media (hover: none) { .as-cta { opacity: 1; transform: none; } }

        .as-bar { display: flex; align-items: center; flex-wrap: wrap; gap: 10px 12px; margin-top: 16px; padding: 10px 10px 10px 14px; border-radius: 18px; background: #0f172a; color: #fff; animation: as-rise .35s cubic-bezier(.2,.8,.2,1); }
        .as-count { min-width: 28px; height: 28px; padding: 0 6px; border-radius: 999px; background: var(--tp-accent, #d9561a); display: grid; place-items: center; font-weight: 800; font-size: 14px; }
        .as-bar-txt { flex: 1 1 160px; font-size: 14px; color: #cbd5e1; }
        .as-clear { background: none; border: 0; color: #94a3b8; font-size: 13px; text-decoration: underline; cursor: pointer; padding: 8px 4px; min-height: 44px; }
        .as-dl { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 18px; border-radius: 999px; background: var(--tp-accent, #d9561a); color: #fff; font-weight: 800; font-size: 14px; text-decoration: none; white-space: nowrap; }
        .as-dl:hover { filter: brightness(1.08); }
        @media (max-width: 560px) { .as-dl { flex: 1 1 100%; } }
        @keyframes as-rise { from { opacity: 0; transform: translateY(10px); } }

        .as-overlay { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 20px; background: rgba(15,23,42,.62); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); animation: as-fade .25s ease; }
        @keyframes as-fade { from { opacity: 0; } }
        .as-sheet { width: min(940px, 100%); max-height: 90vh; display: grid; grid-template-columns: 1fr 1fr; background: #fff; border-radius: 28px; overflow: hidden; box-shadow: 0 40px 90px -20px rgba(0,0,0,.6); animation: as-pop .35s cubic-bezier(.2,.8,.2,1); }
        @keyframes as-pop { from { opacity: 0; transform: translateY(24px) scale(.97); } }
        .as-pic { position: relative; min-height: 460px; background: #0D4C52; }
        .as-picshade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,23,42,0) 60%, rgba(15,23,42,.6)); }
        .as-pager { position: absolute; left: 16px; bottom: 16px; z-index: 1; display: flex; align-items: center; gap: 10px; color: #fff; font-weight: 700; font-size: 13px; }
        .as-pager button { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,.45); background: rgba(255,255,255,.2); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: #fff; display: grid; place-items: center; cursor: pointer; }
        .as-pager button:hover { background: rgba(255,255,255,.36); }
        .as-info { position: relative; padding: 36px 34px 28px; overflow-y: auto; display: flex; flex-direction: column; }
        .as-x { position: absolute; top: 14px; right: 14px; width: 44px; height: 44px; border-radius: 50%; border: 0; background: #f1f5f9; color: #0f172a; display: grid; place-items: center; cursor: pointer; }
        .as-x:hover { background: #e2e8f0; }
        .as-chip { align-self: flex-start; padding: 6px 12px; border-radius: 999px; background: var(--tp-accent-soft, #fdf0e5); color: var(--tp-accent, #d9561a); font-size: 12px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
        .as-info h3 { margin: 14px 48px 12px 0; font-size: clamp(26px, 4vw, 32px); line-height: 1.1; font-weight: 800; color: #0f172a; letter-spacing: -.02em; }
        .as-text { margin: 0; color: #475569; font-size: 16px; line-height: 1.7; white-space: pre-line; }
        .as-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: auto; padding-top: 26px; }
        .as-primary { flex: 1 1 220px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 52px; border: 0; border-radius: 16px; padding: 0 20px; background: var(--tp-accent, #d9561a); color: #fff; font-size: 16px; font-weight: 800; cursor: pointer; box-shadow: 0 12px 24px -10px rgba(217,86,26,.7); transition: transform .2s; }
        .as-primary:hover { transform: translateY(-2px); }
        .as-primary.done { background: #ecfdf3; color: #067647; box-shadow: inset 0 0 0 2px #abefc6; }
        .as-link { color: var(--tp-accent, #d9561a); font-weight: 800; font-size: 14px; text-decoration: underline; padding: 12px 4px; }
        .as-hint { margin: 12px 0 0; font-size: 13px; color: #94a3b8; }

        @media (max-width: 720px) {
          .as-overlay { align-items: end; padding: 0; }
          .as-sheet { grid-template-columns: 1fr; border-radius: 26px 26px 0 0; max-height: 92vh; overflow-y: auto; animation: as-slide .35s cubic-bezier(.2,.8,.2,1); }
          @keyframes as-slide { from { transform: translateY(100%); } }
          .as-pic { min-height: 0; height: 250px; }
          .as-info { padding: 24px 22px 30px; overflow: visible; }
        }
        @media (prefers-reduced-motion: reduce) { .as-card, .as-card :global(.as-img), .as-cta, .as-overlay, .as-sheet, .as-bar { animation: none !important; transition: none !important; } }
      `}</style>
    </>
  );
}
