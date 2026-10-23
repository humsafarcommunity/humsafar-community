import Link from "next/link";

// Blog text is sometimes saved with markdown marks (## headings, **bold**, [links](url), - bullets, | tables |).
// These helpers turn those marks into proper HTML instead of showing the raw symbols.

const INLINE = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g;

export function inline(text, keyPrefix = "i") {
  const parts = String(text || "").split(INLINE).filter((p) => p !== "");
  return parts.map((p, i) => {
    const key = `${keyPrefix}-${i}`;
    if (/^\*\*[^*]+\*\*$/.test(p) || /^__[^_]+__$/.test(p)) return <strong key={key}>{p.slice(2, -2)}</strong>;
    if (/^\*[^*\s][^*]*\*$/.test(p)) return <em key={key}>{p.slice(1, -1)}</em>;
    const link = p.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const href = link[2];
      const internal = href.startsWith("/");
      return internal
        ? <Link key={key} href={href} style={{ color: "#047857", textDecoration: "underline" }}>{link[1]}</Link>
        : <a key={key} href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#047857", textDecoration: "underline" }}>{link[1]}</a>;
    }
    return p;
  });
}

const cells = (line) => line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
const isSep = (line) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);

// One saved paragraph can hold several lines: headings, bullets, a table, or plain text.
export function RichBlocks({ text, styles = {}, speakable = true }) {
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i += 1; continue; }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const Tag = level <= 2 ? "h2" : "h3";
      out.push(<Tag key={k++} style={level <= 2 ? styles.h2 : styles.h3}>{inline(h[2], `h${k}`)}</Tag>);
      i += 1; continue;
    }
    if (/^\s*[-*•]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*•]\s+/, "")); i += 1; }
      out.push(<ul key={k++} style={{ listStyle: "disc", ...styles.ul }}>{items.map((t, j) => <li key={j} style={styles.li}>{inline(t, `u${k}${j}`)}</li>)}</ul>);
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+[.)]\s+/, "")); i += 1; }
      out.push(<ol key={k++} style={{ listStyle: "decimal", ...styles.ol }}>{items.map((t, j) => <li key={j} style={styles.li}>{inline(t, `o${k}${j}`)}</li>)}</ol>);
      continue;
    }
    if (line.includes("|") && i + 1 < lines.length && isSep(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) { rows.push(cells(lines[i])); i += 1; }
      out.push(
        <div key={k++} style={{ overflowX: "auto", margin: "0 0 24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead><tr>{head.map((c, j) => <th key={j} style={{ textAlign: "left", padding: "10px 12px", background: "#f0fdf4", borderBottom: "2px solid #d1fae5", color: "#064e3b" }}>{inline(c, `th${k}${j}`)}</th>)}</tr></thead>
            <tbody>{rows.map((r, a) => <tr key={a}>{r.map((c, b) => <td key={b} style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>{inline(c, `td${k}${a}${b}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
      continue;
    }
    // a normal paragraph: gather following plain lines
    const para = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|\s*[-*•]\s|\s*\d+[.)]\s)/.test(lines[i]) && !(lines[i].includes("|") && i + 1 < lines.length && isSep(lines[i + 1]))) { para.push(lines[i]); i += 1; }
    out.push(<p key={k++} style={styles.p} className={speakable ? "speakable" : undefined}>{inline(para.join(" "), `p${k}`)}</p>);
  }
  return <>{out}</>;
}
