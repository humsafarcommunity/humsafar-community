// Smart type-ahead for the homepage hero search.
// Ranking: titles that START with what was typed come first (type "M" and you get Manali packages first),
// then titles with a word that starts with it, then other matches, and finally close spellings
// ("manli" still finds Manali). Best-selling trips win ties.

const norm = (v) => String(v || "").toLowerCase().replace(/[^a-z0-9₹]+/g, " ").trim();

// Small edit-distance check (1 typo allowed) for words of 4+ letters
function withinOneEdit(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function scoreTour(tour, q, tokens) {
  const title = norm(tour.title);
  const words = norm(`${tour.title} ${tour.location} ${tour.slug}`).split(" ").filter(Boolean);
  let s = 0;
  if (title.startsWith(q)) s = 100;
  else if (title.split(" ").some((w) => w.startsWith(q))) s = 80;
  else if (tokens.every((t) => words.some((w) => w.startsWith(t)))) s = 70;
  else if (norm(`${tour.title} ${tour.location}`).includes(q)) s = 50;
  else if (tokens.every((t) => words.some((w) => w.startsWith(t) || (t.length >= 4 && withinOneEdit(t, w.slice(0, t.length + 1)))))) s = 30;
  if (!s) return 0;
  return s + (tour.bestseller ? 5 : 0);
}

export function suggestTours(tours = [], query = "", limit = 6) {
  const q = norm(query);
  const list = (tours || []).filter((t) => t?.slug && t?.title);
  if (!q) {
    // Nothing typed yet: show the popular trips
    return list.filter((t) => t.bestseller).slice(0, limit).concat(list.filter((t) => !t.bestseller)).slice(0, limit)
      .map((tour) => ({ tour, score: 0 }));
  }
  const tokens = q.split(" ").filter(Boolean);
  return list
    .map((tour) => ({ tour, score: scoreTour(tour, q, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || String(a.tour.title).localeCompare(String(b.tour.title)))
    .slice(0, limit);
}

// Returns [before, matched, after] so the typed part can be shown in bold
export function splitMatch(text = "", query = "") {
  const q = String(query || "").trim();
  if (!q) return [text, "", ""];
  const i = String(text).toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return [text, "", ""];
  return [text.slice(0, i), text.slice(i, i + q.length), text.slice(i + q.length)];
}
