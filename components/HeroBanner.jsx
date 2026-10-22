import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { figure } from "../lib/figure";

// Homepage hero: big headline with a destination word that changes by itself, a pill search bar and a
// row of numbers. The words, tagline and photos are editable in Studio (Site Settings → Hero, and Banners).
const DEFAULT_WORDS = ["Spiti", "Ladakh", "Manali", "Jibhi", "Rajasthan", "Udaipur", "Jaisalmer"];
const LIME = "#bef264";
const SHOW_MS = 3200;

function Icon({ name }) {
  const common = { width: 38, height: 38, viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (name === "people") return (<svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
  if (name === "star") return (<svg {...common}><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" /></svg>);
  if (name === "pin") return (<svg {...common}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>);
  if (name === "bag") return (<svg {...common}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></svg>);
  return (<svg {...common}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="#fff" /></svg>);
}

export default function HeroBanner({ banners = [], site = {}, destinationCount = 0 }) {
  const router = useRouter();
  const words = useMemo(() => (site.heroWords?.length ? site.heroWords : DEFAULT_WORDS), [site.heroWords]);
  const [i, setI] = useState(0);
  const [maxSeen, setMaxSeen] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [term, setTerm] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    try { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    if (paused || reduced) return undefined;
    const t = setInterval(() => setI((p) => p + 1), SHOW_MS);
    return () => clearInterval(t);
  }, [paused, reduced]);

  useEffect(() => { setMaxSeen((m) => Math.max(m, banners.length ? i % banners.length : 0)); }, [i, banners.length]);

  useEffect(() => {
    const stop = () => setSearching(false);
    router.events.on("routeChangeComplete", stop);
    router.events.on("routeChangeError", stop);
    return () => { router.events.off("routeChangeComplete", stop); router.events.off("routeChangeError", stop); };
  }, [router.events]);

  const word = words[i % words.length];
  const slide = banners.length ? i % banners.length : -1;
  const tagline = (site.heroTagline || "Pack | Join | Explore | Repeat").split("|").map((s) => s.trim()).filter(Boolean);
  const subline = site.heroSubline || "Group trips with a trip captain, from Delhi & Gwalior";

  const years = /^\d{4}$/.test(String(site.founded || "").trim()) ? new Date().getFullYear() - Number(site.founded) : 0;
  const stats = [
    figure(site.totalTravelers) && { icon: "people", value: figure(site.totalTravelers), label: "Happy Travellers" },
    figure(site.reviewCount) && { icon: "star", value: figure(site.reviewCount), label: "Reviews" },
    figure(site.ratingValue, true) && { icon: "star", value: `${figure(site.ratingValue, true)}★`, label: "Google Rating" },
    destinationCount >= 5 && { icon: "pin", value: `${destinationCount}+`, label: "Destinations" },
    years >= 2 && { icon: "bag", value: `${years}+ Years`, label: "Experience" },
    figure(site.instagramFollowers) && { icon: "ig", value: figure(site.instagramFollowers), label: "Instagram Community" },
  ].filter(Boolean).slice(0, 4);

  function onSearch(e) {
    e.preventDefault();
    if (!term.trim()) return;
    setSearching(true);
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  }

  return (
    <section aria-label="Find your next group trip" className="hb">
      <div className="hb-bg" aria-hidden="true">
        {banners.map((b, idx) => (
          <div key={b?.id || idx} className="hb-slide" style={{ opacity: idx === slide ? 1 : 0 }} data-active={idx === slide}>
            {(idx === 0 || idx <= maxSeen) && (
              <Image
                src={b.url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"}
                alt=""
                fill
                priority={idx === 0}
                fetchPriority={idx === 0 ? "high" : "auto"}
                quality={70}
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
        ))}
        <div className="hb-shade" />
      </div>

      <div className="hb-inner">
        <div className="hb-copy">
          <h1 className="hb-h1">
            <span className="hb-sr">Book your group trip to {words.join(", ")} and more with Humsafar Community</span>
            <span aria-hidden="true" className="hb-line">
              Book Your
              {slide >= 0 && banners[slide]?.url && maxSeen >= 0 && (
                <span className="hb-pill" key={`pill-${slide}`}>
                  <Image src={banners[slide].url} alt="" width={220} height={84} quality={55} sizes="220px" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </span>
              )}
            </span>
            <span aria-hidden="true" className="hb-line">
              Trip to{" "}
              <span className="hb-word" key={word}>
                {word}
                <svg className="hb-wave" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 8 Q 14 1 26 8 T 50 8 T 74 8 T 98 8 T 122 8 T 146 8 T 170 8 T 198 8" fill="none" stroke={LIME} strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </h1>

          <p className="hb-tag">
            {tagline.map((t, n) => (
              <span key={t + n}>
                <span style={{ color: n % 2 === 0 ? LIME : "#fff" }}>{t}</span>
                {n < tagline.length - 1 && <span className="hb-bar"> | </span>}
              </span>
            ))}
          </p>
          <p className="hb-sub">{subline}</p>

          <div className="hb-searchwrap">
            <form onSubmit={onSearch} role="search" aria-label="Search destinations" className="hb-search">
              <label htmlFor="hero-search" className="hb-sr">Search travel destinations</label>
              <input id="hero-search" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Type location…" autoComplete="off" />
              <button type="submit" disabled={searching}>{searching ? "Searching…" : "Search"}</button>
            </form>
            <svg className="hb-arrow" width="150" height="110" viewBox="0 0 150 110" fill="none" aria-hidden="true">
              <path d="M138 10 C 96 2 70 30 92 46 C 108 58 118 30 98 24 C 70 16 40 52 22 92" stroke={LIME} strokeWidth="3" strokeLinecap="round" />
              <path d="M10 70 L 22 94 L 46 84" stroke={LIME} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {stats.length > 0 && (
          <ul className="hb-stats" aria-label="Humsafar Community in numbers">
            {stats.map((s) => (
              <li key={s.label}>
                <Icon name={s.icon} />
                <span>
                  <strong>{s.value}</strong>
                  <em>{s.label}</em>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!reduced && (
        <button type="button" className="hb-pause" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play hero animation" : "Pause hero animation"}>
          {paused ? "▶" : "❚❚"}
        </button>
      )}

      <style jsx global>{`
        .hb { position: relative; min-height: min(94vh, 840px); display: flex; overflow: hidden; background: #022c22; border-radius: 0 0 32px 32px; color: #fff; }
        .hb-bg, .hb-slide { position: absolute; inset: 0; }
        .hb-slide { transition: opacity 1.2s ease; }
        .hb-slide[data-active="true"] { animation: hbZoom 9s ease-out forwards; }
        .hb-shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.15) 100%), linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 40%); }
        .hb-inner { position: relative; z-index: 2; width: 100%; max-width: 1240px; margin: 0 auto; padding: 120px 28px 64px; display: flex; flex-direction: column; justify-content: space-between; gap: 48px; box-sizing: border-box; }
        .hb-copy { margin: auto 0; }
        .hb-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .hb-h1 { color: #fff; margin: 0 0 22px; font-family: var(--sans); font-weight: 800; font-size: clamp(40px, 8.2vw, 92px); line-height: 1.12; letter-spacing: -0.02em; text-shadow: 0 4px 24px rgba(0,0,0,0.45); }
        .hb-line { display: flex; align-items: center; flex-wrap: wrap; gap: 0.22em; }
        .hb-pill { display: inline-block; width: 2.3em; height: 0.88em; border-radius: 999px; overflow: hidden; border: 3px solid rgba(255,255,255,0.85); box-shadow: 0 8px 24px rgba(0,0,0,0.4); animation: hbFade 0.6s ease both; }
        .hb-word { position: relative; display: inline-block; color: ${LIME}; animation: hbIn 0.65s cubic-bezier(.2,.8,.2,1) both; }
        .hb-wave { position: absolute; left: 0; bottom: -0.16em; width: 100%; height: 0.2em; overflow: visible; }
        .hb-wave path { stroke-dasharray: 260; stroke-dashoffset: 260; animation: hbDraw 0.9s 0.25s ease forwards; }
        .hb-tag { font-size: clamp(18px, 2.4vw, 26px); font-weight: 600; margin: 0 0 8px; }
        .hb-bar { color: rgba(255,255,255,0.75); }
        .hb-sub { font-size: clamp(15px, 1.7vw, 19px); margin: 0 0 28px; color: rgba(255,255,255,0.92); max-width: 560px; }
        .hb-searchwrap { position: relative; max-width: 520px; }
        .hb-search { display: flex; align-items: center; gap: 8px; background: #fff; border-radius: 999px; padding: 7px 7px 7px 26px; box-shadow: 0 20px 50px rgba(0,0,0,0.35); }
        .hb-search input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font-size: 17px; font-family: var(--sans); color: #0f172a; padding: 12px 0; }
        .hb-search input::placeholder { color: #64748b; }
        .hb-search button { flex-shrink: 0; border: none; cursor: pointer; background: #047857; color: #fff; font-weight: 800; font-size: 16px; font-family: var(--sans); border-radius: 999px; padding: 0 30px; min-height: 52px; }
        .hb-search button:hover { background: #064e3b; }
        .hb-search:focus-within { box-shadow: 0 0 0 4px rgba(190,242,100,0.6), 0 20px 50px rgba(0,0,0,0.35); }
        .hb-arrow { position: absolute; left: calc(100% + 12px); top: -18px; transform: rotate(-8deg); opacity: 0.95; }
        .hb-stats { list-style: none; margin: 0; padding: 22px 0 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border-top: 1px solid rgba(255,255,255,0.18); }
        .hb-stats li { display: flex; align-items: center; gap: 16px; padding: 4px 24px; }
        .hb-stats li + li { border-left: 1px solid rgba(255,255,255,0.22); }
        .hb-stats li:first-child { padding-left: 0; }
        .hb-stats strong { display: block; font-size: clamp(22px, 2.6vw, 34px); font-weight: 800; line-height: 1.1; }
        .hb-stats em { display: block; font-style: normal; font-size: 15px; color: rgba(255,255,255,0.88); margin-top: 2px; }
        .hb-pause { position: absolute; z-index: 3; right: 18px; top: 92px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.5); background: rgba(0,0,0,0.35); color: #fff; font-size: 11px; cursor: pointer; }
        .hb-pause:focus-visible, .hb-search button:focus-visible { outline: 3px solid ${LIME}; outline-offset: 2px; }
        @keyframes hbIn { from { opacity: 0; transform: translateY(0.4em); filter: blur(8px); } to { opacity: 1; transform: none; filter: none; } }
        @keyframes hbFade { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: none; } }
        @keyframes hbDraw { to { stroke-dashoffset: 0; } }
        @keyframes hbZoom { from { transform: scale(1); } to { transform: scale(1.08); } }
        @media (max-width: 1100px) { .hb-arrow { display: none; } }
        @media (max-width: 760px) {
          .hb { min-height: 92svh; }
          .hb-inner { padding: 96px 20px 36px; gap: 32px; }
          .hb-stats { grid-template-columns: 1fr 1fr; gap: 18px 0; }
          .hb-stats li { padding: 0 8px 0 0; }
          .hb-stats li + li { border-left: none; }
          .hb-stats li:nth-child(even) { border-left: 1px solid rgba(255,255,255,0.22); padding-left: 16px; }
          .hb-stats li svg { width: 30px; height: 30px; }
          .hb-search { padding-left: 20px; }
          .hb-search button { padding: 0 22px; }
          .hb-pause { top: 78px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hb-slide[data-active="true"], .hb-word, .hb-pill, .hb-wave path { animation: none; }
          .hb-wave path { stroke-dashoffset: 0; }
          .hb-slide { transition: none; }
        }
      `}</style>
    </section>
  );
}
