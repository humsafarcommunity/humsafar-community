import { useEffect, useRef, useState, useCallback } from "react";

// Shared auto-rotate logic for the carousels. It stays still when:
//  - the visitor prefers reduced motion, or pressed the pause button
//  - the mouse is over it, a control inside has focus, or they just touched/swiped it (resumes after a few seconds)
//  - it is scrolled out of view or the browser tab is hidden
// `tick()` is called every `interval` ms while running.
export default function useAutoplay({ enabled = true, interval = 4000, tick }) {
  const wrapRef = useRef(null);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [touched, setTouched] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(true); // assume reduced until we know, so nothing moves on first paint
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on));
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return undefined; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const touchTimer = useRef(null);
  useEffect(() => () => clearTimeout(touchTimer.current), []);

  const running = enabled && !reduced && !userPaused && !hover && !focus && !touched && inView;

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      if (document.hidden) return;
      tickRef.current && tickRef.current();
    }, interval);
    return () => clearInterval(id);
  }, [running, interval]);

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setFocus(true),
    onBlur: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); },
    onTouchStart: () => {
      setTouched(true);
      clearTimeout(touchTimer.current);
      touchTimer.current = setTimeout(() => setTouched(false), 8000);
    },
  };

  const toggle = useCallback(() => setUserPaused((p) => !p), []);
  return { wrapRef, handlers, userPaused, toggle, canAuto: enabled && !reduced };
}

// Move a horizontal scroll track forward by one card, wrapping back to the start at the end.
export function advanceTrack(el) {
  if (!el) return;
  if (el.scrollWidth - el.clientWidth < 120) return; // everything already fits: nothing to rotate
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 6;
  if (atEnd) { el.scrollTo({ left: 0, behavior: "smooth" }); return; }
  const first = el.firstElementChild;
  const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 20;
  const step = first ? first.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
  el.scrollBy({ left: step, behavior: "smooth" });
}

export function PauseButton({ paused, onClick, label = "carousel", style }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={paused ? `Play ${label} rotation` : `Pause ${label} rotation`}
      aria-pressed={paused}
      className="hc-pause" style={{ width: 44, height: 44, borderRadius: 999, border: "1.5px solid #cbd5e1", background: "#fff", color: "#0f172a", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0, ...style }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {paused ? <path d="M7 4.5v15l13-7.5z" /> : <path d="M6 4h4v16H6zM14 4h4v16h-4z" />}
      </svg>
    </button>
  );
}
