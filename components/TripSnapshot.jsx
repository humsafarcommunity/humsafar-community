import useWeather from "../lib/useWeather";
import WeatherCard from "./WeatherCard";

// Weather look: "classic" (light, misty mountain), "dark" (night blue) or "compact" (one slim row)
const WEATHER_VARIANT = "classic";

const LEVELS = [
  { key: "easy", label: "Easy", color: "#16a34a", note: "Relaxed pace, suits most people" },
  { key: "moderate", label: "Moderate", color: "#d97706", note: "Some long drives or walking, basic fitness needed" },
  { key: "difficult", label: "Difficult", color: "#dc2626", note: "High altitude or tough terrain, good fitness needed" },
];

export default function TripSnapshot({ tour }) {
  const w = useWeather(tour);
  const level = LEVELS.find((l) => l.key === tour?.difficulty);
  const tiles = [];

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
  if (!w && !tiles.length) return null;

  return (
    <div role="region" aria-label="Trip snapshot" className="ts-wrap">
      {w && <WeatherCard w={w} variant={WEATHER_VARIANT} />}
      {tiles.length > 0 && <div className="ts">{tiles}</div>}
      <style jsx>{`
        .ts-wrap { min-width: 0; }
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
