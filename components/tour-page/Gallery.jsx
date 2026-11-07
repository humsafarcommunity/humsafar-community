import { useEffect, useState } from "react";
import Image from "next/image";
import Icon from "./Icon";

// Photo grid with a full-screen viewer. images: [{ src, alt }]
const MAX_TILES = 8;

export default function Gallery({ images }) {
  const [open, setOpen] = useState(-1);
  const n = images.length;
  const tiles = images.slice(0, MAX_TILES);
  const extra = n - MAX_TILES;

  useEffect(() => {
    if (open < 0) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(-1);
      if (e.key === "ArrowRight") setOpen((k) => (k + 1) % n);
      if (e.key === "ArrowLeft") setOpen((k) => (k - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, n]);

  return (
    <>
      <div className="tp-gal">
        {tiles.map((im, k) => (
          <button key={im.src + k} type="button" className="tp-gal-tile" onClick={() => setOpen(k)} aria-label={`Open photo ${k + 1} of ${n}`}>
            <Image src={im.src} alt={im.alt} fill sizes="(max-width: 768px) 50vw, 260px" style={{ objectFit: "cover" }} loading="lazy" />
            {k === MAX_TILES - 1 && extra > 0 && <span className="tp-gal-more">+{extra}</span>}
          </button>
        ))}
      </div>
      {open >= 0 && (
        <div className="tp-lb" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={(e) => { if (e.target === e.currentTarget) setOpen(-1); }}>
          <div className="tp-lb-top">
            <span>{open + 1} / {n}</span>
            <button type="button" className="tp-round" onClick={() => setOpen(-1)} aria-label="Close photo viewer" autoFocus><Icon name="x" size={18} /></button>
          </div>
          <div className="tp-lb-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[open].src} alt={images[open].alt} />
          </div>
          <div className="tp-lb-nav">
            <button type="button" onClick={() => setOpen((open - 1 + n) % n)}>Previous</button>
            <button type="button" onClick={() => setOpen((open + 1) % n)}>Next</button>
          </div>
        </div>
      )}
    </>
  );
}
