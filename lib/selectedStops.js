import { useCallback, useEffect, useState } from "react";

// Stops a visitor adds to their itinerary PDF. Remembered per trip in this browser, and shared
// between the Attractions carousel and the Download button through a small window event.
const EVENT = "humsafar:stops";
const key = (slug) => `humsafar:stops:${slug}`;

function read(slug) {
  try {
    const v = JSON.parse(window.localStorage.getItem(key(slug)) || "[]");
    return Array.isArray(v) ? v.filter((n) => Number.isInteger(n) && n >= 0) : [];
  } catch (e) {
    return [];
  }
}

function write(slug, list) {
  try {
    window.localStorage.setItem(key(slug), JSON.stringify(list));
  } catch (e) {
    /* private mode: the picks still work until the page is closed */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { slug, list } }));
}

// Picks are stored as positions in the tour's attractions list, e.g. [0, 2, 3].
export default function useSelectedStops(slug, max = 0) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!slug) return undefined;
    setList(read(slug));
    const onEvent = (e) => { if (e.detail && e.detail.slug === slug) setList(e.detail.list); };
    const onStorage = (e) => { if (e.key === key(slug)) setList(read(slug)); };
    window.addEventListener(EVENT, onEvent);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(EVENT, onEvent); window.removeEventListener("storage", onStorage); };
  }, [slug]);

  // Drop picks that no longer exist, e.g. a stop was removed in Studio.
  useEffect(() => {
    if (slug && max > 0 && list.some((n) => n >= max)) write(slug, list.filter((n) => n < max));
  }, [slug, max, list]);

  const toggle = useCallback((i) => {
    if (!slug) return;
    const cur = read(slug);
    write(slug, cur.includes(i) ? cur.filter((n) => n !== i) : [...cur, i].sort((a, b) => a - b));
  }, [slug]);

  const clear = useCallback(() => { if (slug) write(slug, []); }, [slug]);

  return { list, toggle, clear, has: (i) => list.includes(i) };
}
