import React from 'react';

// Top-left logo in the Studio bar: white Humsafar logo + a small orange "CMS" tag.
export default function StudioLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 6px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/humsafar-logo-white.png" alt="Humsafar Community" style={{ height: 30, width: 'auto', display: 'block' }} />
      <span style={{ background: '#E8681E', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '.08em', padding: '3px 8px', borderRadius: 999 }}>
        CMS
      </span>
    </div>
  );
}
