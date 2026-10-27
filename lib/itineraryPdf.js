// Branded itinerary PDF for a tour. Built with pdf-lib (no font or file lookups, so it works on any host).
import { PDFDocument, StandardFonts, rgb, PDFString } from "pdf-lib";
import QRCode from "qrcode";
import { LOGO_PNG_BASE64, LOGO_RATIO } from "./pdfLogo";

const TEAL = rgb(0.051, 0.298, 0.322);   // #0D4C52
const GOLD = rgb(0.788, 0.588, 0.227);   // #C9963A
const CREAM = rgb(0.98, 0.961, 0.918);   // #FAF5EA
const INK = rgb(0.122, 0.165, 0.173);
const MUTED = rgb(0.42, 0.486, 0.5);
const LINE = rgb(0.86, 0.83, 0.77);
const RED = rgb(0.66, 0.2, 0.2);
const WHITE = rgb(1, 1, 1);

const W = 595.28, H = 841.89, M = 40, TOP = H - 70, BOTTOM = 62;

// Standard PDF fonts only know Latin-1. Map the common extras and drop the rest so nothing crashes.
const MAP = { "₹": "Rs. ", "–": "-", "—": "-", "‘": "'", "’": "'", "“": '"', "”": '"', "…": "...", "•": "-", "✓": "+", "✔": "+", "✗": "x", "✘": "x", "→": "to", "×": "x", " ": " " };
export function clean(v) {
  return String(v == null ? "" : v)
    .replace(/[₹–—‘’“”…•✓✔✗✘→× ]/g, (c) => MAP[c] || "")
    .replace(/\*\*|__/g, "")
    .replace(/[^\n\x20-\x7e\xa1-\xff]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

const money = (n) => (Number(n) > 0 ? "Rs. " + Number(n).toLocaleString("en-IN") : "");
const DEPARTS = { saturday: "Every Saturday", friday: "Every Friday", both: "Fridays and Saturdays" };

async function fetchImage(url) {
  if (!url) return null;
  try {
    let u = String(url);
    if (u.includes("cdn.sanity.io")) u = u.split("?")[0] + "?w=1190&h=540&fit=crop&crop=center&fm=jpg&q=80";
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 7000);
    const res = await fetch(u, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const kind = buf[0] === 0xff && buf[1] === 0xd8 ? "jpg" : buf[0] === 0x89 && buf[1] === 0x50 ? "png" : null;
    return kind ? { buf, kind } : null;
  } catch (e) {
    return null;
  }
}

export async function buildItineraryPdf(tour, site = {}) {
  const pdf = await PDFDocument.create();
  const reg = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ital = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const logo = await pdf.embedPng(Buffer.from(LOGO_PNG_BASE64, "base64"));

  const base = (site.url || "https://www.humsafarcommunity.com").replace(/\/$/, "");
  const pageUrl = `${base}/packages/${tour.slug}`;
  const phone = clean(site.phone) || "+91 62684 96389";
  const wa = String(site.whatsapp || "916268496389").replace(/\D/g, "");
  const waUrl = `https://wa.me/${wa}?text=${encodeURIComponent(`Hi Humsafar! I want to book: ${tour.title} (${pageUrl})`)}`;
  const email = clean(site.email) || "humsafarcommunity4@gmail.com";

  pdf.setTitle(clean(tour.title) + " - Itinerary | Humsafar Community");
  pdf.setAuthor("Humsafar Community");
  pdf.setSubject("Trip itinerary");
  pdf.setCreator("humsafarcommunity.com");

  const pages = [];
  let page, y;

  const text = (s, x, yy, size, font = reg, color = INK) => page.drawText(clean(s), { x, y: yy, size, font, color });
  const widthOf = (s, size, font = reg) => font.widthOfTextAtSize(clean(s), size);
  const wrap = (s, size, maxW, font = reg) => {
    const out = [];
    for (const para of clean(s).split("\n")) {
      const words = para.split(" ").filter(Boolean);
      let line = "";
      for (const w of words) {
        const t = line ? line + " " + w : w;
        if (font.widthOfTextAtSize(t, size) <= maxW) line = t;
        else { if (line) out.push(line); line = w; }
      }
      if (line) out.push(line);
    }
    return out;
  };
  const link = (x, yy, w, h, url) => {
    const ctx = pdf.context;
    const ref = ctx.register(ctx.obj({ Type: "Annot", Subtype: "Link", Rect: [x, yy, x + w, yy + h], Border: [0, 0, 0], A: { Type: "Action", S: "URI", URI: PDFString.of(url) } }));
    page.node.addAnnot(ref);
  };
  const newPage = (cover = false) => {
    page = pdf.addPage([W, H]);
    pages.push({ page, cover });
    if (!cover) {
      const lw = 78;
      page.drawImage(logo, { x: M, y: H - 50, width: lw, height: lw * LOGO_RATIO });
      const t = clean(tour.title);
      const size = 9;
      const tw = Math.min(widthOf(t, size, bold), 330);
      text(wrap(t, size, 330, bold)[0] || t, W - M - tw, H - 38, size, bold, TEAL);
      page.drawRectangle({ x: M, y: H - 56, width: W - 2 * M, height: 1.2, color: GOLD });
      y = TOP;
    }
  };
  const ensure = (h) => { if (y - h < BOTTOM) newPage(); };
  const heading = (s) => {
    ensure(46);
    y -= 8;
    text(s, M, y - 14, 15, bold, TEAL);
    page.drawRectangle({ x: M, y: y - 22, width: 38, height: 3, color: GOLD });
    y -= 36;
  };

  // ───────── COVER ─────────
  newPage(true);
  const lw = 120;
  page.drawImage(logo, { x: M, y: H - 28 - lw * LOGO_RATIO, width: lw, height: lw * LOGO_RATIO });
  const tag = "GROUP TRAVEL FROM GWALIOR";
  text(tag, W - M - widthOf(tag, 8, bold), H - 46, 8, bold, GOLD);
  const img = await fetchImage(tour.img);
  const IMG_H = img ? 250 : 0;
  const imgBoxY = H - 40 - lw * LOGO_RATIO - 20 - IMG_H;
  if (img) page.drawRectangle({ x: 0, y: imgBoxY, width: W, height: IMG_H, color: TEAL });
  if (img) {
    try {
      const im = img.kind === "jpg" ? await pdf.embedJpg(img.buf) : await pdf.embedPng(img.buf);
      const s = Math.max(W / im.width, 250 / im.height);
      const iw = im.width * s, ih = im.height * s;
      // draw clipped to the box using a clipping path via a transformed rectangle is not available, so keep ratio-matched crops
      const fit = Math.min(W / im.width, 250 / im.height);
      page.drawImage(im, { x: (W - im.width * fit) / 2, y: imgBoxY + (250 - im.height * fit) / 2, width: im.width * fit, height: im.height * fit });
      void iw; void ih;
    } catch (e) { /* keep the teal block */ }
  }
  // title block
  const tBlockH = 140;
  const tY = imgBoxY - tBlockH;
  page.drawRectangle({ x: 0, y: tY, width: W, height: tBlockH, color: TEAL });
  page.drawRectangle({ x: 0, y: tY + tBlockH - 4, width: W, height: 4, color: GOLD });
  const tLines = wrap(tour.title, 25, W - 2 * M, bold).slice(0, 3);
  const loc = clean(tour.location);
  if (loc) text(loc.toUpperCase(), M, tY + tBlockH - 28, 9, bold, GOLD);
  let ty = tY + tBlockH - 58;
  for (const l of tLines) { text(l, M, ty, 25, bold, WHITE); ty -= 30; }

  // facts strip
  const facts = [
    ["DURATION", clean(tour.duration) || "-"],
    ["DEPARTS", DEPARTS[tour.departureDay] || "Weekly batches"],
    ["PRICE PER PERSON", money(tour.price) ? "From " + money(tour.price) : "On request"],
  ];
  const fw = (W - 2 * M - 20) / 3;
  y = tY - 22;
  facts.forEach(([k, v], i) => {
    const x = M + i * (fw + 10);
    page.drawRectangle({ x, y: y - 46, width: fw, height: 52, color: CREAM, borderColor: LINE, borderWidth: 0.6 });
    text(k, x + 12, y - 12, 7, bold, MUTED);
    text(wrap(v, 12, fw - 24, bold)[0] || v, x + 12, y - 32, 12, bold, TEAL);
  });
  y -= 76;

  if (tour.directAnswer || tour.seoDesc) {
    const intro = wrap(tour.directAnswer || tour.seoDesc, 10, W - 2 * M, ital).slice(0, 4);
    for (const l of intro) { text(l, M, y, 10, ital, INK); y -= 14; }
    y -= 8;
  }

  const hl = (tour.highlights || []).map(clean).filter(Boolean).slice(0, 10);
  if (hl.length) {
    text("Trip highlights", M, y, 14, bold, TEAL);
    page.drawRectangle({ x: M, y: y - 8, width: 38, height: 3, color: GOLD });
    y -= 28;
    const colW = (W - 2 * M - 16) / 2;
    const startY = y;
    let colY = [startY, startY];
    hl.forEach((h, i) => {
      const c = i % 2;
      const lines = wrap(h, 9.5, colW - 16);
      const x = M + c * (colW + 16);
      if (colY[c] - lines.length * 13 < BOTTOM) return;
      page.drawCircle({ x: x + 3, y: colY[c] + 3, size: 2.4, color: GOLD });
      lines.forEach((l, li) => text(l, x + 12, colY[c] - li * 13, 9.5));
      colY[c] -= lines.length * 13 + 6;
    });
    y = Math.min(colY[0], colY[1]) - 6;
  }

  // ───────── ITINERARY ─────────
  const days = (tour.itinerary || []).filter((d) => d && (d.title || d.desc));
  if (days.length) {
    if (y < BOTTOM + 230) newPage(); else y -= 10;
    heading("Day-by-day itinerary");
    const tlX = M + 24;
    for (const d of days) {
      ensure(60);
      const label = "DAY " + (d.day != null && d.day !== "" ? d.day : days.indexOf(d) + 1);
      const bw = widthOf(label, 8, bold) + 16;
      page.drawRectangle({ x: M, y: y - 14, width: bw, height: 18, color: GOLD });
      text(label, M + 8, y - 8.5, 8, bold, WHITE);
      const tl = wrap(d.title || "", 12, W - M - (M + bw + 12), bold);
      (tl.length ? tl : [""]).forEach((l, i) => text(l, M + bw + 12, y - 9 - i * 15, 12, bold, TEAL));
      y -= Math.max(22, tl.length * 15 + 8);
      const points = clean(d.desc).split(/(?<!\bRs\.)(?<!\bMr\.)(?<!\bDr\.)(?<=[.!?])\s+|\n/).map((p) => p.trim()).filter(Boolean);
      for (const p of points) {
        const lines = wrap(p, 9.5, W - M - (tlX + 14));
        for (let i = 0; i < lines.length; i++) {
          ensure(15);
          page.drawRectangle({ x: tlX - 0.4, y: y - 4, width: 0.9, height: 15, color: LINE });
          if (i === 0) page.drawCircle({ x: tlX, y: y + 3, size: 2, color: GOLD });
          text(lines[i], tlX + 12, y, 9.5);
          y -= 13.5;
        }
      }
      if (d.meals) { ensure(18); text("Meals: " + clean(d.meals), tlX + 12, y - 2, 8.5, ital, MUTED); y -= 16; }
      y -= 12;
    }
  }

  // ───────── INCLUDED / NOT INCLUDED ─────────
  const inc = (tour.inclusions || []).map(clean).filter(Boolean);
  const exc = (tour.exclusions || []).map(clean).filter(Boolean);
  if (inc.length || exc.length) {
    if (y < BOTTOM + 160) newPage(); else y -= 4;
    heading("What is included");
    const colW = (W - 2 * M - 24) / 2;
    const draw = (items, x, color, title) => {
      let yy = y;
      text(title, x, yy, 10.5, bold, color);
      yy -= 18;
      for (const it of items) {
        const lines = wrap(it, 9.2, colW - 14);
        if (yy - lines.length * 12.5 < BOTTOM) { break; }
        page.drawCircle({ x: x + 3, y: yy + 3, size: 2.2, color });
        lines.forEach((l, i) => text(l, x + 12, yy - i * 12.5, 9.2));
        yy -= lines.length * 12.5 + 5;
      }
      return yy;
    };
    // make sure the taller column fits; otherwise start on a fresh page
    const need = (items) => items.reduce((a, it) => a + wrap(it, 9.2, colW - 14).length * 12.5 + 5, 0) + 20;
    if (y - Math.max(need(inc), need(exc)) < BOTTOM && Math.max(need(inc), need(exc)) < H - 160) { newPage(); heading("What is included"); }
    const y1 = draw(inc, M, TEAL, "Included");
    const y2 = draw(exc, M + colW + 24, RED, "Not included");
    y = Math.min(y1, y2) - 10;
  }

  // ───────── TERMS ─────────
  const terms = [
    ["Advance to book", tour.advanceAmount],
    ["Taxes", tour.taxNote],
    ["Cancellation and refunds", tour.cancellationPolicy],
    ["Weather and road closures", tour.weatherNote],
  ].filter(([, v]) => clean(v));
  if (terms.length) {
    ensure(120);
    heading("Booking terms");
    for (const [k, v] of terms) {
      const lines = wrap(v, 9.5, W - 2 * M - 12);
      ensure(lines.length * 13 + 24);
      text(k, M, y, 9.5, bold, TEAL);
      y -= 14;
      lines.forEach((l) => { text(l, M + 12, y, 9.5); y -= 13; });
      y -= 6;
    }
  }

  // ───────── BOOK NOW CARD ─────────
  const cardH = 128;
  if (y - cardH < BOTTOM) newPage();
  y -= 8;
  const cy = y - cardH;
  page.drawRectangle({ x: M, y: cy, width: W - 2 * M, height: cardH, color: TEAL });
  page.drawRectangle({ x: M, y: cy + cardH - 4, width: W - 2 * M, height: 4, color: GOLD });
  text("Ready to join this trip?", M + 20, cy + cardH - 34, 16, bold, WHITE);
  text("Message us on WhatsApp or call, and we will confirm dates and seats.", M + 20, cy + cardH - 52, 9, reg, rgb(0.85, 0.92, 0.92));
  text("WhatsApp / Call:  " + phone, M + 20, cy + 46, 10.5, bold, GOLD);
  link(M + 20, cy + 40, 260, 18, waUrl);
  text("Book on WhatsApp  >", M + 20, cy + 26, 9.5, bold, WHITE);
  link(M + 20, cy + 20, 140, 16, waUrl);
  text(base.replace("https://", "") + "/packages/" + tour.slug, M + 20, cy + 10, 7.2, reg, rgb(0.78, 0.86, 0.86));
  link(M + 20, cy + 5, 300, 14, pageUrl);
  try {
    const qr = await QRCode.toBuffer(pageUrl, { margin: 1, width: 260, color: { dark: "#0D4C52", light: "#FFFFFF" } });
    const qi = await pdf.embedPng(qr);
    const q = 82;
    const bx = W - M - q - 28, bw2 = q + 16, bh = q + 30, by = cy + (cardH - bh) / 2 - 2;
    page.drawRectangle({ x: bx, y: by, width: bw2, height: bh, color: WHITE });
    page.drawImage(qi, { x: bx + 8, y: by + 22, width: q, height: q });
    link(bx, by, bw2, bh, pageUrl);
    const cap = "Scan for live dates";
    text(cap, bx + (bw2 - widthOf(cap, 7, bold)) / 2, by + 9, 7, bold, TEAL);
  } catch (e) { /* QR is optional */ }
  y = cy - 14;
  const note = "Prices and inclusions can change with season and availability. The latest details are always on the trip page.";
  wrap(note, 8, W - 2 * M, ital).forEach((l) => { if (y > BOTTOM - 10) { text(l, M, y, 8, ital, MUTED); y -= 11; } });

  // ───────── FOOTERS ─────────
  pages.forEach(({ page: p, cover }, i) => {
    page = p;
    p.drawRectangle({ x: M, y: 42, width: W - 2 * M, height: 0.8, color: LINE });
    text(`Humsafar Community  |  ${phone}  |  ${email}`, M, 28, 7.5, reg, MUTED);
    const pn = `Page ${i + 1} of ${pages.length}`;
    text(pn, W - M - widthOf(pn, 7.5), 28, 7.5, reg, MUTED);
    link(M, 22, 300, 14, `${base}`);
    void cover;
  });

  return Buffer.from(await pdf.save());
}
