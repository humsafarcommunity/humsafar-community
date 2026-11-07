// Small inline icon set for the package page. Stroke icons that follow the text colour.
const PATHS = {
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  pin: <><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  bus: <><rect x="4" y="4" width="16" height="13" rx="3" /><path d="M4 11h16M8 21v-4M16 21v-4" /><circle cx="8.5" cy="14" r=".6" /><circle cx="15.5" cy="14" r=".6" /></>,
  hotel: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h.01M12 7h.01M15 7h.01M9 11h.01M12 11h.01M15 11h.01M10 21v-4h4v4" /></>,
  fork: <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1.5-3 4-3 7 0 2 1 3 3 3" />,
  mount: <path d="M3 19l6-11 3.5 6L15 11l6 8z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  chev: <path d="M6 9l6 6 6-6" />,
  left: <path d="M15 5l-7 7 7 7" />,
  right: <path d="M9 5l7 7-7 7" />,
  share: <><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  swipe: <path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4" />,
};

export default function Icon({ name, size, style }) {
  return (
    <svg className="tp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={size ? { width: size, height: size, ...style } : style}>
      {PATHS[name] || null}
    </svg>
  );
}

// Pick an icon for a highlight line from the words in it.
export function highlightIcon(text = "") {
  const t = String(text).toLowerCase();
  if (/volvo|bus|coach|tempo|traveller|transfer|cab|sedan|train|flight|pickup|drop/.test(t)) return "bus";
  if (/hotel|stay|resort|camp|homestay|room|night|accommodation/.test(t)) return "hotel";
  if (/meal|breakfast|dinner|lunch|food|bonfire|cafe|barbecue|bbq/.test(t)) return "fork";
  return "mount";
}
