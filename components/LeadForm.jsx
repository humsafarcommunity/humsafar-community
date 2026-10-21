import { useState } from "react";
import { waLink, track } from "../lib/whatsapp";

// Short callback form. The enquiry is saved first (see pages/api/lead.js), then the visitor gets a
// WhatsApp button with their details filled in, so a lead is kept even if they never open WhatsApp.
const MONTHS = ["Not sure yet", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CITIES = ["Mumbai", "Pune", "Bangalore", "Hyderabad", "Ahmedabad", "Delhi", "Gwalior", "Chennai", "Kolkata", "Jaipur"];

export default function LeadForm({ site, source, trip, title = "Get a callback", intro = "Leave your number and we will message you on WhatsApp with dates, price and seats." }) {
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);

  const field = { width: "100%", minHeight: 48, padding: "0 14px", borderRadius: 14, border: "1.5px solid #cbd5e1", background: "#fff", fontSize: 16, fontFamily: "var(--sans)", color: "#0f172a", boxSizing: "border-box" };
  const label = { display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 };

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const f = Object.fromEntries(new FormData(e.target).entries());
    const digits = String(f.phone || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setStatus("sending");
    const payload = { ...f, phone: digits, trip: trip || "", page: source || "" };
    try {
      await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } catch (err) {
      /* the WhatsApp step below still reaches us */
    }
    track("generate_lead", { event_label: source || "", value: 1 });
    setSummary(payload);
    setStatus("done");
  }

  if (status === "done" && summary) {
    const text = `Hi Humsafar! I am ${summary.name}.\nI want to know about ${trip || "your trips"}.\n👥 People: ${summary.people || "-"}\n📅 Month: ${summary.travelMonth || "-"}\n🏙️ Travelling from: ${summary.fromCity || "-"}\n📞 ${summary.phone}`;
    return (
      <div role="status" style={{ background: "#f0fdf4", border: "2px solid #064e3b", borderRadius: 28, padding: "28px 24px", textAlign: "center" }}>
        <h3 style={{ fontSize: 22, color: "#064e3b", marginBottom: 8 }}>Thank you, {summary.name}</h3>
        <p style={{ color: "#334155", lineHeight: 1.7, marginBottom: 18 }}>We have your number. To get the fastest reply, send us this message on WhatsApp.</p>
        <a
          href={waLink(site, text, source)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { event_label: "After lead form" })}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 52, padding: "0 28px", borderRadius: 999, background: "#10b981", color: "#fff", fontWeight: 800, textDecoration: "none" }}
        >
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ background: "#fff", border: "2px solid #064e3b", borderRadius: 28, padding: "clamp(20px, 4vw, 32px)" }}>
      <h3 style={{ fontSize: "clamp(22px, 4vw, 26px)", color: "#0f172a", marginBottom: 6 }}>{title}</h3>
      <p style={{ color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>{intro}</p>

      {/* Hidden from people; bots tend to fill it in */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 14 }}>
        <div>
          <label htmlFor="lf-name" style={label}>Your name</label>
          <input id="lf-name" name="name" required maxLength={80} autoComplete="name" style={field} />
        </div>
        <div>
          <label htmlFor="lf-phone" style={label}>Mobile number</label>
          <input id="lf-phone" name="phone" required type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit WhatsApp number" style={field} />
        </div>
        <div>
          <label htmlFor="lf-city" style={label}>Travelling from</label>
          <input id="lf-city" name="fromCity" list="lf-cities" maxLength={60} autoComplete="address-level2" style={field} />
          <datalist id="lf-cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
        <div>
          <label htmlFor="lf-month" style={label}>When do you want to go?</label>
          <select id="lf-month" name="travelMonth" defaultValue="Not sure yet" style={field}>
            {MONTHS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="lf-people" style={label}>How many people?</label>
          <select id="lf-people" name="people" defaultValue="2" style={field}>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {error && <p role="alert" style={{ color: "#b91c1c", marginTop: 14, fontWeight: 600 }}>{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        style={{ marginTop: 20, width: "100%", minHeight: 54, borderRadius: 999, border: "none", background: "#064e3b", color: "#fff", fontSize: 16, fontWeight: 800, cursor: status === "sending" ? "wait" : "pointer", fontFamily: "var(--sans)" }}
      >
        {status === "sending" ? "Sending..." : "Request a callback"}
      </button>
      <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 10 }}>No payment needed. We only use your number to reply about your trip.</p>
    </form>
  );
}
