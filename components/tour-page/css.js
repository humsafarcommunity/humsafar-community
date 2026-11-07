// Styles for the package detail page (pages/packages/[slug].jsx).
// To change the accent colour of the whole page, edit --tp-accent and its soft/line variants below.
// The fixed site navbar is 81px tall, so the sticky tab bar sits at top: 81px.
export const TOUR_PAGE_CSS = `
.tp {
  --tp-accent: #d9561a;
  --tp-accent-ink: #ffffff;
  --tp-accent-soft: #fdf0e5;
  --tp-accent-line: #f6d9bf;
  --tp-ink: #0f172a;
  --tp-muted: #64748b;
  --tp-line: #e2e8f0;
  --tp-surface: #f8fafc;
  --tp-ok: #15803d;
  --tp-ok-bg: #e8f7ee;
  --tp-gold-bg: #fff7dc;
  --tp-gold-line: #f1dea0;
  font-family: "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  color: var(--tp-ink);
}
.tp *, .tp *::before, .tp *::after { box-sizing: border-box; }
.tp :where(button) { font: inherit; color: inherit; cursor: pointer; border: 0; background: none; }
.tp button:focus-visible, .tp a:focus-visible, .tp .tp-slides:focus-visible { outline: 2px solid var(--tp-accent); outline-offset: 2px; }
.tp-icon { width: 1.1em; height: 1.1em; flex: none; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.tp h1, .tp h2, .tp h3 { margin: 0; }
.tp-num { font-variant-numeric: tabular-nums; }

/* hero */
.tp-hero { max-width: 1100px; margin: 0 auto; padding: 16px 24px 0; }
.tp-hero-frame { position: relative; border-radius: 18px; overflow: hidden; background: #0d1018; box-shadow: 0 15px 40px rgba(15, 23, 42, 0.1); }
.tp-slides { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; aspect-ratio: 16 / 8; max-height: 540px; }
.tp-slides::-webkit-scrollbar { display: none; }
.tp-slide { position: relative; flex: 0 0 100%; scroll-snap-align: center; }
.tp-hero-frame::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(8,10,18,.5) 0%, rgba(8,10,18,0) 30%, rgba(8,10,18,0) 62%, rgba(8,10,18,.6) 100%); }
.tp-hero-top { position: absolute; z-index: 3; left: 16px; right: 16px; top: 14px; display: flex; justify-content: space-between; }
.tp-round { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; background: rgba(255,255,255,.94); color: #0f172a; box-shadow: 0 2px 8px rgba(0,0,0,.25); text-decoration: none; }
.tp-hero-badges { position: absolute; z-index: 3; left: 16px; right: 70px; top: 62px; display: flex; flex-wrap: wrap; gap: 8px; }
.tp-badge { height: 30px; padding: 0 14px; border-radius: 99px; display: inline-flex; align-items: center; font-weight: 800; font-size: 12px; letter-spacing: .06em; color: #fff; }
.tp-badge-hot { background: var(--tp-accent); }
.tp-badge-dark { background: rgba(15,23,42,.8); border: 1px solid rgba(255,255,255,.18); }
.tp-count { position: absolute; z-index: 3; right: 16px; bottom: 74px; height: 28px; padding: 0 12px; border-radius: 99px; background: rgba(15,23,42,.8); color: #fff; font-weight: 700; font-size: 13px; display: grid; place-items: center; font-variant-numeric: tabular-nums; }
.tp-arrow { position: absolute; z-index: 3; top: 50%; transform: translateY(-50%); width: 42px; height: 42px; border-radius: 50%; display: none; place-items: center; background: rgba(255,255,255,.92); color: #0f172a; box-shadow: 0 2px 10px rgba(0,0,0,.25); }
.tp-arrow:disabled { opacity: .35; cursor: default; }
.tp-arrow-l { left: 14px; }
.tp-arrow-r { right: 14px; }
.tp-hero-bottom { position: absolute; z-index: 3; left: 16px; right: 16px; bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
.tp-swipe { display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 14px; border-radius: 99px; background: rgba(15,23,42,.8); border: 1px solid rgba(255,255,255,.16); color: #ffc29a; font-weight: 700; font-size: 13px; transition: opacity .3s; }
.tp-swipe.gone { opacity: 0; }
.tp-dots { display: flex; align-items: center; gap: 6px; }
.tp-dots button { width: 10px; height: 10px; min-height: 0; padding: 0; border-radius: 99px; background: rgba(255,255,255,.55); transition: width .2s, background .2s; }
.tp-dots button[aria-current="true"] { width: 30px; background: var(--tp-accent); }
@media (min-width: 769px) {
  .tp-arrow { display: grid; }
  .tp-count { bottom: 24px; }
  .tp-hero-bottom { bottom: 28px; justify-content: center; }
  .tp-swipe { display: none; }
}

/* summary */
.tp-summary-wrap { background: #fff; position: relative; z-index: 4; }
.tp-summary { max-width: 1100px; margin: 0 auto; padding: 22px 24px 20px; }
.tp-pills { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.tp-pill { display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 14px; border-radius: 12px; font-weight: 700; font-size: 14px; }
.tp-pill-dur { background: var(--tp-accent-soft); border: 1px solid var(--tp-accent-line); color: var(--tp-accent); }
.tp-pill-rate { background: var(--tp-gold-bg); border: 1px solid var(--tp-gold-line); }
.tp-pill-rate .tp-icon { fill: #f5a623; stroke: #f5a623; }
.tp-pill-rate span { color: var(--tp-muted); font-weight: 500; }
.tp-title { margin: 14px 0 8px !important; font-size: clamp(24px, 4vw, 36px); line-height: 1.18; font-weight: 800; letter-spacing: -.02em; text-wrap: balance; }
.tp-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; color: var(--tp-muted); font-size: 14px; }
.tp-meta .pin { display: inline-flex; align-items: center; gap: 6px; }
.tp-meta .pin .tp-icon { color: var(--tp-accent); }
.tp-chip-ok { background: var(--tp-ok-bg); color: var(--tp-ok); font-weight: 700; border-radius: 8px; padding: 4px 10px; font-size: 13px; }

/* tabs */
.tp-tabs { position: sticky; top: 81px; z-index: 40; background: #fff; border-top: 1px solid var(--tp-line); border-bottom: 1px solid var(--tp-line); }
.tp-tabs-row { max-width: 1100px; margin: 0 auto; padding: 12px 24px; display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; }
.tp-tabs-row::-webkit-scrollbar { display: none; }
.tp-tab { flex: none; height: 40px; padding: 0 20px; border-radius: 99px; background: var(--tp-surface); font-weight: 700; font-size: 14px; }
.tp-tab[aria-current="true"] { background: var(--tp-accent); color: var(--tp-accent-ink); box-shadow: 0 4px 12px rgba(217, 86, 26, .3); }

/* sections */
.tp-main { background: var(--tp-surface); padding-bottom: 60px; }
.tp-grid { max-width: 1100px; margin: 0 auto; padding: 24px; display: grid; grid-template-columns: minmax(0, 2.5fr) minmax(0, 1fr); gap: 28px; }
.tp-col { min-width: 0; }
.tp-card { background: #fff; border: 1px solid var(--tp-line); border-radius: 20px; padding: clamp(18px, 3vw, 28px); margin-bottom: 20px; scroll-margin-top: 150px; }
.tp-sec-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 16px; }
.tp-sec-head h2, .tp-card > h2 { font-size: clamp(19px, 3vw, 22px); font-weight: 800; letter-spacing: -.01em; }
.tp-card > h2 { margin-bottom: 16px; }
.tp-link { color: var(--tp-accent) !important; font-weight: 700; font-size: 14px; }
.tp-hl-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; list-style: none; margin: 0; padding: 0; }
.tp-hl { display: flex; gap: 12px; align-items: center; padding: 14px; border-radius: 18px; background: var(--tp-accent-soft); border: 1px solid var(--tp-accent-line); min-width: 0; }
.tp-ico { width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center; background: var(--tp-accent); color: var(--tp-accent-ink); flex: none; }
.tp-ico .tp-icon { width: 22px; height: 22px; }
.tp-hl span.t { font-size: 14px; font-weight: 700; line-height: 1.35; overflow-wrap: anywhere; }

/* itinerary */
.tp-days { display: grid; gap: 12px; }
.tp-day { border: 1px solid var(--tp-line); background: var(--tp-surface); border-radius: 20px; overflow: hidden; }
.tp-day-btn { width: 100%; display: flex; align-items: center; gap: 14px; padding: 14px 14px 14px 12px; text-align: left; }
.tp-dbadge { flex: none; min-width: 48px; height: 48px; padding: 0 8px; border-radius: 14px; background: var(--tp-accent); color: var(--tp-accent-ink); display: grid; place-items: center; font-weight: 800; font-size: 15px; white-space: nowrap; box-shadow: 0 6px 14px rgba(217, 86, 26, .28); }
.tp-dtext { flex: 1; min-width: 0; }
.tp-dtext h3 { font-size: 16px; line-height: 1.3; font-weight: 800; }
.tp-dtext p { margin: 3px 0 0; font-size: 13px; color: var(--tp-muted); }
.tp-chev { flex: none; color: var(--tp-muted); transition: transform .25s; display: grid; }
.tp-day.open .tp-chev { transform: rotate(180deg); }
.tp-day-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .28s ease; visibility: hidden; }
.tp-day.open .tp-day-body { grid-template-rows: 1fr; visibility: visible; }
.tp-day-inner { overflow: hidden; min-height: 0; }
.tp-day-content { margin: 0; padding: 0 18px 18px 74px; list-style: none; display: grid; gap: 8px; font-size: 14px; color: #475569; line-height: 1.55; }
.tp-day-content li { position: relative; }
.tp-day-content li::before { content: ""; position: absolute; left: -16px; top: .6em; width: 6px; height: 6px; border-radius: 50%; background: var(--tp-accent); }

/* inclusions */
.tp-incl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-bottom: 20px; scroll-margin-top: 150px; }
.tp-incl .tp-card { margin-bottom: 0; height: 100%; }
.tp-incl h3 { font-size: 11px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 14px; }
.tp-incl ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.tp-incl li { display: flex; gap: 10px; font-size: 14px; color: #475569; line-height: 1.5; }
.tp-incl li .tp-icon { margin-top: 3px; }
.tp-yes h3, .tp-yes li .tp-icon { color: var(--tp-ok); }
.tp-no h3, .tp-no li .tp-icon { color: #dc2626; }

/* gallery */
.tp-gal { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.tp-gal-tile { position: relative; aspect-ratio: 4 / 3; border-radius: 14px; overflow: hidden; padding: 0; background: var(--tp-surface); }
.tp-gal-more { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(15,23,42,.6); color: #fff; font-weight: 800; font-size: 18px; }
.tp-lb { position: fixed; inset: 0; z-index: 2000; background: rgba(6,8,14,.92); display: grid; grid-template-rows: auto 1fr auto; gap: 8px; padding: 14px; }
.tp-lb-top { display: flex; justify-content: space-between; align-items: center; color: #fff; font-weight: 700; }
.tp-lb-img { display: grid; place-items: center; min-height: 0; }
.tp-lb-img img { max-width: 100%; max-height: 100%; border-radius: 12px; object-fit: contain; }
.tp-lb-nav { display: flex; gap: 12px; }
.tp-lb-nav button { flex: 1; height: 48px; border-radius: 14px; background: rgba(255,255,255,.14); color: #fff; font-weight: 700; }

/* booking panel (desktop sidebar, below the content on phones) */
.tp-aside { position: sticky; top: 160px; height: fit-content; min-width: 0; scroll-margin-top: 150px; }

/* mobile bottom bar */
.tp-bar { display: none; }
@media (max-width: 768px) {
  .tp-hero { padding: 0; }
  .tp-hero-frame { border-radius: 0; box-shadow: none; }
  .tp-slides { aspect-ratio: 4 / 3.3; max-height: none; }
  .tp-hero-badges { top: 62px; }
  .tp-summary-wrap { margin-top: -26px; border-radius: 26px 26px 0 0; }
  .tp-summary { padding: 20px 16px 18px; }
  .tp-tabs-row { padding: 12px 16px; }
  .tp-grid { display: block; padding: 16px; }
  .tp-card { border-radius: 18px; }
  .tp-aside { position: static; margin-top: 8px; }
  .tp-main { padding-bottom: 110px; }
  .tp-bar { display: flex; position: fixed; z-index: 50; left: 0; right: 0; bottom: 0; align-items: center; gap: 10px; padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px)); background: rgba(255,255,255,.98); backdrop-filter: blur(14px); border-top: 1px solid var(--tp-line); box-shadow: 0 -10px 30px rgba(15,23,42,.08); }
  .tp-bar-price { flex: 1; min-width: 0; }
  .tp-bar-now { font-size: 24px; font-weight: 800; letter-spacing: -.02em; line-height: 1.1; font-variant-numeric: tabular-nums; }
  .tp-bar-now s { margin-left: 6px; font-size: 13px; font-weight: 500; color: var(--tp-muted); letter-spacing: 0; }
  .tp-bar-sub { display: block; margin-top: 2px; color: var(--tp-accent); font-weight: 700; font-size: 12px; }
  .tp-bar-call { flex: none; width: 50px; height: 50px; border-radius: 15px; display: grid; place-items: center; background: #fff; color: var(--tp-accent); border: 2px solid var(--tp-accent); text-decoration: none; }
  .tp-bar-book { flex: none; height: 50px; padding: 0 20px; border-radius: 15px; display: inline-flex; align-items: center; gap: 8px; background: var(--tp-accent); color: var(--tp-accent-ink); font-weight: 800; font-size: 15px; text-decoration: none; box-shadow: 0 8px 18px rgba(217, 86, 26, .3); }
  .tp-gal { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tp-incl { grid-template-columns: 1fr; }
}
@media (max-width: 380px) {
  .tp-hl-grid { grid-template-columns: 1fr; }
  .tp-day-content { padding-left: 18px; }
  .tp-day-content li::before { left: -14px; }
}
@media (prefers-reduced-motion: reduce) {
  .tp * { transition: none !important; scroll-behavior: auto !important; }
}
`;
