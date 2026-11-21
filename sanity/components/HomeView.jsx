import React from 'react';

// Colourful welcome dashboard. Pure display: the Studio wrapper (HomeTool) supplies the data and links,
// so this file can also be previewed outside the Studio.
const CARDS = [
  { key: 'tours', label: 'Tour packages', emoji: '🏔️', path: '/admin/structure/tour', bg: 'linear-gradient(135deg,#fff1e6,#ffd2ad)', ink: '#9a3f08' },
  { key: 'blogs', label: 'Blog posts', emoji: '✍️', path: '/admin/structure/blog', bg: 'linear-gradient(135deg,#e7f8ef,#bdeed4)', ink: '#05603f' },
  { key: 'newLeads', label: 'New enquiries', emoji: '📞', path: '/admin/structure/lead', bg: 'linear-gradient(135deg,#e3f2ff,#b6dcff)', ink: '#0b4f8a', highlight: true },
  { key: 'reviews', label: 'Reviews', emoji: '⭐', path: '/admin/structure/review', bg: 'linear-gradient(135deg,#fff8dc,#ffe79a)', ink: '#7a5a00' },
  { key: 'videos', label: 'Videos', emoji: '🎬', path: '/admin/structure/video', bg: 'linear-gradient(135deg,#f6e8ff,#ddbcff)', ink: '#5b1f93' },
  { key: 'destinations', label: 'Destination cards', emoji: '📍', path: '/admin/structure/destination', bg: 'linear-gradient(135deg,#ffe8ee,#ffc0d0)', ink: '#92183f' },
];

const QUICK = [
  { type: 'tour', label: 'New trip', emoji: '🏔️', color: '#E8681E' },
  { type: 'blog', label: 'New blog post', emoji: '✍️', color: '#0f7a55' },
  { type: 'review', label: 'Add review', emoji: '⭐', color: '#d99a00' },
  { type: 'video', label: 'Add video', emoji: '🎬', color: '#7c3aed' },
];

const TIPS = [
  { emoji: '📸', text: 'Destination card photos look best tall (portrait), about 800 × 1200, with a calm top so the name is easy to read.' },
  { emoji: '🗺️', text: 'Add 3 to 8 real stops under Attractions on each tour. They show as a photo carousel on the tour page.' },
  { emoji: '💬', text: 'Only add reviews that are real. Use Show first to pin your best one.' },
];

export default function HomeView({ stats, name, onGo, renderCreate }) {
  const n = (k) => (stats && typeof stats[k] === 'number' ? stats[k] : '…');
  const newLeads = stats && stats.newLeads;
  const cardStyle = (c) => ({
    display: 'block', textDecoration: 'none', padding: '18px 18px 16px', borderRadius: 18, background: c.bg, color: c.ink,
    boxShadow: '0 6px 18px rgba(16,35,27,.08)', border: '1px solid rgba(255,255,255,.7)', transition: 'transform .15s',
  });

  return (
    <div style={{ height: '100%', overflow: 'auto', background: '#f6f8f5', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '22px 18px 48px' }}>
        {/* welcome banner */}
        <div style={{ borderRadius: 24, padding: '28px 26px', color: '#fff', background: 'linear-gradient(120deg,#064e3b 0%,#0f7a55 55%,#E8681E 120%)', boxShadow: '0 14px 34px rgba(6,78,59,.25)' }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#c5ee6f' }}>Humsafar Community CMS</div>
          <h1 style={{ margin: '8px 0 6px', fontSize: 30, lineHeight: 1.15, fontWeight: 800, color: '#fff' }}>Welcome back{name ? `, ${name.split(' ')[0]}` : ''} 👋</h1>
          <p style={{ margin: 0, maxWidth: 560, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,.9)' }}>
            Everything on your website lives here. Pick a section below, or add something new in one tap.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
            <a href="https://humsafarcommunity.com" target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: '#064e3b', fontWeight: 800, fontSize: 14, padding: '11px 18px', borderRadius: 999, textDecoration: 'none' }}>🌐 View live website</a>
            {renderCreate('tour', '✨ Add a new trip', { background: '#E8681E', color: '#fff', fontWeight: 800, fontSize: 14, padding: '11px 18px', borderRadius: 999, textDecoration: 'none' })}
          </div>
        </div>

        {/* new enquiries alert */}
        {typeof newLeads === 'number' && newLeads > 0 && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a href="/admin/structure/lead" onClick={(e) => onGo(e, '/admin/structure/lead')} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, padding: '14px 18px', borderRadius: 16, background: '#fff7d6', border: '1px solid #f5d96b', color: '#6b4e00', textDecoration: 'none', fontWeight: 700 }}>
            <span style={{ fontSize: 24 }}>🔔</span>
            <span style={{ flex: 1 }}>{newLeads} new {newLeads === 1 ? 'enquiry is' : 'enquiries are'} waiting for a reply. Call them while they are interested.</span>
            <span style={{ background: '#E8681E', color: '#fff', padding: '7px 14px', borderRadius: 999, fontSize: 13 }}>Open leads →</span>
          </a>
        )}

        {/* sections */}
        <h2 style={{ margin: '28px 0 12px', fontSize: 18, fontWeight: 800, color: '#10231b' }}>Your website sections</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
          {CARDS.map((c) => (
            <a key={c.key} href={c.path} onClick={(e) => onGo(e, c.path)} style={cardStyle(c)}>
              <div style={{ fontSize: 30 }}>{c.emoji}</div>
              <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1, marginTop: 6 }}>{n(c.key)}</div>
              <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>{c.label}</div>
            </a>
          ))}
        </div>

        {/* quick add */}
        <h2 style={{ margin: '28px 0 12px', fontSize: 18, fontWeight: 800, color: '#10231b' }}>Quick add</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
          {QUICK.map((q) =>
            renderCreate(q.type, `${q.emoji}  ${q.label}`, { display: 'block', textAlign: 'center', padding: '16px 12px', borderRadius: 16, background: q.color, color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 20px rgba(16,35,27,.15)' }, q.type)
          )}
        </div>

        {/* site settings shortcuts */}
        <h2 style={{ margin: '28px 0 12px', fontSize: 18, fontWeight: 800, color: '#10231b' }}>Look &amp; settings</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            ['🎨 Global Branding', '/admin/structure/siteSettings'],
            ['🔍 SEO & Metadata', '/admin/structure/seoSettings'],
            ['👥 About Us page', '/admin/structure/aboutPage'],
            ['🖼️ Hero banners', '/admin/structure/banner'],
          ].map(([label, path]) => (
            <a key={path} href={path} onClick={(e) => onGo(e, path)} style={{ padding: '10px 16px', borderRadius: 999, background: '#fff', border: '1.5px solid #cfe3d8', color: '#064e3b', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>{label}</a>
          ))}
        </div>

        {/* tips */}
        <h2 style={{ margin: '28px 0 12px', fontSize: 18, fontWeight: 800, color: '#10231b' }}>Handy tips</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
          {TIPS.map((t) => (
            <div key={t.emoji} style={{ display: 'flex', gap: 12, padding: 16, borderRadius: 16, background: '#fff', border: '1px solid #e5ece7' }}>
              <span style={{ fontSize: 26 }}>{t.emoji}</span>
              <span style={{ fontSize: 13.5, lineHeight: 1.5, color: '#3b4a42' }}>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
