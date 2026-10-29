import { useEffect, useState } from "react";
import { guessPlace } from "../lib/weatherPlaces";

// WMO weather codes from Open-Meteo -> short label + emoji
function describe(code) {
  if (code === 0) return ["Clear sky", "☀️"];
  if (code <= 2) return ["Partly cloudy", "⛅"];
  if (code === 3) return ["Cloudy", "☁️"];
  if (code === 45 || code === 48) return ["Foggy", "🌫️"];
  if (code >= 51 && code <= 57) return ["Drizzle", "🌦️"];
  if (code >= 61 && code <= 67) return ["Rain", "🌧️"];
  if (code >= 71 && code <= 77) return ["Snow", "❄️"];
  if (code >= 80 && code <= 82) return ["Showers", "🌦️"];
  if (code === 85 || code === 86) return ["Snow showers", "🌨️"];
  if (code >= 95) return ["Thunderstorm", "⛈️"];
  return ["Weather", "🌡️"];
}

const LEVELS = [
  { key: "easy", label: "Easy", color: "#16a34a", note: "Relaxed pace, suits most people" },
  { key: "moderate", label: "Moderate", color: "#d97706", note: "Some long drives or walking, basic fitness needed" },
  { key: "difficult", label: "Difficult", color: "#dc2626", note: "High altitude or tough terrain, good fitness needed" },
];

function useWeather(tour) {
  const [w, setW] = useState(null);
  useEffect(() => {
    let off = false;
    const place = guessPlace(tour);
    if (!place) return undefined;
    const cacheKey = "hc-wx-" + place.name;
    try {
      const c = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
      if (c && Date.now() - c.t < 30 * 60 * 1000) { setW(c.v); return undefined; }
    } catch (e) { /* ignore */ }
    (async () => {
      try {
        let { lat, lon } = place;
        if (lat == null) {
          const g = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place.name)}&count=1&country_code=IN`)).json();
          const r = g.results && g.results[0];
          if (!r) return;
          lat = r.latitude; lon = r.longitude;
        }
        const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=4`;
        const j = await (await fetch(u)).json();
        if (!j.current || !j.daily) return;
        const v = { place: place.name, now: j.current, daily: j.daily };
        try { sessionStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), v })); } catch (e) { /* ignore */ }
        if (!off) setW(v);
      } catch (e) { /* weather is optional, stay hidden */ }
    })();
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour?.slug, tour?.weatherPlace, tour?.location]);
  return w;
}

export default function TripSnapshot({ tour }) {
  const w = useWeather(tour);
  const level = LEVELS.find((l) => l.key === tour?.difficulty);
  const tiles = [];

  if (w) {
    const [label, icon] = describe(w.now.weather_code);
    tiles.push(
      <div key="wx" className="ts-tile ts-wide">
        <div className="ts-k">Weather now · {w.place}</div>
        <div className="ts-row">
          <span className="ts-ico" aria-hidden="true">{icon}</span>
          <span className="ts-big">{Math.round(w.now.temperature_2m)}°C</span>
          <span className="ts-sm">{label}<br />Feels {Math.round(w.now.apparent_temperature)}° · Wind {Math.round(w.now.wind_speed_10m)} km/h</span>
        </div>
        <div className="ts-days">
          {w.daily.time.slice(1, 4).map((d, i) => (
            <span key={d} title={describe(w.daily.weather_code[i + 1])[0]}>
              {new Date(d).toLocaleDateString("en-IN", { weekday: "short" })} {describe(w.daily.weather_code[i + 1])[1]} {Math.round(w.daily.temperature_2m_max[i + 1])}°/{Math.round(w.daily.temperature_2m_min[i + 1])}°
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (level) {
    const idx = LEVELS.indexOf(level);
    tiles.push(
      <div key="lv" className="ts-tile">
        <div className="ts-k">Difficulty</div>
        <div className="ts-big" style={{ color: level.color }}>{level.label}</div>
        <div className="ts-meter" role="img" aria-label={`Difficulty: ${level.label}`}>
          {LEVELS.map((l, i) => <i key={l.key} style={{ background: i <= idx ? level.color : "#e2e8f0" }} />)}
        </div>
        <div className="ts-sm">{level.note}</div>
      </div>
    );
  }
  if (tour?.altitude) tiles.push(<div key="al" className="ts-tile"><div className="ts-k">Highest altitude</div><div className="ts-big">{tour.altitude}</div></div>);
  if (tour?.bestSeason) tiles.push(<div key="bs" className="ts-tile"><div className="ts-k">Best time to go</div><div className="ts-big">{tour.bestSeason}</div></div>);
  if (!tiles.length) return null;

  return (
    <div role="region" aria-label="Trip snapshot" className="ts">
      {tiles}
      <style jsx>{`
        .ts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr)); gap: 12px; margin-bottom: 20px; min-width: 0; }
        .ts :global(.ts-tile) { background: #fff; border: 1px solid #eef2f6; border-radius: 14px; padding: 14px 16px; min-width: 0; }
        .ts :global(.ts-wide) { grid-column: span 2; }
        .ts :global(.ts-k) { font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
        .ts :global(.ts-big) { font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.15; overflow-wrap: anywhere; }
        .ts :global(.ts-sm) { font-size: 12.5px; color: #64748b; line-height: 1.4; margin-top: 4px; }
        .ts :global(.ts-row) { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .ts :global(.ts-row .ts-sm) { margin-top: 0; }
        .ts :global(.ts-ico) { font-size: 30px; line-height: 1; }
        .ts :global(.ts-days) { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #e2e8f0; font-size: 12.5px; color: #475569; font-weight: 600; }
        .ts :global(.ts-meter) { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 8px; }
        .ts :global(.ts-meter i) { height: 6px; border-radius: 999px; display: block; }
        @media (max-width: 640px) {
          .ts { grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
          .ts :global(.ts-tile) { padding: 10px 12px; border-radius: 12px; }
          .ts :global(.ts-wide) { grid-column: 1 / -1; }
          .ts :global(.ts-big) { font-size: 18px; }
          .ts :global(.ts-ico) { font-size: 26px; }
        }
      `}</style>
    </div>
  );
}
