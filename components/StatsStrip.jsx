// A single row of proof points shown under the hero: Instagram followers, Google rating, travellers.
// Shows only the numbers entered in the CMS (Global Branding → Traveler Statistics). Nothing is made up.
const INSTAGRAM = "https://www.instagram.com/humsafar.community/";

import { figure } from "../lib/figure";

export default function StatsStrip({ site = {} }) {
  const items = [];
  const followers = figure(site.instagramFollowers);
  const rating = figure(site.ratingValue, true);
  const travellers = figure(site.totalTravelers);

  if (followers) {
    items.push({
      key: "ig",
      href: site.socials?.instagram || INSTAGRAM,
      icon: (
        <span style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(45deg,#f9a03f,#e1306c 55%,#833ab4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="#fff" />
          </svg>
        </span>
      ),
      value: followers,
      label: "Instagram Community",
    });
  }

  if (rating) {
    items.push({
      key: "g",
      href: site.googleReviewsUrl,
      icon: (
        <span style={{ width: 52, height: 52, borderRadius: 16, background: "#fffbeb", border: "1.5px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontSize: 22 }} aria-hidden="true">★</span>
      ),
      value: `${rating}★`,
      label: "Google Reviews",
    });
  }

  if (travellers) {
    items.push({
      key: "t",
      icon: (
        <span style={{ width: 52, height: 52, borderRadius: 16, background: "#ecfdf5", border: "1.5px solid #a7f3d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#064e3b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </span>
      ),
      value: travellers,
      label: "Travellers",
    });
  }

  if (!items.length) return null;

  return (
    <section aria-label="Humsafar Community in numbers" style={{ background: "#f0fdf4", padding: "32px 20px" }}>
      <ul className="stats-list" style={{ listStyle: "none", maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 16, padding: 0 }}>
        {items.map((it) => {
          const body = (
            <>
              {it.icon}
              <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <strong style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 800, color: "#064e3b", lineHeight: 1.1 }}>{it.value}</strong>
                <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>{it.label}</span>
              </span>
            </>
          );
          const style = { display: "flex", alignItems: "center", gap: 16, textDecoration: "none", color: "inherit", background: "#fff", border: "1px solid #d1fae5", borderRadius: 20, padding: "16px 20px", boxShadow: "0 6px 20px rgba(6,78,59,0.07)", width: "100%", boxSizing: "border-box" };
          return (
            <li key={it.key} className="stats-item">
              {it.href ? <a href={it.href} target="_blank" rel="noopener noreferrer" style={style}>{body}</a> : <div style={style}>{body}</div>}
            </li>
          );
        })}
      </ul>
      <style jsx global>{`
        .stats-item { display: flex; }
      `}</style>
    </section>
  );
}
