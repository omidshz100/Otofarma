import { useState } from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sub?: string;
  optional?: boolean;
}

function Checkbox({ checked, onChange, label, sub, optional }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full text-left flex items-start gap-3 p-3 rounded-2xl border transition-all"
      style={{
        borderColor: checked ? 'var(--accent)' : 'var(--line)',
        background: checked ? 'var(--accent-soft)' : 'var(--surface)',
      }}
    >
      <div
        className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
        style={{
          background: checked ? 'var(--accent)' : 'var(--surface)',
          border: checked ? '0' : '1.5px solid var(--line-2)',
        }}
      >
        {checked && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.5 L5 9 L9.5 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-[14px] font-medium">{label}</div>
          {optional && (
            <span className="mono text-[9.5px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>optional</span>
          )}
        </div>
        {sub && <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--muted)' }}>{sub}</div>}
      </div>
    </button>
  );
}

interface Props { onStart: () => void; }

export default function SetupScreen({ onStart }: Props) {
  const [headphones, setHeadphones] = useState(false);
  const [volume, setVolume]         = useState(false);
  const [quiet, setQuiet]           = useState(false);
  const ready = headphones && volume;

  return (
    <main className="stage scene-enter">
      <div className="card-lg p-7">
        <div className="mono text-[10.5px] uppercase tracking-[.18em]" style={{ color: 'var(--muted)' }}>
          Before you start
        </div>
        <h1 className="serif text-[34px] leading-[1.05] tracking-tight mt-2">
          Let's check<br />your hearing.
        </h1>
        <p className="text-[14.5px] mt-3 leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          A short test — about 3 minutes. We'll play tones at six pitches, in each ear.
        </p>

        <div className="mt-5 mb-5 flex justify-center">
          <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
            <path d="M 25 78 Q 25 25, 90 25 Q 155 25, 155 78" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <rect x="12"  y="68" width="28" height="42" rx="10" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2" />
            <rect x="140" y="68" width="28" height="42" rx="10" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2" />
            <rect x="17"  y="73" width="18" height="32" rx="6" fill="var(--accent-soft)" />
            <rect x="145" y="73" width="18" height="32" rx="6" fill="var(--accent-soft)" />
            <path d="M 46 89 q 3 -4 0 -8" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <path d="M 51 92 q 5 -7 0 -14" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".6" />
            <path d="M 134 89 q -3 -4 0 -8" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <path d="M 129 92 q -5 -7 0 -14" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".6" />
          </svg>
        </div>

        <div className="space-y-2.5">
          <Checkbox checked={headphones} onChange={setHeadphones} label="Headphones connected" sub="Over-ear or in-ear, both sides working" />
          <Checkbox checked={volume}     onChange={setVolume}     label="Device volume at 50%" sub="Use your side buttons to set it" />
          <Checkbox checked={quiet}      onChange={setQuiet}      label="Quiet environment"    sub="Optional — but improves accuracy" optional />
        </div>

        <button
          disabled={!ready}
          onClick={onStart}
          className="hero-btn w-full mt-6 py-4 text-[15.5px] font-semibold tracking-tight"
        >
          {ready ? 'Start hearing test' : 'Confirm the steps above'}
        </button>
        <div className="mono text-[10px] text-center mt-2.5" style={{ color: 'var(--muted)' }}>
          ~ 3 min · no microphone access needed
        </div>
      </div>
    </main>
  );
}
