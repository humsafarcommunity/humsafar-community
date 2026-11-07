import { useId, useState } from "react";
import Icon from "./Icon";

// Day-by-day cards. Closed days stay in the page HTML, so search engines still read them.
// items: [{ badge, title, subtitle?, points: string[] }]
export default function DayList({ items }) {
  const uid = useId();
  const [open, setOpen] = useState(() => new Set([0]));
  if (!items.length) return null;
  const allOpen = open.size === items.length;
  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <>
      <div className="tp-sec-head">
        <h2>Day-by-Day Itinerary</h2>
        {items.length > 1 && (
          <button type="button" className="tp-link" onClick={() => setOpen(allOpen ? new Set() : new Set(items.map((_, i) => i)))}>
            {allOpen ? "Collapse All" : "Expand All"}
          </button>
        )}
      </div>
      <div className="tp-days">
        {items.map((d, i) => {
          const isOpen = open.has(i);
          const panel = `${uid}-day-${i}`;
          return (
            <div key={i} className={`tp-day${isOpen ? " open" : ""}`}>
              <button type="button" className="tp-day-btn" aria-expanded={isOpen} aria-controls={panel} onClick={() => toggle(i)}>
                <span className="tp-dbadge">{d.badge}</span>
                <span className="tp-dtext">
                  <h3>{d.title}</h3>
                  {d.subtitle && <p>{d.subtitle}</p>}
                </span>
                <span className="tp-chev"><Icon name="chev" size={20} /></span>
              </button>
              <div className="tp-day-body" id={panel} role="region">
                <div className="tp-day-inner">
                  <ul className="tp-day-content">
                    {d.points.map((p, k) => <li key={k}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
