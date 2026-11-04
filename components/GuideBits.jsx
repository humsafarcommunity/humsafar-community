// Small building blocks for the travel-guide (blog post) page.
import { useState } from "react";
import Image from "next/image";

const PATHS = {
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  pin: <><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  mountain: <path d="M3 19l6.5-11 4 6.5 2.5-4L21 19H3z" />,
  temple: <path d="M12 3l9 6H3l9-6zM5 9v10M19 9v10M9.5 19v-6h5v6M3 19h18" />,
  wind: <path d="M3 9h10a2.5 2.5 0 1 0-2.5-2.5M3 13h14a2.5 2.5 0 1 1-2.5 2.5M3 17h6" />,
  people: <><circle cx="9" cy="8.5" r="3" /><circle cx="17" cy="9.5" r="2.4" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M15.5 14.8c3 0 5.5 1.7 5.5 4.7" /></>,
  bus: <><rect x="4" y="3.5" width="16" height="14" rx="3" /><path d="M4 11h16M4 8h16M7 17.5V20M17 17.5V20" /><circle cx="8.5" cy="14.5" r=".7" fill="currentColor" /><circle cx="15.5" cy="14.5" r=".7" fill="currentColor" /></>,
  bed: <><path d="M3 18V6M3 14h18v4M21 14v-2.5a2.5 2.5 0 0 0-2.5-2.5H11v5" /><circle cx="7" cy="11" r="1.8" /></>,
  meal: <path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.2 1.2-3.5 3.6-3.5 7v3H17" />,
  shield: <><path d="M12 3l7.5 3v5.5c0 4.6-3.1 8-7.5 9.5-4.4-1.5-7.5-4.9-7.5-9.5V6L12 3z" /><path d="M8.7 12l2.3 2.3 4.3-4.6" /></>,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8-4.3-4.1 5.9-.9L12 3.5z" fill="currentColor" />,
  plane: <path d="M21 3L3 10.5l7 3 3 7L21 3zM10 13.5L21 3" />,
  chat: <path d="M20 12a7.5 7.5 0 0 1-10.9 6.7L4 20l1.3-4.6A7.5 7.5 0 1 1 20 12z" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  right: <path d="M9 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
};

export function GIcon({ name, size = 20, stroke = 1.7 }) {
  const body = PATHS[name] || PATHS.pin;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={{ flexShrink: 0 }}>
      {body}
    </svg>
  );
}

// Hand-drawn orange underline used under the script lines
export function Swoosh({ width = 150, color = "#ee6c1f" }) {
  return (
    <svg width={width} height="12" viewBox="0 0 150 12" fill="none" aria-hidden="true" focusable="false" style={{ display: "block" }}>
      <path d="M3 8c28-6 64-7.5 100-4.5 14 1.2 30 2.4 44 .5" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

// Pick a line icon from the words in a heading
export function iconFor(text = "") {
  const t = text.toLowerCase();
  if (/temple|monaster|gompa|fort|palace|church|mandir|heritage|museum/.test(t)) return "temple";
  if (/adventure|paraglid|trek|raft|ski|sport|hike|ride|biking/.test(t)) return "wind";
  if (/food|cafe|restaurant|eat|cuisine|dish/.test(t)) return "meal";
  if (/stay|hotel|accommodation|homestay|sleep/.test(t)) return "bed";
  if (/reach|transport|road|route|bus|flight|train|drive/.test(t)) return "bus";
  if (/best time|season|weather|month|when to/.test(t)) return "calendar";
  if (/culture|local|people|festival|community/.test(t)) return "people";
  if (/valley|mountain|lake|pass|peak|snow|waterfall|river|beas|view|nature|park/.test(t)) return "mountain";
  return "pin";
}

const initials = (n = "") => n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

// One traveller review at a time, with dots and a next arrow. Real reviews only (from Studio → Reviews).
export function Testimonials({ reviews = [] }) {
  const list = reviews.filter((r) => r && r.text).slice(0, 6);
  const [i, setI] = useState(0);
  if (!list.length) return null;
  const r = list[i % list.length];
  const stars = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
  const text = r.text.length > 170 ? r.text.slice(0, 170).replace(/\s+\S*$/, "") + "…" : r.text;
  return (
    <div>
      <article className="bg-quote">
        <span className="bg-quote__ph">
          {r.photo ? <Image src={r.photo} alt="" fill sizes="76px" style={{ objectFit: "cover" }} /> : initials(r.author)}
        </span>
        <div>
          <blockquote>&ldquo;{text}&rdquo;</blockquote>
          <cite>
            {r.author}
            <span className="bg-stars" role="img" aria-label={`${stars} out of 5 stars`}>{"★".repeat(stars)}</span>
          </cite>
        </div>
      </article>
      {list.length > 1 && (
        <div className="bg-dots">
          {list.slice(0, 3).map((_, d) => (
            <button key={d} type="button" className="dot" aria-label={`Show review ${d + 1}`} aria-current={d === i % list.length} onClick={() => setI(d)} />
          ))}
          <button type="button" className="bg-next" aria-label="Next review" onClick={() => setI((i + 1) % list.length)}>
            <GIcon name="right" size={15} stroke={2} />
          </button>
        </div>
      )}
    </div>
  );
}

// Native <details> keeps the answers readable without JavaScript.
export function Faq({ faqs = [] }) {
  if (!faqs.length) return null;
  return (
    <div className="bg-faq">
      {faqs.map((f, n) => (
        <details key={n}>
          <summary>
            <span>{f.q}</span>
            <GIcon name="chevron" size={18} stroke={2} />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
