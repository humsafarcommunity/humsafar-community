import { useEffect, useState } from "react";
import useAutoplay, { PauseButton } from "../lib/useAutoplay";

// "Videos" section: a 3D-style carousel of YouTube videos. The video in the middle plays when tapped
// (nothing is loaded from YouTube until then, so the page stays fast). Videos are added in Studio → Videos.
export default function VideoCarousel({ videos = [], eyebrow, title }) {
  const n = videos.length;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [touchX, setTouchX] = useState(null);

  const auto = useAutoplay({ enabled: n > 1 && !playing, interval: 5000, tick: () => setActive((a) => (a + 1) % Math.max(n, 1)) });
  useEffect(() => { setPlaying(false); }, [active]);
  if (n === 0) return null;

  const go = (step) => setActive((a) => (a + step + n) % n);
  const half = Math.floor(n / 2);
  const offsetOf = (idx) => {
    let d = (idx - active + n) % n;
    if (d > half) d -= n;
    return d;
  };
  const thumbOf = (v) => v.thumb || `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`;
  const current = videos[active];

  return (
    <section ref={auto.wrapRef} {...auto.handlers} aria-label="Videos" className="vc" style={{ background: "#fff", padding: "72px 0 64px" }}>
      <div style={{ textAlign: "center", padding: "0 20px", marginBottom: 36 }}>
        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: "#047857", fontFamily: "var(--sans)" }}>
          {eyebrow || "Videos"}
        </p>
        <h2 style={{ margin: 0, fontFamily: "var(--sans)", fontSize: "clamp(28px, 4.2vw, 42px)", fontWeight: 700, color: "#0e1117" }}>
          {title || "Travellers on the Move"}
        </h2>
      </div>

      <div
        className="vc-stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="Humsafar travel videos"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX === null) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          setTouchX(null);
        }}
      >
        {videos.map((v, idx) => {
          const d = offsetOf(idx);
          const ad = Math.abs(d);
          const isCenter = d === 0;
          return (
            <div
              key={v._id || v.youtubeId}
              className="vc-card"
              data-hidden={ad > 2 ? "true" : "false"}
              data-far={ad === 2 ? "true" : "false"}
              style={{ "--d": d, "--ad": ad, zIndex: 10 - ad }}
            >
              <div className="vc-frame">
                {isCenter && playing ? (
                  <iframe
                    className="vc-media"
                    src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title={v.title || "Humsafar travel video"}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    className="vc-media vc-thumb"
                    onClick={() => (isCenter ? setPlaying(true) : setActive(idx))}
                    aria-label={isCenter ? `Play video: ${v.title}` : `Show video: ${v.title}`}
                    tabIndex={ad > 1 ? -1 : 0}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbOf(v)} alt="" loading="lazy" decoding="async" />
                    {isCenter && (
                      <span className="vc-play" aria-hidden="true">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", padding: "0 20px", marginTop: 26 }}>
        <p style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 700, color: "#0f172a", fontFamily: "var(--sans)" }}>{current.title}</p>
        <a href={`https://www.youtube.com/watch?v=${current.youtubeId}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: "#047857" }}>
          Watch on YouTube
        </a>
      </div>

      {n > 1 && (
        <div className="vc-dots" role="group" aria-label="Choose a video">
          {videos.map((v, idx) => (
            <button key={v._id || v.youtubeId} type="button" onClick={() => setActive(idx)} aria-label={`Video ${idx + 1} of ${n}: ${v.title || "Humsafar travel video"}`} aria-current={idx === active} className="vc-dot" data-on={idx === active ? "true" : "false"} />
          ))}
        </div>
      )}

      {n > 1 && (
        <div className="vc-nav">
          <button type="button" onClick={() => go(-1)} aria-label="Previous video">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          {auto.canAuto && <PauseButton paused={auto.userPaused} onClick={auto.toggle} label="videos" style={{ width: 56, height: 56, background: "#fff" }} />}
          <button type="button" onClick={() => go(1)} aria-label="Next video">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      <style jsx global>{`
        .vc { overflow: hidden; }
        .vc-stage { --w: min(760px, 78vw); position: relative; height: calc(var(--w) * 0.5625 + 28px); max-width: 1300px; margin: 0 auto; perspective: 1500px; outline-offset: 6px; }
        .vc-card { position: absolute; top: 0; left: 50%; width: var(--w); transition: transform 0.6s cubic-bezier(.2,.8,.2,1), opacity 0.5s ease; transform: translateX(-50%) translateX(calc(var(--d) * 54%)) translateZ(calc(var(--ad) * -150px)) rotateY(calc(var(--d) * 26deg)) scale(calc(1 - var(--ad) * 0.1)); opacity: calc(1 - var(--ad) * 0.12); will-change: transform; }
        .vc-card[data-hidden="true"] { opacity: 0; pointer-events: none; }
        .vc-frame { background: #fff; border-radius: 30px; padding: 12px; box-shadow: 0 18px 50px rgba(15,23,42,0.18); }
        .vc-media { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 20px; background: #000; overflow: hidden; }
        .vc-thumb { position: relative; padding: 0; cursor: pointer; }
        .vc-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .vc-thumb:focus-visible, .vc-nav button:focus-visible, .vc-stage:focus-visible { outline: 3px solid #10b981; outline-offset: 3px; }
        .vc-play { position: absolute; inset: 0; margin: auto; width: 76px; height: 76px; border-radius: 50%; background: rgba(6,78,59,0.88); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 30px rgba(0,0,0,0.35); transition: transform 0.2s; }
        .vc-thumb:hover .vc-play { transform: scale(1.08); }
        .vc-dots { display: flex; justify-content: center; gap: 4px; margin-top: 18px; flex-wrap: wrap; padding: 0 20px; }
        .vc-dot { width: 24px; height: 24px; border: 0; background: none; cursor: pointer; position: relative; padding: 0; }
        .vc-dot::after { content: ""; position: absolute; inset: 8px; border-radius: 99px; background: #cbd5e1; transition: all 0.25s; }
        .vc-dot[data-on="true"]::after { background: #064e3b; inset: 8px -2px; }
        .vc-dot:focus-visible { outline: 3px solid #10b981; outline-offset: 2px; }
        .vc-nav { display: flex; align-items: center; justify-content: center; gap: 18px; margin-top: 22px; }
        .vc-nav button { width: 56px; height: 56px; border-radius: 50%; border: none; background: #064e3b; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 24px rgba(6,78,59,0.3); transition: transform 0.2s, background 0.2s; }
        .vc-nav button:hover { background: #047857; transform: translateY(-2px); }
        @media (max-width: 700px) {
          .vc-stage { --w: 80vw; }
          .vc-card { transform: translateX(-50%) translateX(calc(var(--d) * 50%)) translateZ(calc(var(--ad) * -120px)) rotateY(calc(var(--d) * 22deg)) scale(calc(1 - var(--ad) * 0.12)); }
          .vc-card[data-far="true"] { opacity: 0; pointer-events: none; }
          .vc-frame { padding: 8px; border-radius: 22px; }
          .vc-media { border-radius: 15px; }
          .vc-play { width: 60px; height: 60px; }
        }
        @media (prefers-reduced-motion: reduce) { .vc-card { transition: none; } }
      `}</style>
    </section>
  );
}
