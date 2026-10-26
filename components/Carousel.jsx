import { useRef, useState, useEffect, useCallback } from "react";
import useAutoplay, { advanceTrack, PauseButton } from "../lib/useAutoplay";

// Horizontal scroll-snap track with round prev/next buttons. Used by Attractions and Reviews.
export default function Carousel({ title, subtitle, children, action, label, autoplay = 0 }) {
  const ref = useRef(null);
  const auto = useAutoplay({ enabled: autoplay > 0, interval: autoplay || 4000, tick: () => advanceTrack(ref.current) });
  const [can, setCan] = useState({ prev: false, next: true });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCan({ prev: el.scrollLeft > 4, next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [update]);

  const go = (dir) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.85, 260), behavior: reduce ? "auto" : "smooth" });
  };

  const arrow = (dir, enabled, text) => (
    <button
      type="button"
      onClick={() => go(dir)}
      disabled={!enabled}
      aria-label={text}
      className="hc-btn" style={{ width: 44, height: 44, borderRadius: 999, border: 0, background: enabled ? "#111827" : "#cbd5e1", color: "#fff", cursor: enabled ? "pointer" : "default", display: "grid", placeItems: "center", flexShrink: 0 }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );

  return (
    <section ref={auto.wrapRef} {...auto.handlers} aria-label={label || title} aria-roledescription="carousel" style={{ minWidth: 0, maxWidth: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div style={{ minWidth: 0 }}>
          <h2 className="hc-h" style={{ fontSize: "clamp(22px, 4.5vw, 40px)", color: "#0e1117", margin: 0, lineHeight: 1.1 }}>{title}</h2>
          {subtitle && <p className="hc-sub" style={{ margin: "8px 0 0", color: "#64748b", fontSize: 16 }}>{subtitle}</p>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {auto.canAuto && <PauseButton paused={auto.userPaused} onClick={auto.toggle} label={label || title} />}
          {arrow(-1, can.prev, "Previous")}
          {arrow(1, can.next, "Next")}
          {action}
        </div>
      </div>
      <div
        ref={ref}
        tabIndex={0}
        style={{ display: "flex", gap: 20, overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: 6, scrollbarWidth: "none", outlineOffset: 4 }}
        className="hc-track"
      >
        {children}
      </div>
      <style jsx global>{`.hc-track::-webkit-scrollbar{display:none}.hc-track>*{scroll-snap-align:start;flex-shrink:0}@media(max-width:700px){.hc-pause{width:36px!important;height:36px!important}.hc-track{gap:12px!important}.hc-sub{font-size:13px!important;margin-top:4px!important}.hc-btn{width:36px!important;height:36px!important}.hc-btn svg{width:14px;height:14px}}`}</style>
    </section>
  );
}
