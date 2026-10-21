// Builds WhatsApp links. Every message names the page it came from, so you can see which page brought the lead.
export function waNumber(site) {
  return String((site && site.whatsapp) || "916268496389").replace(/\D/g, "");
}

export function waLink(site, text, source) {
  const msg = source ? `${text}\n\n📍 From: ${source}` : text;
  return `https://wa.me/${waNumber(site)}?text=${encodeURIComponent(msg)}`;
}

export function telLink(site) {
  return `tel:+${waNumber(site)}`;
}

export function track(event, params) {
  try {
    if (typeof window !== "undefined" && window.gtag) window.gtag("event", event, params || {});
  } catch (e) {
    /* analytics must never break the page */
  }
}
