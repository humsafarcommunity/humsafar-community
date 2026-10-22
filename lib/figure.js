// CMS stat fields sometimes hold a whole sentence. Keep only the short figure so the numbers stay tidy.
export function figure(v, rating = false) {
  const t = String(v || "").trim();
  if (!t) return "";
  const m = rating ? t.match(/\b[0-5](?:\.\d)?\b/) : t.match(/\d[\d,.]*\s?[kKmM]?\+?/);
  return m ? m[0].replace(/\s/g, "") : t.length <= 12 ? t : "";
}
