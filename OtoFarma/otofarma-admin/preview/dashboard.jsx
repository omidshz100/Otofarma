/* eslint-disable */
const { useState, useMemo } = React;

// ---------- Icons (inline SVG) ----------
const I = {
  search: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  filter: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 5h18l-7 9v6l-4-2v-4z"/></svg>,
  bell: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>,
  activity: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>,
  users: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  clipboard: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/></svg>,
  video: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="6" width="14" height="12" rx="2"/><path d="m17 10 4-2v8l-4-2z"/></svg>,
  building: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01"/></svg>,
  settings: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.3l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.2.6.7 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>,
  help: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4"/><path d="M12 17h.01"/></svg>,
  logout: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>,
  calendar: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  phone: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7a2 2 0 0 1 1.72 2.03Z"/></svg>,
  mail: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>,
  pin: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  shield: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>,
  stethoscope: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 4v6a5 5 0 0 0 10 0V4"/><path d="M8 15v3a4 4 0 0 0 8 0v-3"/><circle cx="20" cy="10" r="2"/></svg>,
  battery: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/><path d="M6 10v4M10 10v4M14 10v4"/></svg>,
  wrench: (p) => <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14.7 6.3a4 4 0 1 0 5 5L21 13l-9 9-6-6 9-9z"/></svg>,
  fileDown: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 12v6"/><path d="m9 15 3 3 3-3"/></svg>,
  msg: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 1 1 16.1-3.8z"/></svg>,
  cal2: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/></svg>,
  dots: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>,
  chevron: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m9 18 6-6-6-6"/></svg>,
  arrow: (p) => <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m12 5 7 7-7 7M5 12h14"/></svg>,
};

// ---------- Mock data ----------
const PATIENTS = [
  { id: "p-1042", first: "Elena", last: "Conti", age: 69, city: "Napoli", phone: "+39 081 555 0142", email: "elena.conti@example.it", insurance: "SSN — ASL Napoli 1", dob: "14 Mar 1957", color: "#0EA5A8", initials: "EC", doc: "Dr. M. Ricci", status: "follow-up", tags: ["Bilateral", "Presbycusis"], lastVisit: "4 May", classification: "moderate" },
  { id: "p-1058", first: "Giovanni", last: "Bianchi", age: 74, city: "Roma", phone: "+39 06 555 0203", email: "g.bianchi@example.it", color: "#1F7A8C", initials: "GB", doc: "Dr. A. Greco", status: "active", tags: ["Right", "Tinnitus"], lastVisit: "11 May", classification: "mild" },
  { id: "p-1061", first: "Sofia", last: "Romano", age: 58, city: "Milano", phone: "+39 02 555 0388", email: "s.romano@example.it", color: "#7C3AED", initials: "SR", doc: "Dr. L. Marino", status: "new", tags: ["Left", "Otosclerosis"], lastVisit: "15 May", classification: "mild" },
  { id: "p-1064", first: "Marco", last: "Galli", age: 81, city: "Torino", phone: "+39 011 555 0124", email: "m.galli@example.it", color: "#DC6803", initials: "MG", doc: "Dr. M. Ricci", status: "follow-up", tags: ["Bilateral"], lastVisit: "3 May", classification: "severe" },
  { id: "p-1077", first: "Lucia", last: "Esposito", age: 63, city: "Napoli", phone: "+39 081 555 0411", email: "l.esposito@example.it", color: "#0369A1", initials: "LE", doc: "Dr. M. Ricci", status: "active", tags: ["Right"], lastVisit: "9 May", classification: "moderate" },
  { id: "p-1083", first: "Antonio", last: "Russo", age: 70, city: "Bari", phone: "+39 080 555 0166", email: "a.russo@example.it", color: "#15803D", initials: "AR", doc: "Dr. A. Greco", status: "discharged", tags: ["Bilateral"], lastVisit: "12 Apr", classification: "moderate" },
  { id: "p-1091", first: "Francesca", last: "Bruno", age: 52, city: "Firenze", phone: "+39 055 555 0118", email: "f.bruno@example.it", color: "#BE185D", initials: "FB", doc: "Dr. L. Marino", status: "new", tags: ["Left"], lastVisit: "16 May", classification: "mild" },
  { id: "p-1099", first: "Paolo", last: "Ferrari", age: 77, city: "Genova", phone: "+39 010 555 0179", email: "p.ferrari@example.it", color: "#0E7490", initials: "PF", doc: "Dr. M. Ricci", status: "active", tags: ["Bilateral"], lastVisit: "8 May", classification: "moderately-severe" },
];

const TEST_LATEST = {
  date: "4 May 2026",
  performedBy: "Dr. M. Ricci",
  left:  [{f:250,db:25},{f:500,db:30},{f:1000,db:40},{f:2000,db:50},{f:4000,db:60},{f:8000,db:65}],
  right: [{f:250,db:20},{f:500,db:25},{f:1000,db:35},{f:2000,db:45},{f:4000,db:55},{f:8000,db:60}],
};

const TEST_HISTORY = [
  { id:"t-2201", date:"04/05/2026", loc:"OtoFarma Napoli Centro", doc:"Dr. M. Ricci", ptaL:45, ptaR:40, cls:"moderate", change:"+3 dB" },
  { id:"t-2150", date:"10/02/2026", loc:"OtoFarma Napoli Centro", doc:"Dr. M. Ricci", ptaL:41, ptaR:36, cls:"moderate", change:"+5 dB" },
  { id:"t-2090", date:"18/10/2025", loc:"OtoFarma Roma Trastevere", doc:"Dr. A. Greco", ptaL:34, ptaR:29, cls:"mild", change:"+2 dB" },
  { id:"t-2011", date:"22/05/2025", loc:"OtoFarma Napoli Centro", doc:"Dr. M. Ricci", ptaL:32, ptaR:28, cls:"mild", change:"baseline" },
];

const AIDS = [
  { id:"a-501", model:"OF Lyra RIC-312", ear:"Bilateral", serial:"OF-24-001-4421", fitted:"22 Mar 2026", status:"active", battery:72, usage:"11.2 h/day" },
];

const APPTS = [
  { id:"ap-9003", type:"video", title:"Fitting follow-up", with:"Dr. M. Ricci", when:"Fri 22 May · 10:30", status:"scheduled" },
  { id:"ap-9002", type:"in-person", title:"Real-ear measurement", with:"Dr. M. Ricci", when:"Tue 09 Jun · 14:00", status:"scheduled" },
  { id:"ap-9001", type:"in-person", title:"Audiometric exam + impression", with:"Dr. M. Ricci", when:"Mon 04 May · 15:00", status:"completed" },
  { id:"ap-9000", type:"phone", title:"Pre-screening call", with:"L. Romano (RN)", when:"Wed 16 Apr · 11:15", status:"completed" },
];

const NOTES = [
  { id:"n-2", at:"04 May 2026", author:"Dr. M. Ricci", body:"Patient reports improved speech-in-noise but mild occlusion. Adjust vent size at next fitting and re-run real-ear measurement to confirm targets." },
  { id:"n-1", at:"22 Mar 2026", author:"Dr. M. Ricci", body:"Initial fitting completed. Patient counselled on adaptation timeline (3–4 weeks). Telehealth follow-up scheduled at 4 weeks." },
];

// ---------- Helpers ----------
const cn = (...a) => a.filter(Boolean).join(" ");

// ---------- Layout ----------
function App() {
  const [sel, setSel] = useState("p-1042");
  const patient = PATIENTS.find(p => p.id === sel);
  return (
    <div className="flex h-screen min-h-0 bg-clinical-bg">
      <Sidebar/>
      <div className="grid h-full min-w-0 flex-1 grid-cols-[320px_minmax(0,1fr)]">
        <PatientListPanel selectedId={sel} onSelect={setSel}/>
        <PatientPage patient={patient}/>
      </div>
    </div>
  );
}

function Sidebar() {
  const primary = [
    { Icon:I.activity, label:"Overview" },
    { Icon:I.users, label:"Patients", active:true, badge:"248" },
    { Icon:I.clipboard, label:"Orders", badge:"12" },
    { Icon:I.video, label:"Video calls", badge:"4" },
    { Icon:I.building, label:"Pharmacies" },
  ];
  const secondary = [
    { Icon:I.settings, label:"Settings" },
    { Icon:I.help, label:"Help & docs" },
  ];
  const Item = ({ Icon, label, active, badge }) => (
    <a className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition cursor-pointer",
      active ? "bg-clinical-ink text-white" : "text-clinical-muted hover:bg-clinical-bg hover:text-clinical-ink")}>
      <Icon/>
      <span className="flex-1">{label}</span>
      {badge && <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] num", active ? "bg-white/15 text-white" : "bg-clinical-bg text-clinical-muted")}>{badge}</span>}
    </a>
  );
  return (
    <aside className="flex h-full w-[232px] shrink-0 flex-col border-r border-clinical-border bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-clinical-ink">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <path d="M6 12a6 6 0 0 1 12 0v3a4 4 0 0 1-4 4h-1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="9" cy="14" r="1.6" fill="#0EA5A8"/>
            <path d="M3 13c0-1 1-2 2-2" stroke="#0EA5A8" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight text-clinical-ink">OtoFarma</div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-clinical-muted">Clinician suite</div>
        </div>
      </div>

      <div className="px-3">
        <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.08em] text-clinical-muted">Workspace</div>
        <nav className="space-y-0.5">{primary.map(it => <Item key={it.label} {...it}/>)}</nav>
      </div>
      <div className="mt-5 px-3">
        <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.08em] text-clinical-muted">System</div>
        <nav className="space-y-0.5">{secondary.map(it => <Item key={it.label} {...it}/>)}</nav>
      </div>

      <div className="mx-3 mt-6 rounded-xl border border-clinical-border bg-clinical-bg p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-clinical-muted">Clinic load</span>
          <span className="num text-[10px] text-clinical-ink">today</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="num text-xl font-semibold text-clinical-ink">14</span>
          <span className="text-xs text-clinical-muted">/ 18 slots</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-clinical-accent" style={{width:"78%"}}/>
        </div>
        <div className="mt-2 text-[11px] text-clinical-muted">4 video, 8 in-person, 2 phone</div>
      </div>

      <div className="mt-auto border-t border-clinical-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-clinical-accent to-sky-600 text-xs font-semibold text-white">MR</div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[13px] font-medium text-clinical-ink">Dr. Marco Ricci</div>
            <div className="truncate text-[10px] text-clinical-muted">Audiologist · Napoli</div>
          </div>
          <button className="text-clinical-muted hover:text-clinical-ink"><I.logout/></button>
        </div>
      </div>
    </aside>
  );
}

const STATUS_DOT = {
  active: "bg-emerald-500",
  "follow-up": "bg-clinical-accent",
  new: "bg-sky-500",
  discharged: "bg-zinc-400",
};
const STATUS_LABEL = {
  active: "Active",
  "follow-up": "Follow-up",
  new: "New",
  discharged: "Discharged",
};

function PatientListPanel({ selectedId, onSelect }) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const filtered = useMemo(() => PATIENTS.filter(p => {
    if (tab !== "all" && p.status !== tab) return false;
    if (!q) return true;
    const s = `${p.first} ${p.last} ${p.id} ${p.city}`.toLowerCase();
    return s.includes(q.toLowerCase());
  }), [q, tab]);
  return (
    <aside className="flex h-full flex-col border-r border-clinical-border bg-white">
      <div className="border-b border-clinical-border px-5 pt-5 pb-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight text-clinical-ink">Patients</h2>
          <span className="num text-xs text-clinical-muted">{PATIENTS.length} of 248</span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-clinical-border bg-clinical-bg px-3 py-2">
          <I.search className="text-clinical-muted"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, ID, phone…" className="w-full bg-transparent text-sm outline-none placeholder:text-clinical-soft"/>
          <button className="text-clinical-muted hover:text-clinical-ink"><I.filter/></button>
        </div>
        <div className="mt-3 flex gap-1 text-xs">
          {["all","active","follow-up","new"].map(t => (
            <button key={t} onClick={()=>setTab(t)}
              className={cn("rounded-md px-2.5 py-1 font-medium capitalize",
                tab===t ? "bg-clinical-ink text-white" : "text-clinical-muted hover:text-clinical-ink")}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <ul className="nice-scroll flex-1 overflow-y-auto py-1">
        {filtered.map(p => {
          const active = p.id === selectedId;
          return (
            <li key={p.id}>
              <button onClick={()=>onSelect(p.id)}
                className={cn("flex w-full items-center gap-3 border-l-2 px-5 py-3 text-left transition",
                  active ? "border-clinical-accent bg-clinical-accent/5" : "border-transparent hover:bg-clinical-bg")}>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white" style={{background:p.color}}>{p.initials}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="truncate text-sm font-medium text-clinical-ink">{p.first} {p.last}</div>
                    <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[p.status])}/>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-clinical-muted">
                    <span className="num">{p.id}</span>
                    <span>·</span>
                    <span className="truncate">{p.age} yrs · {p.city}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-clinical-soft">Last visit · {p.lastVisit}</span>
                    <span className="text-[10px] font-medium text-clinical-muted">{STATUS_LABEL[p.status]}</span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

// ---------- Right side: patient page ----------
function PatientPage({ patient }) {
  return (
    <main className="nice-scroll flex h-full min-w-0 flex-col overflow-y-auto">
      <PageHeader patient={patient}/>
      <div className="grid grid-cols-12 gap-6 p-7">
        <section className="col-span-12 space-y-6 xl:col-span-8">
          <ProfileCard patient={patient}/>
          <StatRow/>
          <AudiogramCard test={TEST_LATEST}/>
          <HistoryCard/>
        </section>
        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <AidStatusCard/>
          <AppointmentsCard/>
          <NotesCard/>
        </aside>
      </div>
    </main>
  );
}

function PageHeader({ patient }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-clinical-border bg-white/95 px-8 py-5 backdrop-blur">
      <div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-clinical-muted">
          <span>Patients</span>
          <I.chevron/>
          <span className="num">{patient.id}</span>
        </div>
        <div className="mt-1 flex items-baseline gap-3">
          <h1 className="text-[26px] font-semibold tracking-tight text-clinical-ink">{patient.first} {patient.last}</h1>
          <span className="num text-sm text-clinical-muted">{patient.age} yrs · ♀</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-clinical-accent/10 px-2 py-0.5 text-[11px] font-medium text-clinical-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-clinical-accent"/>Follow-up due
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Btn variant="ghost" icon={<I.fileDown/>}>Export record</Btn>
        <Btn variant="ghost" icon={<I.msg/>}>Message</Btn>
        <Btn variant="secondary" icon={<I.cal2/>}>Schedule visit</Btn>
        <Btn variant="primary" icon={<I.video/>}>Start video call</Btn>
      </div>
    </header>
  );
}

function Btn({ variant="secondary", icon, children, className }) {
  const V = {
    primary: "bg-clinical-ink text-white hover:bg-black border-clinical-ink",
    secondary: "bg-white text-clinical-ink border-clinical-border hover:bg-clinical-bg",
    ghost: "bg-transparent text-clinical-muted border-transparent hover:text-clinical-ink hover:bg-clinical-bg",
  }[variant];
  return (
    <button className={cn("inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-medium transition", V, className)}>
      {icon}<span>{children}</span>
    </button>
  );
}

function Card({ title, subtitle, actions, children, className, bodyClassName }) {
  return (
    <section className={cn("rounded-xl border border-clinical-border bg-white shadow-card", className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-clinical-border px-5 py-4">
          <div>
            {title && <h3 className="text-[14px] font-semibold tracking-tight text-clinical-ink">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-clinical-muted">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

function ProfileCard({ patient }) {
  const Field = ({ icon, label, children }) => (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-clinical-muted">
        {icon}<span>{label}</span>
      </div>
      <div className="mt-0.5 truncate text-[13px] text-clinical-ink">{children}</div>
    </div>
  );
  return (
    <section className="overflow-hidden rounded-xl border border-clinical-border bg-white shadow-card">
      <div className="flex gap-5 p-5">
        <div className="grid h-[88px] w-[88px] shrink-0 place-items-center rounded-2xl text-[26px] font-semibold text-white" style={{background:patient.color}}>{patient.initials}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {patient.tags.map(t => (
              <span key={t} className="rounded-full border border-clinical-border bg-clinical-bg px-2 py-0.5 text-[11px] font-medium text-clinical-muted">{t}</span>
            ))}
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">Moderate loss</span>
            <span className="ml-auto text-[11px] text-clinical-muted">Patient since <span className="num text-clinical-ink">May 2025</span></span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-x-6 gap-y-3">
            <Field icon={<I.calendar/>} label="Date of birth">{patient.dob} <span className="text-clinical-muted">· {patient.age} yrs</span></Field>
            <Field icon={<I.pin/>} label="City">{patient.city}, IT</Field>
            <Field icon={<I.stethoscope/>} label="Primary clinician">{patient.doc}</Field>
            <Field icon={<I.phone/>} label="Phone"><span className="num">{patient.phone}</span></Field>
            <Field icon={<I.mail/>} label="Email">{patient.email}</Field>
            <Field icon={<I.shield/>} label="Coverage">{patient.insurance}</Field>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatRow() {
  const items = [
    { label:"Pure-tone avg.", value:"41", unit:"dB HL", trend:"+3 vs Feb", tone:"warn", spark:[28,30,32,34,36,38,41] },
    { label:"Aid usage",       value:"11.2", unit:"h/day", trend:"+0.8 vs last wk", tone:"good", spark:[8,9,9.5,10,10.5,10.8,11.2] },
    { label:"Last test",       value:"14", unit:"days ago", trend:"2026-05-04", tone:"neutral", spark:null },
    { label:"Open orders",     value:"1", unit:"in production", trend:"ETA 28 May", tone:"info", spark:null },
  ];
  const TONE = { neutral:"text-clinical-muted", good:"text-emerald-600", warn:"text-amber-600", bad:"text-rose-600", info:"text-clinical-accent" };
  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map(it => (
        <div key={it.label} className="rounded-xl border border-clinical-border bg-white p-4 shadow-card">
          <div className="flex items-start justify-between">
            <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-clinical-muted">{it.label}</div>
            {it.spark && <Sparkline data={it.spark}/>}
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="num text-[28px] font-semibold leading-none tracking-tight text-clinical-ink">{it.value}</span>
            <span className="text-[11px] font-medium text-clinical-muted">{it.unit}</span>
          </div>
          <div className={cn("mt-1.5 text-[11px] font-medium", TONE[it.tone])}>{it.trend}</div>
        </div>
      ))}
    </div>
  );
}

function Sparkline({ data }) {
  const w=64,h=22,pad=2;
  const min=Math.min(...data), max=Math.max(...data);
  const x = i => pad + (i*(w-pad*2))/(data.length-1);
  const y = v => pad + (h-pad*2) - ((v-min)/Math.max(0.0001,(max-min)))*(h-pad*2);
  const d = data.map((v,i)=>`${i===0?"M":"L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={d} fill="none" stroke="#0EA5A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={x(data.length-1)} cy={y(data[data.length-1])} r="2" fill="#0EA5A8"/>
    </svg>
  );
}

function AudiogramCard({ test }) {
  const FREQS=[250,500,1000,2000,4000,8000];
  const DB_MIN=-10, DB_MAX=90;
  const W=720,H=340,PAD_L=56,PAD_R=24,PAD_T=24,PAD_B=42;
  const iW=W-PAD_L-PAD_R, iH=H-PAD_T-PAD_B;
  const xFor=i=>PAD_L+(iW*i)/(FREQS.length-1);
  const yFor=db=>PAD_T+((db-DB_MIN)/(DB_MAX-DB_MIN))*iH;
  const bands=[
    {from:-10,to:25,label:"Normal",color:"#ECFEF4"},
    {from:25,to:40,label:"Mild",color:"#FEF7E6"},
    {from:40,to:55,label:"Moderate",color:"#FDECD7"},
    {from:55,to:70,label:"Mod-severe",color:"#FBDDD0"},
    {from:70,to:90,label:"Severe",color:"#F6CFCF"},
  ];
  const path = pts => pts.map((p,i)=>`${i===0?"M":"L"}${xFor(i)},${yFor(p.db)}`).join(" ");
  return (
    <Card
      title="Audiogram — air conduction (latest)"
      subtitle={`Performed ${test.date} · ${test.performedBy}`}
      actions={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-[11px] text-clinical-muted">
            <Legend swatch="#0EA5A8" shape="o" label="Right (AC)"/>
            <Legend swatch="#2563EB" shape="x" label="Left (AC)"/>
          </div>
          <div className="flex rounded-md border border-clinical-border p-0.5 text-[11px] font-medium">
            <button className="rounded bg-clinical-ink px-2 py-1 text-white">Latest</button>
            <button className="px-2 py-1 text-clinical-muted">Compare</button>
            <button className="px-2 py-1 text-clinical-muted">Bone</button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-[1fr_220px] gap-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {bands.map(b => (
            <g key={b.label}>
              <rect x={PAD_L} y={yFor(b.from)} width={iW} height={yFor(b.to)-yFor(b.from)} fill={b.color} opacity="0.6"/>
              <text x={W-PAD_R-6} y={yFor(b.from)+12} textAnchor="end" className="fill-clinical-muted" style={{font:"500 9px 'Geist Mono', monospace", letterSpacing:".06em", textTransform:"uppercase"}}>{b.label}</text>
            </g>
          ))}
          {Array.from({length:11},(_,i)=>DB_MIN+i*10).map(db => (
            <g key={db}>
              <line x1={PAD_L} x2={W-PAD_R} y1={yFor(db)} y2={yFor(db)} stroke="#E5E8EC" strokeWidth={db===0?1.4:1}/>
              <text x={PAD_L-10} y={yFor(db)+4} textAnchor="end" className="fill-clinical-muted" style={{font:"500 10px 'Geist Mono', monospace"}}>{db}</text>
            </g>
          ))}
          {FREQS.map((f,i) => (
            <g key={f}>
              <line x1={xFor(i)} x2={xFor(i)} y1={PAD_T} y2={H-PAD_B} stroke="#E5E8EC"/>
              <text x={xFor(i)} y={H-PAD_B+18} textAnchor="middle" className="fill-clinical-muted" style={{font:"500 10px 'Geist Mono', monospace"}}>{f>=1000?`${f/1000}k`:f}</text>
            </g>
          ))}
          <text x={PAD_L-40} y={PAD_T+iH/2} transform={`rotate(-90 ${PAD_L-40} ${PAD_T+iH/2})`} textAnchor="middle" className="fill-clinical-ink" style={{font:"600 10px 'Geist', sans-serif", letterSpacing:".06em", textTransform:"uppercase"}}>Hearing level (dB HL)</text>
          <text x={PAD_L+iW/2} y={H-4} textAnchor="middle" className="fill-clinical-ink" style={{font:"600 10px 'Geist', sans-serif", letterSpacing:".06em", textTransform:"uppercase"}}>Frequency (Hz)</text>

          <path d={path(test.right)} fill="none" stroke="#0EA5A8" strokeWidth="2"/>
          {test.right.map((p,i)=>(<circle key={"r"+i} cx={xFor(i)} cy={yFor(p.db)} r="6" fill="white" stroke="#0EA5A8" strokeWidth="2"/>))}

          <path d={path(test.left)} fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 3"/>
          {test.left.map((p,i)=>{
            const x=xFor(i), y=yFor(p.db);
            return <g key={"l"+i}>
              <line x1={x-5} y1={y-5} x2={x+5} y2={y+5} stroke="#2563EB" strokeWidth="2"/>
              <line x1={x-5} y1={y+5} x2={x+5} y2={y-5} stroke="#2563EB" strokeWidth="2"/>
            </g>;
          })}
        </svg>

        <div className="space-y-4">
          <SummaryStat label="PTA Right" value="40" unit="dB HL" detail="Moderate" tone="warn"/>
          <SummaryStat label="PTA Left" value="45" unit="dB HL" detail="Moderate" tone="warn"/>
          <SummaryStat label="Speech recognition" value="84" unit="% @ 65 dB" detail="Good" tone="good"/>
          <SummaryStat label="Word discrimination" value="76" unit="% (R) / 72% (L)" tone="neutral"/>
          <div className="rounded-lg border border-dashed border-clinical-border bg-clinical-bg p-3 text-[11px] leading-relaxed text-clinical-muted">
            <span className="font-medium text-clinical-ink">Auto-classified:</span> Symmetric sloping bilateral sensorineural loss. Consistent with age-related presbycusis.
          </div>
        </div>
      </div>
    </Card>
  );
}

function SummaryStat({ label, value, unit, detail, tone="neutral" }) {
  const T = { neutral:"text-clinical-muted", good:"text-emerald-600", warn:"text-amber-600", bad:"text-rose-600" }[tone];
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-clinical-muted">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="num text-[22px] font-semibold leading-none text-clinical-ink">{value}</span>
        <span className="text-[11px] text-clinical-muted">{unit}</span>
      </div>
      {detail && <div className={cn("mt-0.5 text-[11px] font-medium", T)}>{detail}</div>}
    </div>
  );
}

function Legend({ swatch, shape, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="16" height="16" viewBox="0 0 18 18">
        {shape==="o"
          ? <circle cx="9" cy="9" r="5" fill="white" stroke={swatch} strokeWidth="2"/>
          : (<><line x1="4" y1="4" x2="14" y2="14" stroke={swatch} strokeWidth="2"/><line x1="14" y1="4" x2="4" y2="14" stroke={swatch} strokeWidth="2"/></>)
        }
      </svg>
      <span>{label}</span>
    </span>
  );
}

const CLS_TONE = {
  normal:"bg-emerald-50 text-emerald-700 ring-emerald-200",
  mild:"bg-amber-50 text-amber-700 ring-amber-200",
  moderate:"bg-orange-50 text-orange-700 ring-orange-200",
  "moderately-severe":"bg-rose-50 text-rose-700 ring-rose-200",
  severe:"bg-rose-100 text-rose-800 ring-rose-300",
  profound:"bg-rose-200 text-rose-900 ring-rose-400",
};
const CLS_LABEL = { normal:"Normal", mild:"Mild", moderate:"Moderate", "moderately-severe":"Mod-severe", severe:"Severe", profound:"Profound" };

function HistoryCard() {
  return (
    <Card
      title="Hearing test history"
      subtitle="Audiometric exams on file"
      actions={<button className="inline-flex items-center gap-1 text-xs font-medium text-clinical-accent hover:underline">View all<I.arrow/></button>}
      bodyClassName="p-0"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] font-medium uppercase tracking-[0.08em] text-clinical-muted">
            <th className="px-5 py-3">Date</th>
            <th className="py-3">Location</th>
            <th className="py-3">Clinician</th>
            <th className="py-3 text-right">PTA L</th>
            <th className="py-3 text-right">PTA R</th>
            <th className="py-3">Change</th>
            <th className="py-3">Classification</th>
            <th className="px-5 py-3"/>
          </tr>
        </thead>
        <tbody className="divide-y divide-clinical-border">
          {TEST_HISTORY.map(t => (
            <tr key={t.id} className="text-clinical-ink hover:bg-clinical-bg/60">
              <td className="num px-5 py-3 text-[12px] text-clinical-ink">{t.date}</td>
              <td className="py-3 text-clinical-muted">{t.loc}</td>
              <td className="py-3">{t.doc}</td>
              <td className="num py-3 text-right">{t.ptaL} dB</td>
              <td className="num py-3 text-right">{t.ptaR} dB</td>
              <td className="num py-3 text-[12px] text-amber-700">{t.change}</td>
              <td className="py-3">
                <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", CLS_TONE[t.cls])}>
                  {CLS_LABEL[t.cls]}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <button className="inline-flex items-center gap-1 text-xs font-medium text-clinical-accent hover:underline">Open<I.arrow/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function AidStatusCard() {
  return (
    <Card title="Fitted devices" actions={<button className="text-xs font-medium text-clinical-accent hover:underline">Order new →</button>}>
      {AIDS.map(a => (
        <div key={a.id} className="rounded-lg border border-clinical-border bg-clinical-bg p-4">
          <div className="flex items-start gap-3">
            <DeviceGlyph/>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-clinical-ink">{a.model}</div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>{a.status}
                </span>
              </div>
              <div className="mt-0.5 num text-[11px] text-clinical-muted">S/N {a.serial}</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-[11px]">
            <Meta label="Ear">{a.ear}</Meta>
            <Meta label="Fitted">{a.fitted}</Meta>
            <Meta label="Avg. use">{a.usage}</Meta>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-clinical-muted"><I.battery/>Battery health</span>
              <span className="num text-clinical-ink">{a.battery}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-clinical-accent" style={{width:`${a.battery}%`}}/>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-clinical-border bg-white px-2.5 py-1.5 text-[11px] font-medium text-clinical-ink hover:bg-clinical-bg"><I.wrench/>Service</button>
            <button className="rounded-md border border-clinical-border bg-white px-2.5 py-1.5 text-[11px] font-medium text-clinical-ink hover:bg-clinical-bg">Adjust program</button>
            <button className="ml-auto rounded-md px-2 py-1.5 text-[11px] font-medium text-clinical-muted hover:text-clinical-ink"><I.dots/></button>
          </div>
        </div>
      ))}
    </Card>
  );
}

function DeviceGlyph() {
  return (
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-clinical-border bg-white">
      <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
        <path d="M10 6c4 0 8 3 8 8v6c0 3-2 5-5 5h-1" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="12" cy="20" r="2.2" fill="#0EA5A8"/>
        <path d="M5 18c0-2 1.5-3 3-3" stroke="#0EA5A8" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function Meta({ label, children }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-clinical-muted">{label}</div>
      <div className="mt-0.5 text-[12px] text-clinical-ink">{children}</div>
    </div>
  );
}

function AppointmentsCard() {
  const TypeIcon = ({t}) => t==="video" ? <I.video/> : t==="phone" ? <I.phone/> : <I.pin/>;
  return (
    <Card title="Appointments" actions={<button className="text-xs font-medium text-clinical-accent hover:underline">Schedule →</button>}>
      <ol className="relative space-y-5 before:absolute before:left-[11px] before:top-1.5 before:h-[calc(100%-12px)] before:w-px before:bg-clinical-border">
        {APPTS.map(a => {
          const upcoming = a.status === "scheduled";
          return (
            <li key={a.id} className="relative flex gap-3 pl-8">
              <span className={cn("absolute left-0 top-0.5 grid h-6 w-6 place-items-center rounded-full border",
                upcoming ? "border-clinical-accent bg-white text-clinical-accent" : "border-clinical-border bg-clinical-bg text-clinical-muted")}>
                <TypeIcon t={a.type}/>
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[13px] font-medium text-clinical-ink">{a.title}</div>
                  <span className={cn("text-[10px] font-medium uppercase tracking-[0.08em]", upcoming ? "text-clinical-accent" : "text-clinical-muted")}>{a.status}</span>
                </div>
                <div className="mt-0.5 text-[12px] text-clinical-muted">
                  <span className="num">{a.when}</span> · {a.with}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function NotesCard() {
  return (
    <Card title="Clinical notes" actions={<button className="text-xs font-medium text-clinical-accent hover:underline">Add note →</button>}>
      <ul className="space-y-4">
        {NOTES.map(n => (
          <li key={n.id} className="border-l-2 border-clinical-border pl-3">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-medium text-clinical-ink">{n.author}</div>
              <div className="num text-[10px] text-clinical-muted">{n.at}</div>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-clinical-muted">{n.body}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ---------- Mount ----------
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
