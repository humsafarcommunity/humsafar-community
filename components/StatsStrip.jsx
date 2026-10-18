// A single row of proof points shown under the hero: Instagram followers, Google rating, travellers.
// Shows only the numbers entered in the CMS (Global Branding → Traveler Statistics). Nothing is made up.
const INSTAGRAM = "https://www.instagram.com/humsafar.community/";

export default function StatsStrip({ site = {} }) {
  const items = [];

  if (site.instagramFollowers) {
    items.push({
      key: "ig",
      href: site.socials?.instagram || INSTAGRAM,
      icon: (
        <span style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(45deg,#f9a03f,#e1306c 55%,#833ab4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="#fff" />
          </svg>
        </span>
      ),
      value: site.instagramFollowers,
      label: "Instagram Community",
    });
  }

  if (site.ratingValue) {
    items.push({
      key: "g",
      href: site.googleReviewsUrl,
      icon: (
        <span style={{ width: 44, height: 44, borderRadius: 999, background: "#fff", border: "2px solid #fbbf24", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontSize: 22 }} aria-hidden="true">★</span>
      ),
      value: `${site.ratingValue}★`,
      label: "Google Reviews",
    });
  }

  if (site.totalTravelers) {
    items.push({
      key: "t",
      icon: (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      value: site.totalTravelers,
      label: "Travellers",
    });
  }

  if (!items.length) return null;

  return (
    <section aria-label="Humsafar Community in numbers" style={{ background: "#f0fdf4", padding: "28px 24px" }}>
      <ul className="stats-list" style={{ listStyle: "none", maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "18px 24px" }}>
        {items.map((it) => {
          const body = (
            <>
              {it.icon}
              <span style={{ fontSize: "clamp(16px, 2.1vw, 20px)", color: "#0f172a", lineHeight: 1.2 }}>
                <strong style={{ fontWeight: 800 }}>{it.value}</strong> {it.label}
              </span>
            </>
          );
          const style = { display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: "inherit" };
          return (
            <li key={it.key} className="stats-item">
              {it.href ? <a href={it.href} target="_blank" rel="noopener noreferrer" style={style}>{body}</a> : <div style={style}>{body}</div>}
            </li>
          );
        })}
      </ul>
      <style jsx global>{`
        .stats-item { display: flex; justify-content: center; }
        @media (max-width: 640px) { .stats-item { justify-content: flex-start; } }
      `}</style>
    </section>
  );
}
