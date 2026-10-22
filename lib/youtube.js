// Pulls the 11-character video id out of any common YouTube link (watch, youtu.be, shorts, embed, live).
export function youtubeId(url) {
  const m = String(url || "").trim().match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "";
}
