import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "./Icon";

// Swipeable photo header with badges, a photo counter and dots.
// images: [{ src, alt }]
export default function HeroSlider({ images, title, bestseller, region, backHref = "/packages", onShare }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const [moved, setMoved] = useState(false);
  const n = images.length;

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setIdx(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    if (el.scrollLeft > 20) setMoved(true);
  };
  const go = (k) => {
    const el = ref.current;
    if (!el) return;
    const next = Math.min(n - 1, Math.max(0, k));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };
  const onKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); }
  };

  return (
    <div className="tp-hero">
      <div className="tp-hero-frame">
        <div className="tp-slides" ref={ref} onScroll={onScroll} onKeyDown={onKey} tabIndex={0} role="group" aria-roledescription="carousel" aria-label={`${title} photos`}>
          {images.map((im, i) => (
            <div className="tp-slide" key={im.src + i}>
              <Image src={im.src} alt={im.alt} fill sizes="(max-width: 768px) 100vw, 1100px" style={{ objectFit: "cover" }} priority={i === 0} />
            </div>
          ))}
        </div>

        <div className="tp-hero-top">
          <Link href={backHref} className="tp-round" aria-label="Back to all packages"><Icon name="left" size={18} /></Link>
          <button type="button" className="tp-round" onClick={onShare} aria-label="Share this trip"><Icon name="share" size={18} /></button>
        </div>

        <div className="tp-hero-badges">
          {bestseller && <span className="tp-badge tp-badge-hot">BEST SELLER</span>}
          {region && <span className="tp-badge tp-badge-dark">{String(region).toUpperCase()}</span>}
        </div>

        {n > 1 && (
          <>
            <div className="tp-count" aria-live="polite">{idx + 1}/{n}</div>
            <button type="button" className="tp-arrow tp-arrow-l" onClick={() => go(idx - 1)} aria-label="Previous photo" disabled={idx === 0}><Icon name="left" size={20} /></button>
            <button type="button" className="tp-arrow tp-arrow-r" onClick={() => go(idx + 1)} aria-label="Next photo" disabled={idx === n - 1}><Icon name="right" size={20} /></button>
            <div className="tp-hero-bottom">
              <span className={`tp-swipe${moved ? " gone" : ""}`}><Icon name="swipe" size={16} />Swipe to explore</span>
              <div className="tp-dots">
                {images.map((_, k) => (
                  <button key={k} type="button" onClick={() => go(k)} aria-label={`Photo ${k + 1}`} aria-current={k === idx ? "true" : "false"} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
