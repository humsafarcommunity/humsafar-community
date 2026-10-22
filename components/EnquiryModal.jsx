import { useEffect, useRef, useState } from "react";
import { waLink, track } from "../lib/whatsapp";

// Popup enquiry form. The photo, heading, button text and dropdown choices come from the CMS
// (Site Settings → Enquiry Popup Form). Every submission goes to /api/lead, which feeds your Google Sheet.
// Open it from anywhere with: window.dispatchEvent(new Event("open-enquiry"))
const DEFAULT_TYPES = ["Group trip", "Bike trip", "Family trip", "Couple / honeymoon", "College / corporate group", "Custom private trip"];
const DEFAULT_PLACES = ["Manali", "Kasol", "Spiti Valley", "Ladakh", "Jibhi / Tirthan", "Uttarakhand", "Rajasthan", "Goa", "International", "Not sure yet"];

export default function EnquiryModal({ site = {} }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const firstField = useRef(null);
  const lastFocus = useRef(null);

  const enabled = site.popupEnabled !== false;
  const types = site.popupTripTypes?.length ? site.popupTripTypes : DEFAULT_TYPES;
  const places = site.popupDestinations?.length ? site.popupDestinations : DEFAULT_PLACES;
  const title = site.popupTitle || "Plan Your Next Trip";
  const button = site.popupButtonText || "Let's Travel";

  useEffect(() => {
    if (!enabled) return undefined;
    const show = () => {
      lastFocus.current = document.activeElement;
      setOpen(true);
    };
    window.addEventListener("open-enquiry", show);

    // Optional: open once per visit on computers only. Never on phones (Google penalises pop-ups there).
    let timer;
    if (site.popupAutoOpen && window.matchMedia("(min-width: 900px)").matches) {
      let seen = false;
      try { seen = sessionStorage.getItem("enquiry-seen") === "1"; } catch (e) { /* ignore */ }
      if (!seen) {
        timer = setTimeout(() => {
          try { sessionStorage.setItem("enquiry-seen", "1"); } catch (e) { /* ignore */ }
          show();
        }, Math.max(5, Number(site.popupDelay) || 20) * 1000);
      }
    }
    return () => {
      window.removeEventListener("open-enquiry", show);
      clearTimeout(timer);
    };
  }, [enabled, site.popupAutoOpen, site.popupDelay]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstField.current && firstField.current.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    setError("");
    if (status === "done") { setStatus("idle"); setSummary(null); }
    try { lastFocus.current && lastFocus.current.focus(); } catch (e) { /* ignore */ }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const f = Object.fromEntries(new FormData(e.target).entries());
    const digits = String(f.phone || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (!String(f.name || "").trim()) { setError("Please enter your name."); return; }
    if (!/^[6-9]\d{9}$/.test(digits)) { setError("Please enter a valid 10-digit mobile number."); return; }
    if (!f.tripType) { setError("Please choose the kind of trip you prefer."); return; }
    setStatus("sending");
    const payload = {
      name: f.name, email: f.email || "", phone: digits, tripType: f.tripType, destination: f.destination || "",
      consent: f.consent === "on", company: f.company || "",
      trip: f.destination ? `${f.destination} (${f.tripType})` : f.tripType,
      page: typeof window !== "undefined" ? window.location.pathname : "popup",
    };
    try {
      await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } catch (err) { /* the WhatsApp step below still reaches us */ }
    track("generate_lead", { event_label: "Enquiry popup", value: 1 });
    setSummary(payload);
    setStatus("done");
  }

  if (!enabled || !open) return null;

  const field = { width: "100%", minHeight: 50, padding: "0 16px", borderRadius: 14, border: "1.5px solid #cbd5e1", background: "#fff", fontSize: 16, fontFamily: "var(--sans)", color: "#0f172a", boxSizing: "border-box" };
  const label = { display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 };

  return (
    <div className="enq-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="enq-modal" role="dialog" aria-modal="true" aria-labelledby="enq-title">
        <div className="enq-photo">
          {site.popupImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={site.popupImage} alt={site.popupImageAlt || ""} />
          ) : (
            <div className="enq-photo-fallback">
              <p>Group trips to the Himalayas</p>
              <span>Manali · Kasol · Spiti · Ladakh</span>
            </div>
          )}
        </div>

        <div className="enq-body">
          <div className="enq-head">
            <h2 id="enq-title">{status === "done" ? "Thank you!" : title}</h2>
            <button type="button" onClick={close} aria-label="Close enquiry form" className="enq-close">&times;</button>
          </div>

          {status === "done" && summary ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <p style={{ fontSize: 17, color: "#334155", lineHeight: 1.7, marginBottom: 22 }}>
                We have your details, {String(summary.name).split(" ")[0]}. Tap below to chat with us on WhatsApp now, or wait for our message.
              </p>
              <a
                href={waLink(site, `Hi Humsafar! I am ${summary.name}.\nI want to plan a ${summary.tripType} trip${summary.destination ? ` to ${summary.destination}` : ""}.\n📞 ${summary.phone}`, "Enquiry popup")}
                target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { event_label: "Enquiry popup" })}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 50, padding: "0 30px", borderRadius: 999, background: "#047857", color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none" }}
              >
                Continue on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate style={{ display: "grid", gap: 16 }}>
              <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
              <div>
                <label htmlFor="enq-name" style={label}>Full name *</label>
                <input ref={firstField} id="enq-name" name="name" type="text" autoComplete="name" required maxLength={80} placeholder="Your name" style={field} />
              </div>
              <div>
                <label htmlFor="enq-email" style={label}>Email</label>
                <input id="enq-email" name="email" type="email" autoComplete="email" maxLength={120} placeholder="you@example.com" style={field} />
              </div>
              <div>
                <label htmlFor="enq-phone" style={label}>Mobile / WhatsApp number *</label>
                <div style={{ display: "flex" }}>
                  <span style={{ ...field, width: 72, display: "flex", alignItems: "center", justifyContent: "center", borderRight: "none", borderRadius: "14px 0 0 14px", background: "#f1f5f9", fontWeight: 700 }}>+91</span>
                  <input id="enq-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" required maxLength={14} placeholder="98765 43210" style={{ ...field, borderRadius: "0 14px 14px 0" }} />
                </div>
              </div>
              <div>
                <label htmlFor="enq-type" style={label}>What kind of trip do you prefer? *</label>
                <select id="enq-type" name="tripType" required defaultValue="" style={field}>
                  <option value="" disabled>Select a category</option>
                  {types.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="enq-place" style={label}>Where do you want to go?</label>
                <select id="enq-place" name="destination" defaultValue="" style={field}>
                  <option value="">Select a location</option>
                  {places.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#475569", lineHeight: 1.5, cursor: "pointer" }}>
                <input type="checkbox" name="consent" defaultChecked style={{ width: 20, height: 20, marginTop: 2, accentColor: "#047857", flexShrink: 0 }} />
                Keep me updated with offers and trips on WhatsApp and email.
              </label>
              {error && <p role="alert" style={{ color: "#b91c1c", fontSize: 14, fontWeight: 600, margin: 0 }}>{error}</p>}
              <button type="submit" disabled={status === "sending"} style={{ justifySelf: "center", minHeight: 52, padding: "0 40px", borderRadius: 999, border: "none", background: "#064e3b", color: "#fff", fontSize: 16, fontWeight: 800, fontFamily: "var(--sans)", cursor: "pointer", opacity: status === "sending" ? 0.7 : 1 }}>
                {status === "sending" ? "Sending…" : button}
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx global>{`
        .enq-backdrop { position: fixed; inset: 0; z-index: 3000; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; padding: 16px; overflow-y: auto; }
        .enq-modal { display: flex; width: 100%; max-width: 980px; max-height: calc(100vh - 32px); background: #fff; border-radius: 28px; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,0.35); }
        .enq-photo { flex: 1 1 46%; position: relative; background: #064e3b; min-height: 360px; }
        .enq-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .enq-photo-fallback { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 36px; color: #fff; background: linear-gradient(160deg, #064e3b, #047857 60%, #10b981); }
        .enq-photo-fallback p { font-size: 34px; font-weight: 800; line-height: 1.15; margin: 0 0 10px; }
        .enq-photo-fallback span { font-size: 16px; opacity: 0.9; }
        .enq-body { flex: 1 1 54%; padding: 32px 36px 36px; overflow-y: auto; }
        .enq-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 22px; }
        .enq-head h2 { margin: 0; font-size: clamp(24px, 3vw, 32px); color: #0f172a; }
        .enq-close { width: 44px; height: 44px; border: none; background: none; font-size: 34px; line-height: 1; cursor: pointer; color: #0f172a; border-radius: 12px; }
        .enq-close:focus-visible, .enq-modal input:focus-visible, .enq-modal select:focus-visible, .enq-modal button:focus-visible { outline: 3px solid #10b981; outline-offset: 2px; }
        @media (max-width: 760px) {
          .enq-backdrop { align-items: flex-end; padding: 0; }
          .enq-modal { flex-direction: column; max-height: 94vh; border-radius: 24px 24px 0 0; }
          .enq-photo { flex: 0 0 120px; min-height: 120px; }
          .enq-photo-fallback { padding: 18px 22px; }
          .enq-photo-fallback p { font-size: 22px; margin: 0; }
          .enq-photo-fallback span { display: none; }
          .enq-body { padding: 20px 20px 28px; }
        }
      `}</style>
    </div>
  );
}
