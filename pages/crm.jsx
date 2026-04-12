import { useState, useRef, useCallback } from "react";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED = [
  { id: 1, name: "Pragya Chandrakar", age: 24, phone: "6263333632", email: "pragya@email.com", sharing: "Double", batch: "07 Dec 2024", status: "Confirmed", advance: 3000, total: 6500, followUp: "2024-12-01", notes: "Excited for Manali trip", tag: "Repeat" },
  { id: 2, name: "Raj Deshmukh", age: 28, phone: "9827304482", email: "raj@email.com", sharing: "Double", batch: "07 Dec 2024", status: "Pending", advance: 1500, total: 6500, followUp: "2024-12-02", notes: "Waiting for payment", tag: "New" },
  { id: 3, name: "Vamshi Manthati", age: 24, phone: "8179392940", email: "vamshi@email.com", sharing: "Quad", batch: "07 Dec 2024", status: "Confirmed", advance: 5000, total: 5500, followUp: "", notes: "Full payment done", tag: "VIP" },
  { id: 4, name: "Piyush Raygor", age: 21, phone: "9974655208", email: "piyush@email.com", sharing: "Quad", batch: "07 Dec 2024", status: "Pending", advance: 0, total: 5500, followUp: "2024-12-03", notes: "No advance yet", tag: "New" },
  { id: 5, name: "Harshita Malviya", age: 24, phone: "9424534714", email: "harshita@email.com", sharing: "Quad", batch: "14 Dec 2024", status: "Confirmed", advance: 6000, total: 6000, followUp: "", notes: "Fully paid", tag: "Repeat" },
  { id: 6, name: "Pranav Bhatnagar", age: 21, phone: "7982371968", email: "pranav@email.com", sharing: "Quad", batch: "14 Dec 2024", status: "Follow-up", advance: 2000, total: 6500, followUp: "2024-12-10", notes: "Call tomorrow", tag: "New" },
  { id: 7, name: "Bhavesh Joshi", age: 20, phone: "7987811026", email: "bhavesh@email.com", sharing: "Quad", batch: "14 Dec 2024", status: "Closed", advance: 0, total: 5500, followUp: "", notes: "Cancelled trip", tag: "Lost" },
  { id: 8, name: "Suraj Jain", age: 25, phone: "9986619282", email: "suraj@email.com", sharing: "Triple", batch: "21 Dec 2024", status: "Confirmed", advance: 7000, total: 7000, followUp: "", notes: "Full payment", tag: "VIP" },
  { id: 9, name: "Omdev Yadav", age: 24, phone: "7987106336", email: "omdev@email.com", sharing: "Quad", batch: "21 Dec 2024", status: "Pending", advance: 2500, total: 6000, followUp: "2024-12-15", notes: "Partial advance", tag: "New" },
  { id: 10, name: "Tushar Mehta", age: 26, phone: "7838983565", email: "tushar@email.com", sharing: "Quad", batch: "28 Dec 2024", status: "Confirmed", advance: 8000, total: 8000, followUp: "", notes: "Rafting add-on booked", tag: "VIP" },
];

const ITINERARY = `🏔️ *HUMSAFAR COMMUNITY — MANALI TRIP*
━━━━━━━━━━━━━━━━━━━━━━━

📅 *Day 1 — Departure*
🚌 Board AC Volvo from Bhopal
Night travel — Stay in bus

📅 *Day 2 — Manali Arrival*
🏨 Check-in Hotel | Freshen Up
🌊 Solang Valley | Snow Activities
🍽️ Dinner at hotel

📅 *Day 3 — Adventure Day*
🏔️ Rohtang Pass / Atal Tunnel
❄️ Snow Point | Sightseeing
🔥 Bonfire Night

📅 *Day 4 — Kasol / Return*
🌿 Kheerganga Trek option
🌙 Return bus departure

📅 *Day 5 — Back Home*
🏠 Reach Bhopal by morning

━━━━━━━━━━━━━━━━━━━━━━━
✅ *Inclusions:* Travel | Hotel | Meals
❌ *Exclusions:* Personal expenses
💰 *Amount:* ₹{amount}
📞 *Contact:* 9876543210
🌐 humsafarcommunity.com`;

const STATUS_CONFIG = {
  "Confirmed": { color: "#10b981", bg: "#d1fae5", icon: "✓" },
  "Pending":   { color: "#f59e0b", bg: "#fef3c7", icon: "⏳" },
  "Follow-up": { color: "#6366f1", bg: "#e0e7ff", icon: "📞" },
  "Closed":    { color: "#ef4444", bg: "#fee2e2", icon: "✗" },
};

const TAG_CONFIG = {
  "New":    { color: "#3b82f6", bg: "#dbeafe" },
  "Repeat": { color: "#8b5cf6", bg: "#ede9fe" },
  "VIP":    { color: "#f59e0b", bg: "#fef3c7" },
  "Lost":   { color: "#6b7280", bg: "#f3f4f6" },
};

let nextId = 11;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Badge = ({ label, config }) => (
  <span 
    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-opacity-20"
    style={{ color: config.color, background: config.bg, borderColor: `${config.color}22` }}
  >
    {config.icon && <span>{config.icon}</span>} {label}
  </span>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{label}</label>}
    <input 
      {...props} 
      className={`px-3 py-2 rounded-lg border-[1.5px] border-slate-200 text-sm bg-white outline-none transition-colors focus:border-indigo-500 ${props.className || ""}`}
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{label}</label>}
    <select 
      {...props} 
      className="px-3 py-2 rounded-lg border-[1.5px] border-slate-200 text-sm bg-white outline-none cursor-pointer"
    >
      {children}
    </select>
  </div>
);

const Btn = ({ children, variant="primary", size="md", onClick, className = "", style = {} }) => {
  const variants = {
    primary:  "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none",
    success:  "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none",
    danger:   "bg-gradient-to-br from-red-500 to-red-600 text-white border-none",
    ghost:    "bg-transparent text-slate-500 border-[1.5px] border-slate-200",
    whatsapp: "bg-gradient-to-br from-green-500 to-green-600 text-white border-none",
    email:    "bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none",
    call:     "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none",
  };
  const sizes = { 
    sm: "px-3 py-1.5 text-xs", 
    md: "px-4 py-2.5 text-sm", 
    lg: "px-7 py-3 text-base" 
  };
  
  return (
    <button 
      onClick={onClick} 
      className={`inline-flex items-center gap-1.5 rounded-lg font-bold cursor-pointer transition-opacity hover:opacity-90 ${variants[variant]} ${sizes[size]} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, width = 560 }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/55 z-[1000] flex items-center justify-center p-5" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-h-[90vh] overflow-auto shadow-2xl animate-in fade-in zoom-in duration-300" 
        style={{ maxWidth: width }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="m-0 text-lg font-extrabold text-slate-900">{title}</h3>
          <button onClick={onClose} className="bg-transparent border-none text-2xl cursor-pointer text-slate-400 leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  const bg = type === "success" ? "bg-emerald-500" : type === "error" ? "bg-red-500" : "bg-indigo-500";
  return (
    <div className={`fixed bottom-6 right-6 z-[2000] ${bg} text-white px-5 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2.5 animate-bounce-in`}>
      <span>{type === "success" ? "✓" : type === "error" ? "✗" : "ℹ"}</span>
      {msg}
      <button onClick={onClose} className="bg-transparent border-none text-white text-lg cursor-pointer ml-1">×</button>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function HumsafarCRM() {
  const [leads, setLeads] = useState(SEED);
  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBatch, setFilterBatch] = useState("All");
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null); // "add"|"bulk"|"detail"|"itinerary"|"bill"|"followup"
  const [toast, setToast] = useState(null);
  const [bulkPreview, setBulkPreview] = useState([]);
  const fileRef = useRef();

  const [form, setForm] = useState({ name:"", age:"", phone:"", email:"", sharing:"Double", batch:"", status:"Pending", advance:"", total:"", notes:"", tag:"New", followUp:"" });

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const batches = ["All", ...Array.from(new Set(leads.map(l => l.batch)))];
  const statuses = ["All", "Confirmed", "Pending", "Follow-up", "Closed"];

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.email?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || l.status === filterStatus;
    const matchBatch  = filterBatch  === "All" || l.batch  === filterBatch;
    return matchSearch && matchStatus && matchBatch;
  });

  // Stats
  const total = leads.length;
  const confirmed = leads.filter(l => l.status === "Confirmed").length;
  const pending = leads.filter(l => l.status === "Pending").length;
  const followUp = leads.filter(l => l.status === "Follow-up").length;
  const totalRevenue = leads.reduce((s, l) => s + (l.total || 0), 0);
  const collected = leads.reduce((s, l) => s + (l.advance || 0), 0);
  const balance = totalRevenue - collected;

  const addLead = () => {
    const lead = { ...form, id: nextId++, age: parseInt(form.age)||0, advance: parseFloat(form.advance)||0, total: parseFloat(form.total)||0 };
    setLeads(p => [lead, ...p]);
    setModal(null);
    setForm({ name:"", age:"", phone:"", email:"", sharing:"Double", batch:"", status:"Pending", advance:"", total:"", notes:"", tag:"New", followUp:"" });
    showToast(`${lead.name} added to CRM`);
  };

  const updateLead = (id, updates) => {
    setLeads(p => p.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLead = (id) => {
    setLeads(p => p.filter(l => l.id !== id));
    setModal(null);
    setSelected(null);
    showToast("Lead removed", "error");
  };

  // Bulk import via Excel/CSV simulation
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const rows = text.split("\n").filter(r => r.trim()).slice(1);
      const parsed = rows.map((row, i) => {
        const cols = row.split(",").map(c => c.trim().replace(/"/g,""));
        return {
          id: nextId++,
          name: cols[0] || `Client ${i+1}`,
          age: parseInt(cols[1]) || "",
          phone: cols[2] || "",
          email: cols[3] || "",
          sharing: cols[4] || "Double",
          batch: cols[5] || "TBD",
          status: cols[6] || "Pending",
          advance: parseFloat(cols[7]) || 0,
          total: parseFloat(cols[8]) || 0,
          notes: cols[9] || "",
          tag: cols[10] || "New",
          followUp: ""
        };
      }).filter(r => r.name);
      setBulkPreview(parsed);
    };
    reader.readAsText(file);
  };

  const confirmBulkImport = () => {
    setLeads(p => [...bulkPreview, ...p]);
    showToast(`${bulkPreview.length} leads imported!`);
    setBulkPreview([]);
    setModal(null);
  };

  const openWhatsApp = (lead) => {
    const msg = ITINERARY.replace("{amount}", `₹${lead.total?.toLocaleString()}`);
    const encoded = encodeURIComponent(msg);
    const phone = lead.phone?.replace(/\D/g, "");
    window.open(`https://wa.me/${phone.length > 10 ? phone : "91" + phone}?text=${encoded}`, "_blank");
    showToast(`Opening WhatsApp for ${lead.name}`);
  };

  const sendEmail = (lead) => {
    const sub = encodeURIComponent(`Booking Confirmation — Humsafar Community | ${lead.batch}`);
    const body = encodeURIComponent(`Dear ${lead.name},\n\nYour booking is confirmed for the ${lead.batch} batch.\n\nPackage: ₹${lead.total?.toLocaleString()}\nAdvance Paid: ₹${lead.advance?.toLocaleString()}\nBalance Due: ₹${(lead.total - lead.advance)?.toLocaleString()}\n\nThank you for choosing Humsafar Community!\n\nTeam Humsafar\nContact: 9876543210`);
    window.open(`mailto:${lead.email}?subject=${sub}&body=${body}`, "_blank");
    showToast(`Email client opened for ${lead.name}`);
  };

  const callLead = (lead) => {
    window.open(`tel:${lead.phone}`, "_blank");
    showToast(`Calling ${lead.name}...`);
  };

  // ── SIDEBAR ────────────────────────────────────────────────────────────────
  const navItems = [
    { id:"dashboard", icon:"⬡", label:"Dashboard" },
    { id:"leads",     icon:"👥", label:"All Leads" },
    { id:"followups", icon:"📞", label:"Follow-ups" },
    { id:"batches",   icon:"🗓️", label:"Batches" },
    { id:"payments",  icon:"💰", label:"Payments" },
  ];

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const StatCard = ({ label, value, sub, color, icon }) => (
    <div style={{ background:"#fff", borderRadius:16, padding:"20px 24px", boxShadow:"0 1px 4px rgba(0,0,0,.06)", borderLeft:`4px solid ${color}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div>
        <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>{label}</div>
        <div style={{ fontSize:28, fontWeight:900, color:"#0f172a", lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:12, color:"#64748b", marginTop:4 }}>{sub}</div>}
      </div>
      <div style={{ fontSize:32, opacity:.85 }}>{icon}</div>
    </div>
  );

  const renderDashboard = () => (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="m-0 text-3xl font-black text-slate-900">Good day, Humsafar 🏔️</h2>
          <p className="mt-1 text-slate-500 text-sm">Here&apos;s your travel business at a glance</p>
        </div>
        <div className="flex gap-2.5">
          <Btn onClick={() => setModal("add")} variant="primary">＋ Add Lead</Btn>
          <Btn onClick={() => setModal("bulk")} variant="ghost">📤 Bulk Import</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Leads" value={total} sub={`${confirmed} confirmed`} color="#6366f1" icon="👥" />
        <StatCard label="Confirmed" value={confirmed} sub={`${Math.round(confirmed/total*100)||0}% conversion`} color="#10b981" icon="✅" />
        <StatCard label="Pending" value={pending} sub="Need follow-up" color="#f59e0b" icon="⏳" />
        <StatCard label="Follow-ups" value={followUp} sub="Due today" color="#6366f1" icon="📞" />
        <StatCard label="Total Revenue" value={`₹${(totalRevenue/1000).toFixed(0)}K`} sub="Gross bookings" color="#059669" icon="💼" />
        <StatCard label="Collected" value={`₹${(collected/1000).toFixed(0)}K`} sub={`₹${(balance/1000).toFixed(0)}K pending`} color="#3b82f6" icon="💰" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent leads */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="font-extrabold text-base text-slate-900 mb-4">Recent Leads</div>
          <div className="divide-y divide-slate-50">
            {leads.slice(0,5).map(l => (
              <div key={l.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
                    {l.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-[13px] text-slate-900">{l.name}</div>
                    <div className="text-[11px] text-slate-400">{l.batch} • {l.sharing}</div>
                  </div>
                </div>
                <Badge label={l.status} config={STATUS_CONFIG[l.status]} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="font-extrabold text-base text-slate-900 mb-4">Quick Actions</div>
          <div className="flex flex-col gap-2.5">
            <button 
              onClick={() => setModal("add")} 
              className="p-4 rounded-xl border-[1.5px] border-dashed border-indigo-200 bg-indigo-50/50 text-indigo-600 font-bold cursor-pointer text-left text-sm transition-colors hover:bg-indigo-50"
            >
              ＋ Add New Lead Manually
            </button>
            <button 
              onClick={() => setModal("bulk")} 
              className="p-4 rounded-xl border-[1.5px] border-dashed border-emerald-200 bg-emerald-50/50 text-emerald-700 font-bold cursor-pointer text-left text-sm transition-colors hover:bg-emerald-50"
            >
              📤 Import from Excel / CSV
            </button>
            <button 
              onClick={() => setTab("followups")} 
              className="p-4 rounded-xl border-[1.5px] border-dashed border-amber-200 bg-amber-50/50 text-amber-700 font-bold cursor-pointer text-left text-sm transition-colors hover:bg-amber-50"
            >
              📞 View Pending Follow-ups ({followUp + pending})
            </button>
            <button 
              onClick={() => setTab("payments")} 
              className="p-4 rounded-xl border-[1.5px] border-dashed border-blue-200 bg-blue-50/50 text-blue-700 font-bold cursor-pointer text-left text-sm transition-colors hover:bg-blue-50"
            >
              💰 Check Payment Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── LEADS TABLE ────────────────────────────────────────────────────────────
  const renderLeads = () => (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <input 
            value={search} 
            onChange={e=>setSearch(e.target.value)} 
            placeholder="🔍  Search name, phone, email..." 
            className="px-4 py-2.5 rounded-xl border-[1.5px] border-slate-200 text-sm flex-1 min-w-[240px] outline-none transition-colors focus:border-indigo-500" 
          />
          <select 
            value={filterStatus} 
            onChange={e=>setFilterStatus(e.target.value)} 
            className="px-4 py-2.5 rounded-xl border-[1.5px] border-slate-200 text-sm bg-white cursor-pointer outline-none focus:border-indigo-500"
          >
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select 
            value={filterBatch} 
            onChange={e=>setFilterBatch(e.target.value)} 
            className="px-4 py-2.5 rounded-xl border-[1.5px] border-slate-200 text-sm bg-white cursor-pointer outline-none focus:border-indigo-500"
          >
            {batches.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <Btn onClick={() => setModal("add")} variant="primary" size="sm">＋ Add Lead</Btn>
          <Btn onClick={() => setModal("bulk")} variant="ghost" size="sm">📤 Import</Btn>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-slate-50/50">
                {["Name & Contact","Batch","Sharing","Status","Tag","Pkg (₹)","Adv (₹)","Bal (₹)","Actions"].map(h => (
                  <th key={h} className="px-5 py-4 text-left font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-bottom border-slate-100 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((l, i) => (
                <tr key={l.id} className="transition-colors hover:bg-indigo-50/30 group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0">{l.name[0]}</div>
                      <div>
                        <div className="font-bold text-slate-900">{l.name}</div>
                        <div className="text-[11px] text-slate-400">{l.phone} {l.email && `• ${l.email}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap font-medium">{l.batch}</td>
                  <td className="px-5 py-3.5 text-slate-500 font-medium">{l.sharing}</td>
                  <td className="px-5 py-3.5">
                    <select 
                      value={l.status} 
                      onChange={e => { updateLead(l.id, { status: e.target.value }); showToast(`Status updated`); }}
                      className="px-3 py-1 rounded-lg border font-bold text-[11px] cursor-pointer outline-none transition-shadow"
                      style={{ color: STATUS_CONFIG[l.status]?.color, background: STATUS_CONFIG[l.status]?.bg, borderColor: `${STATUS_CONFIG[l.status]?.color}44` }}
                    >
                      {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    {l.tag && <Badge label={l.tag} config={TAG_CONFIG[l.tag] || TAG_CONFIG["New"]} />}
                  </td>
                  <td className="px-5 py-3.5 text-slate-900 font-bold italic">₹{(l.total||0).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-emerald-600 font-bold italic">₹{(l.advance||0).toLocaleString()}</td>
                  <td className={`px-5 py-3.5 font-black italic ${ (l.total-l.advance)>0 ? "text-red-500" : "text-emerald-500" }`}>
                    ₹{((l.total||0)-(l.advance||0)).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="WhatsApp Itinerary" onClick={() => openWhatsApp(l)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border-none cursor-pointer hover:bg-emerald-100 transition-colors text-base">💬</button>
                      <button title="Send Email Bill" onClick={() => sendEmail(l)} className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border-none cursor-pointer hover:bg-amber-100 transition-colors text-base">📧</button>
                      <button title="Call" onClick={() => callLead(l)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border-none cursor-pointer hover:bg-blue-100 transition-colors text-base">📞</button>
                      <button title="View Details" onClick={() => { setSelected(l); setModal("detail"); }} className="p-1.5 rounded-lg bg-slate-100 text-slate-500 border-none cursor-pointer hover:bg-slate-200 transition-colors text-base">👁</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="p-12 text-center text-slate-400 text-base font-medium">No leads found. Try adjusting filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 bg-slate-50/30 border-t border-slate-50 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
          Showing {filtered.length} of {leads.length} leads
        </div>
      </div>
    </div>
  );

  // ── FOLLOW-UPS ─────────────────────────────────────────────────────────────
  const renderFollowUps = () => {
    const due = leads.filter(l => l.status === "Follow-up" || l.status === "Pending");
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="m-0 text-2xl font-black text-slate-900 tracking-tight">Follow-up Manager</h3>
          <p className="mt-1 text-slate-500 text-sm font-medium">{due.length} leads need attention</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {due.map(l => (
            <div key={l.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ background: STATUS_CONFIG[l.status]?.color }}></div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 mt-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm">
                    {l.name[0]}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm leading-tight">{l.name}</div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{l.batch}</div>
                  </div>
                </div>
                <Badge label={l.status} config={STATUS_CONFIG[l.status]} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
                <div className="text-[11px] text-slate-500 font-medium">Phone: <b className="text-slate-900 block mt-0.5">{l.phone}</b></div>
                <div className="text-[11px] text-slate-500 font-medium">Balance: <b className="text-red-500 block mt-0.5 font-black">₹{((l.total||0)-(l.advance||0)).toLocaleString()}</b></div>
                {l.followUp && <div className="text-[11px] text-slate-500 font-medium">Next: <b className="text-indigo-600 block mt-0.5">{l.followUp}</b></div>}
                <div className="text-[11px] text-slate-500 font-medium">Sharing: <b className="text-slate-900 block mt-0.5">{l.sharing}</b></div>
              </div>
              {l.notes && <div className="text-xs text-slate-500 mb-5 italic border-l-2 border-indigo-100 pl-3 leading-relaxed">&quot;{l.notes}&quot;</div>}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                <Btn size="sm" variant="whatsapp" onClick={() => openWhatsApp(l)}>💬 WhatsApp</Btn>
                <Btn size="sm" variant="call" onClick={() => callLead(l)}>📞 Call</Btn>
                <select 
                  value={l.status} 
                  onChange={e => { updateLead(l.id, { status: e.target.value }); showToast("Status updated!"); }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold cursor-pointer bg-white outline-none focus:border-indigo-500 transition-colors"
                >
                  {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
          {due.length === 0 && (
            <div className="col-span-full py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-5xl mb-4 grayscale opacity-30">🏔️</div>
              <div className="text-xl font-black text-slate-900">All caught up!</div>
              <div className="text-slate-400 font-medium mt-1">No pending follow-ups right now.</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── BATCHES ────────────────────────────────────────────────────────────────
  const renderBatches = () => {
    const batchMap = {};
    leads.forEach(l => { if (!batchMap[l.batch]) batchMap[l.batch] = []; batchMap[l.batch].push(l); });
    return (
      <div className="flex flex-col gap-6">
        <h3 className="m-0 text-2xl font-black text-slate-900 tracking-tight">Saturday Batches</h3>
        <div className="flex flex-col gap-6">
          {Object.entries(batchMap).sort().map(([batch, bLeads]) => {
            const conf = bLeads.filter(l => l.status === "Confirmed").length;
            const bTotal = bLeads.reduce((s,l) => s+(l.total||0),0);
            const bColl  = bLeads.reduce((s,l) => s+(l.advance||0),0);
            return (
              <div key={batch} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100/80">
                <div className="px-6 py-5 bg-slate-900 flex justify-between items-center text-white">
                  <div>
                    <div className="font-black text-lg flex items-center gap-2">
                       <span className="text-indigo-400">🗓️</span> {batch}
                    </div>
                    <div className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">{bLeads.length} clients • {conf} confirmed</div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-right">
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Revenue</div>
                      <div className="font-extrabold text-sm tracking-tight text-white italic">₹{bTotal.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Collected</div>
                      <div className="font-extrabold text-sm tracking-tight text-emerald-400 italic">₹{bColl.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Balance</div>
                      <div className="font-extrabold text-sm tracking-tight text-red-400 italic">₹{(bTotal-bColl).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-slate-50">
                  {bLeads.map(l => (
                    <div key={l.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">{l.name[0]}</div>
                        <div>
                          <div className="font-bold text-[13px] text-slate-800 leading-none">{l.name}</div>
                          <div className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">{l.phone} • {l.sharing}</div>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center">
                        <Badge label={l.status} config={STATUS_CONFIG[l.status]} />
                        <span className="text-[11px] text-red-500 font-bold italic mr-2">₹{((l.total||0)-(l.advance||0)).toLocaleString()} due</span>
                        <Btn size="sm" variant="whatsapp" onClick={() => openWhatsApp(l)}>💬 WA</Btn>
                        <Btn size="sm" variant="call" onClick={() => callLead(l)}>📞 Call</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── PAYMENTS ───────────────────────────────────────────────────────────────
  const renderPayments = () => (
    <div className="flex flex-col gap-6">
      <h3 className="m-0 text-2xl font-black text-slate-900 tracking-tight">Payment Tracker</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label:"Total Revenue", val:`₹${totalRevenue.toLocaleString()}`, color:"text-indigo-600", bg:"bg-indigo-50", icon:"💼" },
          { label:"Collected", val:`₹${collected.toLocaleString()}`, color:"text-emerald-600", bg:"bg-emerald-50", icon:"✅" },
          { label:"Outstanding", val:`₹${balance.toLocaleString()}`, color:"text-red-500", bg:"bg-red-50", icon:"⚠️" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 text-center hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center text-2xl mx-auto mb-4`}>{c.icon}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{c.label}</div>
            <div className={`text-2xl font-black italic tracking-tight ${c.color}`}>{c.val}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100/80 mt-2">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-slate-50/50">
                {["Client","Batch","Status","Package","Advance","Balance","Action"].map(h => (
                  <th key={h} className="px-6 py-4 text-left font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[...leads].sort((a,b) => (b.total-b.advance)-(a.total-a.advance)).map((l,i) => {
                const bal = (l.total||0) - (l.advance||0);
                return (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-800">{l.name}</td>
                    <td className="px-6 py-3.5 text-slate-500 font-medium">{l.batch}</td>
                    <td className="px-6 py-3.5"><Badge label={l.status} config={STATUS_CONFIG[l.status]} /></td>
                    <td className="px-6 py-3.5 font-bold italic text-slate-900">₹{(l.total||0).toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-emerald-600 font-black italic">₹{(l.advance||0).toLocaleString()}</td>
                    <td className={`px-6 py-3.5 font-black italic ${bal>0?"text-red-500":"text-emerald-500"}`}>₹{bal.toLocaleString()}</td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Btn size="sm" variant="email" onClick={() => sendEmail(l)}>📧 Bill</Btn>
                        <Btn size="sm" variant="whatsapp" onClick={() => openWhatsApp(l)}>💬 WA</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ─── CONTENT ROUTER ────────────────────────────────────────────────────────
  const renderContent = () => {
    if (tab === "dashboard") return renderDashboard();
    if (tab === "leads")     return renderLeads();
    if (tab === "followups") return renderFollowUps();
    if (tab === "batches")   return renderBatches();
    if (tab === "payments")  return renderPayments();
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',system-ui,sans-serif]">
      {/* SIDEBAR */}
      <div className="w-[240px] bg-slate-900 flex flex-col flex-shrink-0 h-screen">
        <div className="p-6 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-indigo-500/20">🏔️</div>
            <div>
              <div className="text-white font-black text-sm leading-none">Humsafar</div>
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Community CRM</div>
            </div>
          </div>
        </div>

        <div className="px-3 flex-1 overflow-y-auto mt-2">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setTab(item.id)} 
              className={`w-full px-4 py-2.5 rounded-xl border-none font-bold text-sm cursor-pointer text-left flex items-center gap-3 mb-1 transition-all
                ${tab === item.id 
                  ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
            >
              <span className="text-lg opacity-80">{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/30">
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Leads</div>
            <div className="text-white text-2xl font-black mt-0.5">{leads.length}</div>
            <div className="text-emerald-500 text-[11px] font-bold mt-1 flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
               {confirmed} confirmed
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-auto p-8 lg:p-10">
        {renderContent()}
      </div>

      {/* ── MODAL: Add Lead ────────────────────────────────────────────────── */}
      <Modal open={modal==="add"} onClose={() => setModal(null)} title="➕ Add New Lead">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name *" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="e.g. Rahul Sharma" />
          <Input label="Age" value={form.age} onChange={e=>setForm({...form, age:e.target.value})} placeholder="e.g. 24" type="number" />
          <Input label="WhatsApp Number *" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="10-digit mobile" />
          <Input label="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="email@example.com" />
          <Select label="Room Sharing" value={form.sharing} onChange={e=>setForm({...form, sharing:e.target.value})}>
            {["Single","Double","Triple","Quad","5+ Sharing"].map(s=><option key={s}>{s}</option>)}
          </Select>
          <Input label="Batch Date" value={form.batch} onChange={e=>setForm({...form, batch:e.target.value})} placeholder="e.g. 07 Dec 2024" />
          <Select label="Status" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
            {Object.keys(STATUS_CONFIG).map(s=><option key={s}>{s}</option>)}
          </Select>
          <Select label="Tag" value={form.tag} onChange={e=>setForm({...form, tag:e.target.value})}>
            {Object.keys(TAG_CONFIG).map(t=><option key={t}>{t}</option>)}
          </Select>
          <Input label="Total Package (₹)" value={form.total} onChange={e=>setForm({...form, total:e.target.value})} placeholder="e.g. 6500" type="number" />
          <Input label="Advance Paid (₹)" value={form.advance} onChange={e=>setForm({...form, advance:e.target.value})} placeholder="e.g. 2000" type="number" />
          <Input label="Follow-up Date" value={form.followUp} onChange={e=>setForm({...form, followUp:e.target.value})} type="date" />
          <div className="hidden sm:block" />
          <div className="sm:col-span-2">
            <Input label="Notes / Remarks" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder="Any special requests or notes..." />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-slate-100">
          <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
          <Btn variant="primary" onClick={addLead} className={form.name && form.phone ? "opacity-100" : "opacity-40 pointer-events-none"}>
            ＋ Add Lead
          </Btn>
        </div>
      </Modal>

      {/* ── MODAL: Bulk Import ─────────────────────────────────────────────── */}
      <Modal open={modal==="bulk"} onClose={() => { setModal(null); setBulkPreview([]); }} title="📤 Bulk Import via Excel / CSV" width={680}>
        <div className="bg-slate-50 rounded-xl p-5 mb-5 border-2 border-dashed border-slate-200">
          <p className="m-0 mb-3 font-bold text-sm text-slate-900">CSV Format (column order):</p>
          <code className="text-xs text-indigo-600 font-mono bg-indigo-50 px-2 py-1.5 rounded-md block leading-relaxed shadow-sm">
            Name, Age, Phone, Email, Sharing, Batch, Status, Advance, Total, Notes, Tag
          </code>
          <p className="m-0 mt-3 text-xs text-slate-500 leading-relaxed italic">Export your Excel as CSV and upload below. First row should be headers and will be skipped.</p>
        </div>

        <div 
          className="border-2 border-dashed border-indigo-500 rounded-2xl p-10 text-center bg-indigo-50/30 cursor-pointer mb-5 transition-colors hover:bg-indigo-50/50"
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-5xl mb-3">📂</div>
          <div className="font-black text-lg text-indigo-600">Click to upload CSV / Excel</div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">.csv files only (export from Excel first)</div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </div>

        {bulkPreview.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-400">
            <div className="font-bold text-sm text-emerald-600 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">✓</span>
              {bulkPreview.length} records ready to import:
            </div>
            <div className="max-h-[220px] overflow-y-auto bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-inner">
              {bulkPreview.slice(0,10).map((l, i) => (
                <div key={i} className="flex gap-3 px-4 py-2.5 text-xs">
                  <span className="font-bold text-slate-800 flex-1">{l.name}</span>
                  <span className="text-slate-500 font-medium font-mono">{l.phone}</span>
                  <span className="text-slate-400">{l.batch}</span>
                  <Badge label={l.status} config={STATUS_CONFIG[l.status] || STATUS_CONFIG["Pending"]} />
                </div>
              ))}
              {bulkPreview.length > 10 && <div className="p-3 text-center text-[11px] text-slate-400 font-bold bg-white/50 border-t border-slate-100">...and {bulkPreview.length-10} more</div>}
            </div>
            <div className="flex gap-3 justify-end mt-5 pt-4 border-t border-slate-100">
              <Btn variant="ghost" onClick={() => setBulkPreview([])}>Clear</Btn>
              <Btn variant="success" onClick={confirmBulkImport}>✓ Import {bulkPreview.length} Leads</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* ── MODAL: Lead Detail ─────────────────────────────────────────────── */}
      <Modal open={modal==="detail" && !!selected} onClose={() => { setModal(null); setSelected(null); }} title={`👤 ${selected?.name}`} width={640}>
        {selected && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {[
                ["Age", selected.age],
                ["Phone", selected.phone],
                ["Email", selected.email || "—"],
                ["Batch", selected.batch],
                ["Sharing", selected.sharing],
                ["Tag", selected.tag],
                ["Total Pkg", `₹${(selected.total||0).toLocaleString()}`],
                ["Advance Paid", `₹${(selected.advance||0).toLocaleString()}`],
                ["Balance Due", `₹${((selected.total||0)-(selected.advance||0)).toLocaleString()}`],
                ["Follow-up", selected.followUp || "—"],
              ].map(([k,v]) => (
                <div key={k} className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/50">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{k}</div>
                  <div className="text-[13px] font-extrabold text-slate-900 mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Lead Status</div>
              <select 
                value={selected.status} 
                onChange={e => { const s = e.target.value; updateLead(selected.id, { status:s }); setSelected({...selected, status:s}); showToast("Status updated"); }}
                className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-slate-200 text-sm font-bold cursor-pointer outline-none focus:border-indigo-500 transition-colors"
                style={{ color: STATUS_CONFIG[selected.status]?.color, background: STATUS_CONFIG[selected.status]?.bg, borderColor: `${STATUS_CONFIG[selected.status]?.color}44` }}
              >
                {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {selected.notes && (
              <div className="bg-amber-50/50 rounded-xl p-4 mb-6 border border-amber-100/50 text-sm text-amber-900 leading-relaxed shadow-sm">
                <span className="font-bold text-amber-800 flex items-center gap-1.5 mb-1.5 uppercase text-[10px] tracking-widest">📝 Remarks</span>
                {selected.notes}
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100">
              <Btn variant="whatsapp" onClick={() => openWhatsApp(selected)}>💬 WhatsApp Itinerary</Btn>
              <Btn variant="email" onClick={() => sendEmail(selected)}>📧 Send Bill on Email</Btn>
              <Btn variant="call" onClick={() => callLead(selected)}>📞 Call Now</Btn>
              <Btn variant="danger" size="sm" onClick={() => deleteLead(selected.id)} className="ml-auto">🗑 Remove</Btn>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
