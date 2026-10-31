import { useEffect, useState } from "react";
import { guessPlace } from "./weatherPlaces";

// Live weather from Open-Meteo (free, no key). Returns null until loaded, and stays
// null if anything fails, so the weather block simply doesn't show.
export default function useWeather(tour) {
  const [w, setW] = useState(null);
  useEffect(() => {
    let off = false;
    const place = guessPlace(tour);
    if (!place) return undefined;
    const cacheKey = "hc-wx2-" + place.name;
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
        const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=4`;
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
