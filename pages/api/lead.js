import { randomUUID } from "crypto";

// Saves an enquiry from the callback form.
// Optional destinations:
// - SANITY_WRITE_TOKEN: saves it in Sanity Studio → Leads
// - LEAD_WEBHOOK_URL: existing optional webhook (e.g. Sheets/Make)
// - CRM_LEAD_WEBHOOK_URL + CRM_LEAD_WEBHOOK_SECRET: forwards it to Humsafar ERP CRM
const hits = new Map();

function clean(v, max) {
  return String(v || "").replace(/[\\u0000-\\u001f]/g, " ").trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3600 * 1000);
  if (recent.length >= 10) return res.status(429).json({ ok: false, error: "Too many requests" });
  hits.set(ip, [...recent, now]);

  const b = req.body || {};
  if (clean(b.company, 50)) return res.status(200).json({ ok: true }); // hidden field filled in: a bot

  const phone = clean(b.phone, 20).replace(/[^\\d+]/g, "");
  const digits = phone.replace(/^\\+?91/, "");
  if (!/^[6-9]\\d{9}$/.test(digits)) return res.status(400).json({ ok: false, error: "Enter a valid 10-digit mobile number" });

  const lead = {
    _type: "lead",
    name: clean(b.name, 80),
    phone: `+91${digits}`,
    email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(clean(b.email, 120)) ? clean(b.email, 120) : "",
    tripType: clean(b.tripType, 60),
    destination: clean(b.destination, 80),
    consent: b.consent === true || b.consent === "on" || b.consent === "true",
    fromCity: clean(b.fromCity, 60),
    travelMonth: clean(b.travelMonth, 30),
    people: clean(b.people, 10),
    trip: clean(b.trip, 160),
    page: clean(b.page, 200),
    status: "new",
    createdAt: new Date().toISOString(),
  };

  if (!lead.name) return res.status(400).json({ ok: false, error: "Please enter your name" });

  let stored = false;
  let crmForwarded = false;
  const token = process.env.SANITY_WRITE_TOKEN;
  if (token) {
    try {
      const r = await fetch("https://fghdctku.api.sanity.io/v2024-03-01/data/mutate/production", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mutations: [{ create: lead }] }),
      });
      stored = r.ok;
    } catch (e) {
      stored = false;
    }
  }

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 7000);
      const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead), signal: ctrl.signal });
      clearTimeout(t);
      stored = stored || r.ok;
    } catch (e) {
      /* keep the visitor flow available if an optional webhook is unavailable */
    }
  }

  // Forward the same website enquiry into the ERP CRM. This is server-to-server;
  // the shared secret is never exposed to the browser.
  const crmUrl = process.env.CRM_LEAD_WEBHOOK_URL;
  const crmSecret = process.env.CRM_LEAD_WEBHOOK_SECRET;
  if (crmUrl && crmSecret) {
    try {
      const details = [
        lead.tripType && `Trip type: ${lead.tripType}`,
        lead.fromCity && `Travelling from: ${lead.fromCity}`,
        lead.travelMonth && `Travel month: ${lead.travelMonth}`,
        lead.people && `Travellers: ${lead.people}`,
        lead.trip && `Package: ${lead.trip}`,
        lead.page && `Website page: ${lead.page}`,
      ].filter(Boolean).join("\\n");
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 7000);
      const r = await fetch(crmUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-humsafar-lead-secret": crmSecret,
        },
        body: JSON.stringify({
          externalLeadId: randomUUID(),
          source: "website",
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          destination: lead.destination || lead.trip || lead.tripType,
          campaign: lead.page || "Website enquiry",
          message: details,
        }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      crmForwarded = r.ok;
    } catch (e) {
      /* do not block the visitor's enquiry/WhatsApp continuation */
    }
  }

  return res.status(200).json({ ok: true, stored, crmForwarded });
}
