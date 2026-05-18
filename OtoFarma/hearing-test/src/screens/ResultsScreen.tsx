import { useState } from 'react';
import { FREQS, fmtHzShort } from '../lib/constants';
import { classify, type HearingStatus } from '../lib/classify';

interface AudiogramProps {
  left: number[];
  right: number[];
  w?: number;
  h?: number;
}

function Audiogram({ left, right, w = 360, h = 240 }: AudiogramProps) {
  const padL = 38, padR = 14, padT = 18, padB = 32;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const dbMax = 100;
  const xs = FREQS.map((_, i) => padL + (i / (FREQS.length - 1)) * innerW);
  const yFor = (db: number) => padT + (db / dbMax) * innerH;
  const dbTicks = [0, 20, 40, 60, 80, 100];
  const pathLen = 700;

  const pathFor = (data: number[]) =>
    data.map((db, i) => (i === 0 ? 'M' : 'L') + xs[i].toFixed(1) + ' ' + yFor(Math.min(db, 95)).toFixed(1)).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <g>
        <rect x={padL} y={yFor(0)}  width={innerW} height={yFor(25)-yFor(0)}  fill="rgba(15,138,122,0.07)" />
        <rect x={padL} y={yFor(25)} width={innerW} height={yFor(40)-yFor(25)} fill="rgba(180,120,26,0.07)" />
        <rect x={padL} y={yFor(40)} width={innerW} height={yFor(55)-yFor(40)} fill="rgba(180,120,26,0.13)" />
        <rect x={padL} y={yFor(55)} width={innerW} height={yFor(70)-yFor(55)} fill="rgba(177,69,69,0.10)" />
        <rect x={padL} y={yFor(70)} width={innerW} height={yFor(100)-yFor(70)} fill="rgba(177,69,69,0.16)" />
      </g>

      <rect x={padL} y={padT} width={innerW} height={innerH} fill="none" stroke="var(--ink)" strokeWidth="1" opacity=".5" />

      {dbTicks.map(db => (
        <g key={db}>
          <line x1={padL} y1={yFor(db)} x2={padL+innerW} y2={yFor(db)} stroke="var(--ink)" strokeWidth=".5" opacity=".15" />
          <text x={padL-7} y={yFor(db)+3.5} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono" fill="var(--muted)">{db}</text>
        </g>
      ))}
      <text x={padL-26} y={padT+innerH/2} textAnchor="middle" fontSize="9.5" fontFamily="JetBrains Mono" fill="var(--muted)"
            transform={`rotate(-90 ${padL-26} ${padT+innerH/2})`}>dB HL</text>

      {FREQS.map((f, i) => (
        <g key={f}>
          <line x1={xs[i]} y1={padT} x2={xs[i]} y2={padT+innerH} stroke="var(--ink)" strokeWidth=".5" opacity=".1" />
          <text x={xs[i]} y={padT+innerH+15} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--muted)">
            {fmtHzShort(f)}
          </text>
        </g>
      ))}
      <text x={padL+innerW/2} y={h-4} textAnchor="middle" fontSize="9.5" fontFamily="JetBrains Mono" fill="var(--muted)">
        Frequency (Hz)
      </text>

      {left.length === 6 && (
        <>
          <path d={pathFor(left)} fill="none" stroke="var(--ink)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" className="plot-line"
                style={{ ['--len' as string]: pathLen }} />
          {left.map((db, i) => (
            <g key={'L'+i} className="plot-point" style={{ animationDelay: `${0.55 + i*0.08}s` }}
               stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round">
              <line x1={xs[i]-5} y1={yFor(Math.min(db,95))-5} x2={xs[i]+5} y2={yFor(Math.min(db,95))+5} />
              <line x1={xs[i]-5} y1={yFor(Math.min(db,95))+5} x2={xs[i]+5} y2={yFor(Math.min(db,95))-5} />
            </g>
          ))}
        </>
      )}

      {right.length === 6 && (
        <>
          <path d={pathFor(right)} fill="none" stroke="var(--accent)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 4"
                className="plot-line" style={{ ['--len' as string]: pathLen, animationDelay: '.25s' }} />
          {right.map((db, i) => (
            <circle key={'R'+i} className="plot-point" style={{ animationDelay: `${0.75 + i*0.08}s` }}
                    cx={xs[i]} cy={yFor(Math.min(db,95))} r="4.5"
                    fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.2" />
          ))}
        </>
      )}
    </svg>
  );
}

function StatusPill({ status }: { status: HearingStatus }) {
  const map = {
    good:  { bg: 'rgba(15,138,122,0.13)', fg: 'var(--accent)', dot: 'var(--accent)' },
    warn:  { bg: 'rgba(180,120,26,0.13)', fg: 'var(--warn)',   dot: 'var(--warn)'   },
    bad:   { bg: 'rgba(177,69,69,0.13)',  fg: 'var(--danger)', dot: 'var(--danger)' },
    muted: { bg: 'var(--line)',           fg: 'var(--muted)',  dot: 'var(--muted)'  },
  };
  const c = map[status.tone];
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: c.bg, color: c.fg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      <span className="text-[12.5px] font-semibold">{status.label}</span>
    </div>
  );
}

function EarSummaryCard({ ear, status, data }: { ear: 'L' | 'R'; status: HearingStatus; data: number[] }) {
  const pta = data.length ? ((data[1] + data[2] + data[3]) / 3).toFixed(0) : '—';
  return (
    <div className="card p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center mono text-[11px] font-semibold"
               style={{ background: ear === 'L' ? 'var(--ink)' : 'var(--accent)', color: 'white' }}>{ear}</div>
          <div className="text-[12.5px] font-medium">{ear === 'L' ? 'Left' : 'Right'}</div>
        </div>
        <div className="mono text-[10px] num" style={{ color: 'var(--muted)' }}>PTA {pta} dB</div>
      </div>
      <div className="mt-2 text-[12px] font-medium" style={{
        color: status.tone === 'good' ? 'var(--accent)' : status.tone === 'warn' ? 'var(--warn)' : 'var(--danger)'
      }}>{status.label}</div>
      <div className="mt-2 grid grid-cols-6 gap-1">
        {data.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className="w-full rounded-sm" style={{
              height: Math.max(2, (Math.min(v, 90) / 90) * 24),
              background: ear === 'L' ? 'var(--ink)' : 'var(--accent)',
              opacity: .85
            }} />
            <div className="mono text-[8.5px]" style={{ color: 'var(--muted)' }}>{fmtHzShort(FREQS[i])}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  results: { L: number[]; R: number[] };
  onRetake: () => void;
}

export default function ResultsScreen({ results, onRetake }: Props) {
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  const sL = classify(results.L);
  const sR = classify(results.R);
  const headline = (sL.tone === 'bad' || sR.tone === 'bad')
    ? (sL.tone === 'bad' ? sL : sR)
    : (sL.tone === 'warn' || sR.tone === 'warn')
    ? (sL.tone === 'warn' ? sL : sR)
    : sL;

  const send = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  return (
    <main className="stage scene-enter" style={{ width: 'min(440px, calc(100vw - 24px))' }}>
      <div className="card-lg p-6">
        <div className="flex items-center justify-between">
          <div className="mono text-[10.5px] uppercase tracking-[.18em]" style={{ color: 'var(--muted)' }}>
            Your audiogram
          </div>
          <div className="mono text-[10.5px] num" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>

        <h1 className="serif text-[30px] leading-[1.05] tracking-tight mt-2">{headline.label}</h1>
        <div className="mt-2"><StatusPill status={headline} /></div>

        <p className="text-[13.5px] mt-3 leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          {headline.tone === 'good'
            ? 'Your hearing is within normal limits across the tested range. Keep protecting it from loud sounds.'
            : headline.tone === 'warn'
            ? 'A mild-to-moderate threshold shift was detected, especially at higher pitches. A follow-up consultation is recommended.'
            : 'Significant hearing loss was detected. We recommend scheduling a clinical evaluation with an audiologist.'}
        </p>

        <div className="mt-4 -mx-1 overflow-hidden rounded-2xl" style={{ background: 'var(--surface)' }}>
          <Audiogram left={results.L} right={results.R} w={400} h={250} />
        </div>

        <div className="flex items-center justify-center gap-5 mt-1.5 mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <svg width="22" height="10"><line x1="2" y1="5" x2="20" y2="5" stroke="var(--ink)" strokeWidth="2"/></svg>
            Left (X)
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="22" height="10"><line x1="2" y1="5" x2="20" y2="5" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 3"/></svg>
            Right (O)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <EarSummaryCard ear="L" status={sL} data={results.L} />
          <EarSummaryCard ear="R" status={sR} data={results.R} />
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            onClick={send}
            disabled={sending || sent}
            className="hero-btn w-full py-4 text-[15.5px] font-semibold tracking-tight flex items-center justify-center gap-2"
            style={sent ? { background: 'var(--accent)' } : undefined}
          >
            {sent ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13 L10 18 L19 7" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Sent to OtoFarma
              </>
            ) : sending ? 'Sending…' : 'Send to OtoFarma'}
          </button>
          <div className="flex gap-2.5">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 rounded-full text-[13.5px] font-medium border"
              style={{ borderColor: 'var(--line-2)', color: 'var(--ink-2)' }}
            >Save PDF</button>
            <button
              onClick={onRetake}
              className="flex-1 py-3 rounded-full text-[13.5px] font-medium border"
              style={{ borderColor: 'var(--line-2)', color: 'var(--ink-2)' }}
            >Retake test</button>
          </div>
        </div>

        <div className="mono text-[10px] text-center mt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
          This is a screening test, not a clinical diagnosis.<br />
          Consult an audiologist for a calibrated evaluation.
        </div>
      </div>
    </main>
  );
}
