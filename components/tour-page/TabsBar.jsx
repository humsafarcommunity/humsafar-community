import { useEffect, useRef, useState } from "react";

// Sticky section tabs. Highlights the tab for the section in view and scrolls to it on tap.
export default function TabsBar({ tabs }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const rowRef = useRef(null);
  const ids = tabs.map((t) => t.id).join("|");

  useEffect(() => {
    const list = ids.split("|").filter(Boolean);
    const onScroll = () => {
      let cur = list[0];
      list.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 170) cur = id;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = list[list.length - 1];
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  useEffect(() => {
    const row = rowRef.current;
    const btn = row && row.querySelector(`[data-tab="${active}"]`);
    if (row && btn) row.scrollTo({ left: btn.offsetLeft - 24, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="tp-tabs" aria-label="Trip sections">
      <div className="tp-tabs-row" ref={rowRef}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            data-tab={t.id}
            className="tp-tab"
            aria-current={active === t.id ? "true" : "false"}
            onClick={() => {
              const el = document.getElementById(t.id);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              setActive(t.id);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
