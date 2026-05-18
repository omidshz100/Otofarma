export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" stroke="var(--ink)" strokeWidth="1.4" />
        <path d="M7 14c0-3 2-5 5-5s5 2 5 5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 14c0-2 1-3 3-3s3 1 3 3" stroke="var(--ink)" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="12" cy="14" r="1.2" fill="var(--ink)" />
      </svg>
      <div className="leading-none">
        <div className="text-[15px] font-semibold tracking-tight">OtoFarma</div>
        <div className="mono text-[9.5px] uppercase tracking-[.15em]" style={{ color: 'var(--muted)' }}>
          hearing check
        </div>
      </div>
    </div>
  );
}
