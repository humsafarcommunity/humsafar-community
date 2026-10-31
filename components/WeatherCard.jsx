// Weather card with three looks. Pass variant="classic" | "dark" | "compact".
//   classic : light card, misty mountain on the left, big temperature, 3 day cards
//   dark    : same layout on a deep night-blue card
//   compact : one slim row, good when you want the weather to take little space
// Data comes from lib/useWeather.js (Open-Meteo) as { place, now, daily }.

const FONT = "'Plus Jakarta Sans', sans-serif";

// WMO weather code -> label + icon kind
export function describe(code) {
  if (code === 0) return ["Clear sky", "sun"];
  if (code <= 2) return ["Partly cloudy", "partly"];
  if (code === 3) return ["Cloudy", "cloud"];
  if (code === 45 || code === 48) return ["Foggy", "fog"];
  if (code >= 51 && code <= 57) return ["Drizzle", "rain"];
  if (code >= 61 && code <= 67) return ["Rain", "rain"];
  if (code >= 71 && code <= 77) return ["Snow", "snow"];
  if (code >= 80 && code <= 82) return ["Showers", "rain"];
  if (code === 85 || code === 86) return ["Snow showers", "snowshowers"];
  if (code >= 95) return ["Thunderstorm", "thunder"];
  return ["Weather", "cloud"];
}

/* gradients shared by every icon on the card (rendered once, referenced by id) */
function Defs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="wxc-cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9d6e8" />
        </linearGradient>
        <linearGradient id="wxc-cloud-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fb0c8" />
          <stop offset="1" stopColor="#5f7390" />
        </linearGradient>
        <linearGradient id="wxc-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="1" stopColor="#f6a41c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const CLOUD = "M20 48a11 11 0 0 1-1.5-21.9A15 15 0 0 1 47 25a11.5 11.5 0 0 1 .5 23H20z";

function Sun({ cx = 32, cy = 32, r = 11, rays = true }) {
  const a = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g>
      {rays &&
        a.map((d) => (
          <line
            key={d}
            x1={cx}
            y1={cy - r - 4}
            x2={cx}
            y2={cy - r - 8}
            stroke="#f6b73c"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${d} ${cx} ${cy})`}
          />
        ))}
      <circle cx={cx} cy={cy} r={r} fill="url(#wxc-sun)" />
    </g>
  );
}

function Cloud({ x = 0, y = 0, s = 1, dark = false }) {
  return (
    <path
      d={CLOUD}
      transform={`translate(${x} ${y}) scale(${s})`}
      fill={dark ? "url(#wxc-cloud-dark)" : "url(#wxc-cloud)"}
      stroke={dark ? "#4f627c" : "#b9c8dc"}
      strokeWidth="1"
    />
  );
}

export function WxIcon({ kind, size = 56 }) {
  let body;
  switch (kind) {
    case "sun":
      body = <Sun />;
      break;
    case "partly":
      body = (<><Sun cx={22} cy={20} r={9} /><Cloud x={4} y={8} s={0.9} /></>);
      break;
    case "fog":
      body = (
        <>
          <Cloud x={2} y={-8} s={0.95} />
          <g stroke="#9db0c8" strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="46" x2="48" y2="46" />
            <line x1="18" y1="53" x2="54" y2="53" />
            <line x1="22" y1="59" x2="42" y2="59" />
          </g>
        </>
      );
      break;
    case "rain":
      body = (
        <>
          <Cloud x={2} y={-8} s={0.95} dark />
          <g stroke="#4e8fe0" strokeWidth="3" strokeLinecap="round">
            <line x1="20" y1="46" x2="16" y2="55" />
            <line x1="32" y1="46" x2="28" y2="55" />
            <line x1="44" y1="46" x2="40" y2="55" />
          </g>
        </>
      );
      break;
    case "snow":
    case "snowshowers": {
      const flakes = [[20, 52], [33, 56], [46, 52]];
      body = (
        <>
          {kind === "snowshowers" && <Sun cx={46} cy={14} r={7} rays={false} />}
          <Cloud x={2} y={-8} s={0.95} />
          {flakes.map(([x, y]) => (
            <g key={x} stroke="#6fa8e8" strokeWidth="2" strokeLinecap="round">
              <line x1={x - 3.5} y1={y} x2={x + 3.5} y2={y} />
              <line x1={x} y1={y - 3.5} x2={x} y2={y + 3.5} />
              <line x1={x - 2.5} y1={y - 2.5} x2={x + 2.5} y2={y + 2.5} />
              <line x1={x - 2.5} y1={y + 2.5} x2={x + 2.5} y2={y - 2.5} />
            </g>
          ))}
        </>
      );
      break;
    }
    case "thunder":
      body = (
        <>
          <Cloud x={2} y={-8} s={0.95} dark />
          <polygon points="33,36 25,50 32,50 29,62 42,44 34,44 38,36" fill="#ffc83d" stroke="#e09a12" strokeWidth="1" strokeLinejoin="round" />
        </>
      );
      break;
    default:
      body = <Cloud x={0} y={0} s={1} />;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true" style={{ display: "block", flexShrink: 0, filter: "drop-shadow(0 3px 4px rgba(60,80,120,0.18))" }}>
      {body}
    </svg>
  );
}

function Pin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}
function WindIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9h10a2.5 2.5 0 1 0-2.5-2.5M3 13h14a2.5 2.5 0 1 1-2.5 2.5M3 17h6" />
    </svg>
  );
}
function DropIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3s6 6.2 6 10.5A6 6 0 0 1 6 13.5C6 9.2 12 3 12 3z" />
    </svg>
  );
}

/* misty mountain + pines, drawn in SVG so no photo file is needed */
function MountainArt() {
  const pines = [
    [28, 300, 1.15], [62, 310, 1.0], [96, 296, 1.3], [128, 312, 0.95], [160, 300, 1.1], [14, 270, 0.8], [190, 316, 0.8],
  ];
  return (
    <svg viewBox="0 0 360 300" preserveAspectRatio="xMinYMax slice" width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="wxc-m1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a9db8" /><stop offset="1" stopColor="#c7d3e3" />
        </linearGradient>
        <linearGradient id="wxc-m2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f627d" /><stop offset="1" stopColor="#9fb0c8" />
        </linearGradient>
        <filter id="wxc-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <polygon points="-20,200 70,120 120,150 170,95 250,170 300,140 380,210 380,320 -20,320" fill="url(#wxc-m1)" opacity="0.7" />
      <polygon points="40,215 150,70 215,150 250,125 330,215 330,320 40,320" fill="url(#wxc-m2)" />
      <polygon points="150,70 128,106 142,100 152,114 166,102 178,112 168,92" fill="#f4f8fd" opacity="0.95" />
      <polygon points="196,122 215,150 226,140 214,128" fill="#f4f8fd" opacity="0.7" />
      <g filter="url(#wxc-blur)" fill="#ffffff">
        <ellipse cx="90" cy="150" rx="110" ry="22" opacity="0.85" />
        <ellipse cx="240" cy="205" rx="130" ry="26" opacity="0.9" />
        <ellipse cx="60" cy="235" rx="120" ry="24" opacity="0.8" />
      </g>
      {pines.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <polygon points="0,-62 -17,-30 -8,-30 -22,-4 -10,-4 -26,26 26,26 10,-4 22,-4 8,-30 17,-30" fill="#2f4a46" />
          <polygon points="0,-62 -9,-44 0,-47 9,-44" fill="#e8f0f6" opacity="0.85" />
          <polygon points="-8,-30 0,-34 8,-30 -2,-26" fill="#e8f0f6" opacity="0.55" />
        </g>
      ))}
      <g filter="url(#wxc-blur)" fill="#ffffff">
        <ellipse cx="150" cy="292" rx="170" ry="20" opacity="0.7" />
      </g>
    </svg>
  );
}

const CSS = `
.wxc{container-type:inline-size;position:relative;overflow:hidden;border-radius:24px;padding:18px 22px 22px;margin-bottom:18px;font-family:${FONT};
  background:linear-gradient(135deg,#fcfdff 0%,#eef3fa 100%);border:1px solid #e3e9f2;box-shadow:0 10px 30px rgba(40,60,100,.08);color:#0f1b33}
.wxc-dark{background:linear-gradient(135deg,#0e1a2d 0%,#1c2f4d 100%);border-color:#263a5a;box-shadow:0 12px 32px rgba(5,12,25,.35);color:#eef3fb}
.wxc-head{position:relative;z-index:2;display:flex;align-items:center;gap:10px;font-size:15px;letter-spacing:.14em;text-transform:uppercase;font-weight:800}
.wxc-head b{font-weight:800}
.wxc-head span{font-weight:600;color:#6b7a93;letter-spacing:.16em;font-size:13px}
.wxc-dark .wxc-head span{color:#9fb0c8}
.wxc-art{position:absolute;left:0;top:50px;height:150px;width:75%;z-index:0;opacity:.3;
  -webkit-mask-image:linear-gradient(to right,#000 40%,transparent 100%),linear-gradient(to bottom,transparent 0,#000 38%);-webkit-mask-composite:source-in;
  mask-image:linear-gradient(to right,#000 40%,transparent 100%),linear-gradient(to bottom,transparent 0,#000 38%);mask-composite:intersect}
.wxc-dark .wxc-art{opacity:.3;filter:brightness(.55) saturate(.9)}
@container (min-width:640px){.wxc-dark .wxc-art{opacity:.55}}
.wxc-body{position:relative;z-index:1;margin-top:10px;display:grid;grid-template-columns:1fr;gap:18px}
.wxc-spacer{display:none}
.wxc-now{display:flex;flex-direction:column;gap:14px}
.wxc-cond{display:flex;align-items:flex-start;gap:18px}
.wxc-label{font-size:clamp(20px,6vw,26px);margin-bottom:2px;font-weight:600;color:#3b5078;line-height:1.1}
.wxc-dark .wxc-label{color:#b9c9e3}
.wxc-temp{font-size:clamp(46px,14vw,64px);font-weight:800;letter-spacing:-.04em;line-height:1;color:#101c36}
.wxc-dark .wxc-temp{color:#fff}
.wxc-feels{font-size:15px;color:#6b7a93;font-weight:500;margin-top:4px}
.wxc-dark .wxc-feels{color:#9fb0c8}
.wxc-stats{display:flex;align-items:center;gap:18px;color:#4c6b9b}
.wxc-dark .wxc-stats{color:#8fb2e6}
.wxc-stat{display:flex;align-items:center;gap:10px}
.wxc-stat small{display:block;font-size:12.5px;color:#8392ab;font-weight:500;line-height:1.1}
.wxc-stat strong{display:block;font-size:15px;color:#1f2d4a;font-weight:700;line-height:1.3}
.wxc-dark .wxc-stat small{color:#8fa2c0}.wxc-dark .wxc-stat strong{color:#eef3fb}
.wxc-sep{width:1px;align-self:stretch;background:#dbe3ef}
.wxc-dark .wxc-sep{background:rgba(255,255,255,.14)}
.wxc-vdiv{display:none}
.wxc-days{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.wxc-day{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;padding:12px 6px 12px;border-radius:18px;
  background:rgba(255,255,255,.9);border:1px solid #e3e9f2;min-width:0}
.wxc-dark .wxc-day{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.12)}
.wxc-dn{font-size:12.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.wxc-hl{font-size:18px;font-weight:800;color:#101c36;white-space:nowrap}
.wxc-hl i{font-style:normal;font-weight:500;color:#9aa6bb}
.wxc-dark .wxc-hl{color:#fff}.wxc-dark .wxc-hl i{color:#8fa2c0}
.wxc-dl{font-size:12px;color:#6b7a93;font-weight:500;line-height:1.2}
.wxc-dark .wxc-dl{color:#9fb0c8}

@container (min-width:640px){
  .wxc{padding:20px 26px 26px}
  .wxc-art{width:33%;height:auto;bottom:0;top:50px;opacity:.95}
  .wxc-body{grid-template-columns:17% minmax(0,1.05fr) 1px minmax(0,1.2fr);align-items:center;gap:22px;margin-top:6px}
  .wxc-spacer{display:block}
  .wxc-vdiv{display:block;align-self:stretch;background:#dbe3ef;margin:6px 0}
  .wxc-dark .wxc-vdiv{background:rgba(255,255,255,.14)}
  .wxc-day{padding:16px 8px 16px;gap:10px}
}

/* ---------- compact variant: one slim row ---------- */
.wxc-compact{padding:14px 18px}
.wxc-compact .wxc-head{font-size:12px}
.wxc-compact .wxc-head span{font-size:11px}
.wxc-compact .wxc-art{display:none}
.wxc-compact .wxc-body{display:flex;flex-wrap:wrap;align-items:center;gap:14px 24px;margin-top:8px}
.wxc-compact .wxc-spacer,.wxc-compact .wxc-vdiv{display:none}
.wxc-compact .wxc-now{flex-direction:row;align-items:center;gap:20px;flex-wrap:wrap}
.wxc-compact .wxc-temp{font-size:40px}
.wxc-compact .wxc-label{font-size:16px}
.wxc-compact .wxc-feels{font-size:12.5px;margin-top:2px}
.wxc-compact .wxc-days{display:flex;gap:8px;flex:1 1 100%}
.wxc-compact .wxc-day{flex:1;flex-direction:row;justify-content:center;padding:8px 10px;gap:8px;border-radius:14px}
.wxc-compact .wxc-dl{display:none}
.wxc-compact .wxc-dn{font-size:11px}
@container (max-width:520px){.wxc-compact .wxc-day{flex-direction:column;gap:3px;padding:8px 4px}.wxc-compact .wxc-feels{margin-top:0}}
.wxc-compact .wxc-hl{font-size:13px}
`;

export default function WeatherCard({ w, variant = "classic" }) {
  if (!w || !w.now || !w.daily) return null;
  const [label, kind] = describe(w.now.weather_code);
  const dark = variant === "dark";
  const compact = variant === "compact";
  const days = w.daily.time.slice(1, 4);
  const hum = w.now.relative_humidity_2m;
  const iconSize = compact ? 44 : 84;

  return (
    <section
      className={`wxc${dark ? " wxc-dark" : ""}${compact ? " wxc-compact" : ""}`}
      aria-label={`Weather now in ${w.place}`}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Defs />
      <div className="wxc-head">
        <Pin />
        <b>Weather now</b>
        <span>· {w.place}</span>
      </div>

      {!compact && <div className="wxc-art"><MountainArt /></div>}

      <div className="wxc-body">
        <div className="wxc-spacer" aria-hidden="true" />

        <div className="wxc-now">
          <div className="wxc-cond">
            <WxIcon kind={kind} size={iconSize} />
            <div>
              <div className="wxc-label">{label}</div>
              <div className="wxc-temp">{Math.round(w.now.temperature_2m)}°C</div>
              {!compact && <div className="wxc-feels">Feels like {Math.round(w.now.apparent_temperature)}°</div>}
            </div>
          </div>
          {compact && <div className="wxc-feels">Feels {Math.round(w.now.apparent_temperature)}°</div>}
          <div className="wxc-stats">
            <div className="wxc-stat">
              <WindIcon />
              <div><small>Wind</small><strong>{Math.round(w.now.wind_speed_10m)} km/h</strong></div>
            </div>
            {hum != null && (
              <>
                <div className="wxc-sep" />
                <div className="wxc-stat">
                  <DropIcon />
                  <div><small>Humidity</small><strong>{Math.round(hum)}%</strong></div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="wxc-vdiv" aria-hidden="true" />

        <div className="wxc-days">
          {days.map((d, i) => {
            const [dl, dk] = describe(w.daily.weather_code[i + 1]);
            return (
              <div className="wxc-day" key={d}>
                <div className="wxc-dn">{new Date(d).toLocaleDateString("en-IN", { weekday: "short" })}</div>
                <WxIcon kind={dk} size={compact ? 28 : 52} />
                <div className="wxc-hl">
                  {Math.round(w.daily.temperature_2m_max[i + 1])}°<i>/{Math.round(w.daily.temperature_2m_min[i + 1])}°</i>
                </div>
                <div className="wxc-dl">{dl}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
