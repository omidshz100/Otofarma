// OtoFarma — Hearing Test Wireframes
// Single-file React prototype; types annotated as comments since this runs through Babel inline.
// In a real codebase: split per screen + use proper TS.

const { useState, useMemo, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2f6fd6",
  "ink": "#1a1a1a",
  "paper": "#f6f3ec",
  "showAllVariants": true,
  "frameStyle": "phone"
}/*EDITMODE-END*/;

const STEPS = [
  { id: 'setup',   label: '1. Setup' },
  { id: 'ear',     label: '2. Ear Select' },
  { id: 'test',    label: '3. Test' },
  { id: 'results', label: '4. Results' },
];

const FREQS = [250, 500, 1000, 2000, 4000, 8000];

// ────────────────────────────────────────────────────────────────────────────
// Small primitives
// ────────────────────────────────────────────────────────────────────────────

function Frame({ title, note, wob, children, w = 320, h = 560 }) {
  return (
    <div className={`flex flex-col ${wob || ''}`}>
      <div className="mb-2 flex items-baseline justify-between">
        <div className="hand-tight text-[22px] leading-none">{title}</div>
        {note && <div className="mono text-[10px] uppercase tracking-wider text-neutral-600">{note}</div>}
      </div>
      <div className="sk shadow-sk bg-[var(--paper)] p-4 relative" style={{ width: w, height: h }}>
        {children}
      </div>
    </div>
  );
}

function PhoneFrame({ title, note, wob, children }) {
  return (
    <div className={`flex flex-col items-start ${wob || ''}`}>
      <div className="mb-2 flex w-[280px] items-baseline justify-between">
        <div className="hand-tight text-[22px] leading-none">{title}</div>
        {note && <div className="mono text-[10px] uppercase tracking-wider text-neutral-600">{note}</div>}
      </div>
      <div className="phone shadow-sk">
        <div className="notch"></div>
        <div className="absolute inset-0 pt-7 pb-3 px-4 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

function Btn({ children, big, primary, dashed, className = '' }) {
  const base = primary
    ? 'bg-[var(--ink)] text-[var(--paper)]'
    : 'bg-[var(--paper)] text-[var(--ink)]';
  const sz = big ? 'py-4 px-6 text-lg' : 'py-2.5 px-4 text-sm';
  const border = dashed ? 'sk-dashed' : 'sk-soft';
  return (
    <div className={`${border} ${base} ${sz} hand-tight text-center shadow-sk-sm ${className}`}>
      {children}
    </div>
  );
}

function Chip({ children, active, className = '' }) {
  return (
    <div className={`sk-pill px-3 py-1 mono text-[11px] ${active ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-[var(--paper)]'} ${className}`}>
      {children}
    </div>
  );
}

function Hatch({ className = '', label, dense }) {
  return (
    <div className={`sk-soft ${dense ? 'hatch-dense' : 'hatch'} flex items-center justify-center ${className}`}>
      {label && <div className="mono text-[10px] uppercase tracking-wider bg-[var(--paper)] px-1.5 py-0.5">{label}</div>}
    </div>
  );
}

// Simple ear illustration using only allowed shapes (circles + rounded rect)
function HeadphoneIcon({ size = 72 }) {
  const s = size;
  return (
    <svg width={s} height={s * 0.75} viewBox="0 0 100 75" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M 12 50 Q 12 12, 50 12 Q 88 12, 88 50" />
      <rect x="6"  y="44" width="16" height="26" rx="6" fill="var(--paper)" />
      <rect x="78" y="44" width="16" height="26" rx="6" fill="var(--paper)" />
    </svg>
  );
}

function EarShape({ side = 'L', size = 80, active }) {
  const s = size;
  const fill = active ? 'var(--ink)' : 'var(--paper)';
  const stroke = 'var(--ink)';
  const txt = active ? 'var(--paper)' : 'var(--ink)';
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill={fill} stroke={stroke} strokeWidth="2.5" />
      <text x="50" y="62" textAnchor="middle" fontSize="42" fontFamily="Kalam, cursive" fontWeight="700" fill={txt}>{side}</text>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SETUP screen — 3 variants
// ────────────────────────────────────────────────────────────────────────────

function SetupA() {
  return (
    <Frame title="A — Centered card" note="default" wob="wob-1">
      <div className="flex h-full flex-col items-center justify-between text-center">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-600">OtoFarma · Hearing Test</div>
        <div className="flex flex-col items-center gap-5">
          <HeadphoneIcon size={84} />
          <div className="hand-tight text-3xl leading-none scribble">Before we begin</div>
          <ul className="hand text-[15px] leading-snug text-left space-y-2 w-[230px]">
            <li className="flex gap-2"><span>1.</span><span>Put on your headphones.</span></li>
            <li className="flex gap-2"><span>2.</span><span>Set device volume to <span className="mono bg-[var(--paper-2)] px-1">50%</span></span></li>
            <li className="flex gap-2"><span>3.</span><span>Find a quiet room.</span></li>
          </ul>
        </div>
        <Btn big primary className="w-full">Start Test →</Btn>
      </div>
    </Frame>
  );
}

function SetupB() {
  return (
    <Frame title="B — Stepped checklist" note="numbered" wob="wob-2">
      <div className="flex h-full flex-col">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-600">Step 0 / 4</div>
        <div className="hand-tight text-3xl mt-1 mb-4">Get ready.</div>

        {[
          { n:'01', t:'Headphones on', d:'Over-ear or in-ear, both sides connected.' },
          { n:'02', t:'Volume = 50%', d:'Use your device side buttons.' },
          { n:'03', t:'Quiet space', d:'No background noise.' },
        ].map((s,i)=>(
          <div key={i} className="sk-soft p-3 mb-3 flex gap-3 items-start bg-[var(--paper-2)]">
            <div className="mono text-[12px] font-bold">{s.n}</div>
            <div className="flex-1">
              <div className="hand-tight text-xl leading-none">{s.t}</div>
              <div className="text-[12px] text-neutral-700 mt-1">{s.d}</div>
            </div>
            <div className="sk-circle w-5 h-5"></div>
          </div>
        ))}

        <div className="mt-auto">
          <Btn big primary className="w-full">Start Test</Btn>
          <div className="text-center mt-2 mono text-[10px] text-neutral-500">~ 3 minutes</div>
        </div>
      </div>
    </Frame>
  );
}

function SetupC() {
  return (
    <PhoneFrame title="C — Phone, illustrated" note="hero" wob="wob-3">
      <div className="flex justify-between items-center">
        <div className="mono text-[9px] uppercase tracking-widest">9:41</div>
        <div className="hand-tight text-sm">otofarma</div>
      </div>
      <div className="mt-3 sk-dashed p-3 flex-1 flex flex-col items-center justify-center text-center gap-3">
        <div className="text-[var(--accent)]"><HeadphoneIcon size={110} /></div>
        <div className="hand-tight text-2xl leading-tight">Let's check<br/>your hearing.</div>
        <div className="hand text-[13px] text-neutral-700 px-2">
          Put on headphones and set volume to <span className="mono bg-[var(--paper-2)] px-1">50%</span>.
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <Chip>🎧 connected</Chip>
        <Chip>vol 50%</Chip>
      </div>
      <Btn big primary className="mt-3 w-full">Start →</Btn>
    </PhoneFrame>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// EAR SELECT screen — 3 variants
// ────────────────────────────────────────────────────────────────────────────

function EarA() {
  return (
    <Frame title="A — Twin ears" note="active highlight" wob="wob-2">
      <div className="flex h-full flex-col">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-600">Step 1 / 4 · Ear</div>
        <div className="hand-tight text-3xl mt-1 scribble inline-block">Testing left ear</div>
        <div className="text-[13px] text-neutral-700 mt-3">We'll test the left ear first, then the right.</div>

        <div className="flex-1 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <EarShape side="L" active size={110} />
            <div className="mono text-[11px]">LEFT — now</div>
          </div>
          <div className="hand-tight text-3xl text-neutral-400">→</div>
          <div className="flex flex-col items-center gap-2 opacity-50">
            <EarShape side="R" size={110} />
            <div className="mono text-[11px]">RIGHT — next</div>
          </div>
        </div>

        <Btn big primary className="w-full">Begin left ear</Btn>
      </div>
    </Frame>
  );
}

function EarB() {
  return (
    <Frame title="B — Progress strip" note="linear" wob="wob-3">
      <div className="flex h-full flex-col">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-600">Ear order</div>
        <div className="hand-tight text-3xl mt-1">Left first.</div>

        <div className="mt-5 flex items-center gap-3">
          <div className="sk-pill bg-[var(--ink)] text-[var(--paper)] px-3 py-1.5 mono text-[11px]">● LEFT</div>
          <div className="flex-1 border-t-2 border-dashed border-[var(--ink)]"></div>
          <div className="sk-pill px-3 py-1.5 mono text-[11px] opacity-60">○ RIGHT</div>
        </div>

        <div className="mt-6 sk-dashed p-4 flex-1 flex flex-col items-center justify-center gap-3">
          <EarShape side="L" active size={140} />
          <div className="hand-tight text-2xl">Left ear</div>
          <div className="hand text-[13px] text-center text-neutral-700 px-2">
            You'll hear tones at 6 frequencies. Tap the button when you hear one.
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Btn dashed className="flex-1">← Back</Btn>
          <Btn big primary className="flex-[2]">Start left ear</Btn>
        </div>
      </div>
    </Frame>
  );
}

function EarC() {
  return (
    <PhoneFrame title="C — Phone, big mono" note="minimal" wob="wob-1">
      <div className="flex justify-between items-center">
        <div className="mono text-[9px] uppercase tracking-widest">step 1 / 4</div>
        <Chip>L → R</Chip>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-600">Now testing</div>
        <div className="relative">
          <EarShape side="L" active size={170} />
        </div>
        <div className="hand-tight text-3xl">Left ear</div>
        <div className="hand text-[13px] text-neutral-700 text-center px-4">
          Listen for any sound, even very faint.
        </div>
      </div>

      <div className="flex gap-2 mb-1">
        <div className="sk-soft flex-1 py-1.5 text-center mono text-[10px] bg-[var(--ink)] text-[var(--paper)]">L</div>
        <div className="sk-soft flex-1 py-1.5 text-center mono text-[10px] opacity-50">R</div>
      </div>
      <Btn big primary className="w-full">I'm ready</Btn>
    </PhoneFrame>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEST screen — 3 variants
// ────────────────────────────────────────────────────────────────────────────

function FreqDots({ current = 2 }) {
  return (
    <div className="flex items-center gap-2">
      {FREQS.map((f, i) => (
        <div key={f} className="flex flex-col items-center gap-1">
          <div className={`w-2.5 h-2.5 sk-circle ${i < current ? 'bg-[var(--ink)]' : i === current ? 'bg-[var(--accent)]' : 'bg-[var(--paper)]'}`}></div>
          <div className={`mono text-[9px] ${i === current ? 'font-bold' : 'text-neutral-500'}`}>{f >= 1000 ? (f/1000)+'k' : f}</div>
        </div>
      ))}
    </div>
  );
}

function TestA() {
  return (
    <Frame title="A — Big tone + dB meter" note="default" wob="wob-3">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-600">Left ear · 3 of 6</div>
          <Chip active>L</Chip>
        </div>

        <div className="mt-3"><FreqDots current={2} /></div>

        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="hand-tight text-[64px] leading-none">1000 <span className="text-[28px] text-neutral-500">Hz</span></div>
          <div className="hand text-[13px] text-neutral-600">playing tone…</div>

          {/* dB rising meter */}
          <div className="w-full mt-4">
            <div className="flex justify-between mono text-[10px] text-neutral-600">
              <span>0 dB</span><span>now: 25 dB</span><span>90 dB</span>
            </div>
            <div className="sk-soft mt-1 h-4 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-[var(--accent)]" style={{ width: '28%' }}></div>
              <div className="absolute inset-y-0" style={{ left: '28%', borderLeft: '2px dashed var(--ink)' }}></div>
            </div>
            <div className="hand text-[12px] text-neutral-700 mt-2 text-center">volume rising slowly…</div>
          </div>
        </div>

        <Btn big primary className="w-full text-xl py-5">👂 I Hear It</Btn>
        <div className="text-center mt-1 mono text-[10px] text-neutral-500">tap as soon as you hear anything</div>
      </div>
    </Frame>
  );
}

function TestB() {
  // Concentric pulse rings
  return (
    <Frame title="B — Pulse rings" note="visual" wob="wob-1">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="mono text-[10px] uppercase tracking-widest">left · freq 3/6</div>
          <div className="mono text-[10px]">25 dB</div>
        </div>

        <div className="flex-1 relative flex items-center justify-center">
          <div className="absolute sk-circle w-56 h-56 opacity-20"></div>
          <div className="absolute sk-circle w-44 h-44 opacity-40"></div>
          <div className="absolute sk-circle w-32 h-32 opacity-70"></div>
          <div className="absolute sk-circle w-20 h-20 bg-[var(--accent)] text-[var(--paper)] flex items-center justify-center">
            <div className="hand-tight text-2xl leading-none text-center">1k<br/><span className="text-[10px] mono">Hz</span></div>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between mono text-[10px] text-neutral-600 mb-1">
            <span>250</span><span>500</span><span className="font-bold">1k</span><span>2k</span><span>4k</span><span>8k</span>
          </div>
          <div className="sk-soft h-2 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-[var(--ink)]" style={{ width: '40%' }}></div>
          </div>
        </div>

        <Btn big primary className="w-full text-xl py-5 sk-thick">I Hear It</Btn>
      </div>
    </Frame>
  );
}

function TestC() {
  // Equalizer style: 6 bars
  return (
    <PhoneFrame title="C — Equalizer view" note="all 6 visible" wob="wob-2">
      <div className="flex justify-between items-center">
        <div className="mono text-[9px] uppercase tracking-widest">left ear</div>
        <Chip>3 / 6</Chip>
      </div>

      <div className="hand-tight text-2xl mt-2">Listen…</div>
      <div className="hand text-[12px] text-neutral-700">Tap the button the moment you hear the tone.</div>

      <div className="flex-1 flex items-end justify-around mt-4 mb-2 px-2">
        {FREQS.map((f, i) => {
          const done = i < 2;
          const cur = i === 2;
          const h = done ? [50, 38, 0, 0, 0, 0][i] : cur ? 28 : 0;
          return (
            <div key={f} className="flex flex-col items-center gap-1 flex-1">
              <div className="relative w-5 h-40 sk-soft flex flex-col-reverse overflow-hidden bg-[var(--paper)]">
                {done && <div className="w-full bg-[var(--ink)]" style={{ height: h + '%' }}></div>}
                {cur && (
                  <>
                    <div className="w-full bg-[var(--accent)]" style={{ height: h + '%' }}></div>
                    <div className="absolute left-0 right-0 border-t-2 border-dashed border-[var(--ink)]" style={{ bottom: h + '%' }}></div>
                  </>
                )}
              </div>
              <div className={`mono text-[9px] ${cur ? 'font-bold' : 'text-neutral-500'}`}>
                {f >= 1000 ? (f/1000)+'k' : f}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mono text-[10px] text-center text-neutral-600 mb-2">▲ louder · 25 dB now</div>
      <Btn big primary className="w-full text-lg">I Hear It</Btn>
    </PhoneFrame>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// AUDIOGRAM screen — 3 variants
// ────────────────────────────────────────────────────────────────────────────

// Sample data (dB hearing level — lower is better, plotted top-down)
const LEFT  = [10, 15, 20, 25, 35, 40];
const RIGHT = [15, 10, 15, 20, 25, 30];

function Audiogram({ w = 280, h = 220, showZones = false, dashedRight = true }) {
  const padL = 36, padR = 10, padT = 18, padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const dbMax = 90; // 0 at top → 90 at bottom
  const xs = FREQS.map((_, i) => padL + (i / (FREQS.length - 1)) * innerW);
  const yFor = (db) => padT + (db / dbMax) * innerH;
  const dbTicks = [0, 20, 40, 60, 80];

  const linePath = (data) =>
    data.map((db, i) => (i === 0 ? 'M' : 'L') + xs[i] + ' ' + yFor(db)).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      {/* Zones */}
      {showZones && (
        <g>
          <rect x={padL} y={yFor(0)}  width={innerW} height={yFor(25)-yFor(0)}  fill="rgba(47,111,214,0.08)" />
          <rect x={padL} y={yFor(25)} width={innerW} height={yFor(40)-yFor(25)} fill="rgba(47,111,214,0.16)" />
          <rect x={padL} y={yFor(40)} width={innerW} height={yFor(70)-yFor(40)} fill="rgba(47,111,214,0.24)" />
          <rect x={padL} y={yFor(70)} width={innerW} height={yFor(90)-yFor(70)} fill="rgba(47,111,214,0.32)" />
          <text x={w-padR-2} y={yFor(12)+3}  textAnchor="end" fontSize="8" fontFamily="JetBrains Mono" fill="#1a1a1a" opacity=".7">normal</text>
          <text x={w-padR-2} y={yFor(32)+3}  textAnchor="end" fontSize="8" fontFamily="JetBrains Mono" fill="#1a1a1a" opacity=".7">mild</text>
          <text x={w-padR-2} y={yFor(55)+3}  textAnchor="end" fontSize="8" fontFamily="JetBrains Mono" fill="#1a1a1a" opacity=".7">moderate</text>
          <text x={w-padR-2} y={yFor(80)+3}  textAnchor="end" fontSize="8" fontFamily="JetBrains Mono" fill="#1a1a1a" opacity=".7">severe</text>
        </g>
      )}

      {/* Axes box */}
      <rect x={padL} y={padT} width={innerW} height={innerH} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />

      {/* dB grid + labels */}
      {dbTicks.map(db => (
        <g key={db}>
          <line x1={padL} y1={yFor(db)} x2={padL+innerW} y2={yFor(db)} stroke="#1a1a1a" strokeWidth=".5" strokeDasharray="2 3" opacity=".4" />
          <text x={padL-6} y={yFor(db)+3} textAnchor="end" fontSize="9" fontFamily="JetBrains Mono">{db}</text>
        </g>
      ))}
      <text x={6} y={padT+innerH/2} fontSize="9" fontFamily="JetBrains Mono"
            transform={`rotate(-90 10 ${padT+innerH/2})`}>dB HL</text>

      {/* freq labels */}
      {FREQS.map((f, i) => (
        <g key={f}>
          <line x1={xs[i]} y1={padT} x2={xs[i]} y2={padT+innerH} stroke="#1a1a1a" strokeWidth=".5" strokeDasharray="2 3" opacity=".25" />
          <text x={xs[i]} y={padT+innerH+14} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono">
            {f >= 1000 ? (f/1000) + 'k' : f}
          </text>
        </g>
      ))}
      <text x={padL+innerW/2} y={h-4} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono">Hz →</text>

      {/* Left ear (solid line, X markers) */}
      <path d={linePath(LEFT)} fill="none" stroke="#1a1a1a" strokeWidth="1.8" />
      {LEFT.map((db, i) => (
        <g key={'L'+i} stroke="#1a1a1a" strokeWidth="1.8">
          <line x1={xs[i]-4} y1={yFor(db)-4} x2={xs[i]+4} y2={yFor(db)+4} />
          <line x1={xs[i]-4} y1={yFor(db)+4} x2={xs[i]+4} y2={yFor(db)-4} />
        </g>
      ))}

      {/* Right ear (dashed line, O markers, accent) */}
      <path d={linePath(RIGHT)} fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeDasharray={dashedRight ? "5 3" : ""} />
      {RIGHT.map((db, i) => (
        <circle key={'R'+i} cx={xs[i]} cy={yFor(db)} r="4" fill="var(--paper)" stroke="var(--accent)" strokeWidth="1.8" />
      ))}
    </svg>
  );
}

function ResultsA() {
  return (
    <Frame title="A — Classic audiogram" note="default" w={360} wob="wob-1">
      <div className="flex h-full flex-col">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-600">Your audiogram</div>
        <div className="hand-tight text-2xl scribble inline-block">Mild hearing loss</div>

        <div className="mt-2 flex justify-center"><Audiogram w={320} h={220} /></div>

        <div className="flex items-center gap-4 mt-2 mono text-[10px]">
          <span className="flex items-center gap-1.5"><span className="inline-block w-4 border-t-2 border-[var(--ink)]"></span>Left (X)</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-4 border-t-2 border-dashed" style={{borderColor:'var(--accent)'}}></span>Right (O)</span>
        </div>

        <div className="mt-auto flex gap-2">
          <Btn dashed className="flex-1">Save PDF</Btn>
          <Btn big primary className="flex-[2]">Send to OtoFarma →</Btn>
        </div>
      </div>
    </Frame>
  );
}

function ResultsB() {
  return (
    <Frame title="B — Chart + per-freq strip" note="comparison" w={360} wob="wob-3">
      <div className="flex h-full flex-col">
        <div className="flex items-baseline justify-between">
          <div className="hand-tight text-2xl">Results</div>
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-600">test #1 · today</div>
        </div>

        <div className="mt-1 flex justify-center"><Audiogram w={320} h={190} /></div>

        {/* per-frequency table */}
        <div className="sk-soft mt-2 p-2 bg-[var(--paper-2)]">
          <div className="grid grid-cols-7 mono text-[9px] gap-1 text-neutral-600">
            <div></div>
            {FREQS.map(f => <div key={f} className="text-center">{f >= 1000 ? (f/1000)+'k':f}</div>)}
          </div>
          <div className="grid grid-cols-7 mono text-[10px] gap-1 mt-1">
            <div>L</div>
            {LEFT.map((v,i)=><div key={i} className="text-center">{v}</div>)}
          </div>
          <div className="grid grid-cols-7 mono text-[10px] gap-1 mt-0.5">
            <div className="text-[var(--accent)]">R</div>
            {RIGHT.map((v,i)=><div key={i} className="text-center text-[var(--accent)]">{v}</div>)}
          </div>
        </div>

        <div className="sk-soft mt-2 p-2 flex items-center gap-3">
          <div className="w-9 h-9 sk-circle bg-[var(--accent)]/20 flex items-center justify-center hand-tight text-lg">!</div>
          <div className="flex-1">
            <div className="hand-tight text-lg leading-none">Mild loss · high freq</div>
            <div className="text-[11px] text-neutral-700">Common pattern. Recommend a follow-up with a specialist.</div>
          </div>
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          <Btn dashed className="flex-1">Retake</Btn>
          <Btn big primary className="flex-[2]">Send to OtoFarma</Btn>
        </div>
      </div>
    </Frame>
  );
}

function ResultsC() {
  return (
    <Frame title="C — Audiogram w/ severity zones" note="annotated" w={360} wob="wob-2">
      <div className="flex h-full flex-col">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-600">Hearing summary</div>
        <div className="flex items-baseline gap-2 mt-1">
          <div className="hand-tight text-3xl scribble">Mild loss</div>
          <div className="mono text-[10px] text-neutral-600">high frequencies</div>
        </div>

        <div className="mt-2 flex justify-center"><Audiogram w={320} h={230} showZones /></div>

        <div className="flex items-center gap-4 mt-1 mono text-[10px]">
          <span className="flex items-center gap-1.5"><span className="inline-block w-4 border-t-2 border-[var(--ink)]"></span>L</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-4 border-t-2 border-dashed" style={{borderColor:'var(--accent)'}}></span>R</span>
          <span className="ml-auto text-neutral-600">shaded = severity zones</span>
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          <Btn dashed className="flex-1">Share</Btn>
          <Btn big primary className="flex-[2]">Send to OtoFarma →</Btn>
        </div>
      </div>
    </Frame>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// App shell + tabs
// ────────────────────────────────────────────────────────────────────────────

const VARIANTS = {
  setup:   [SetupA, SetupB, SetupC],
  ear:     [EarA, EarB, EarC],
  test:    [TestA, TestB, TestC],
  results: [ResultsA, ResultsB, ResultsC],
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = useState('setup');

  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--accent', t.accent);
    r.setProperty('--ink', t.ink);
    r.setProperty('--paper', t.paper);
  }, [t.accent, t.ink, t.paper]);

  const Variants = VARIANTS[active];

  return (
    <div className="min-h-screen px-8 py-8" data-screen-label={`Wireframes · ${active}`}>
      {/* Header */}
      <header className="max-w-[1400px] mx-auto mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="mono text-[11px] uppercase tracking-widest text-neutral-600">OtoFarma · wireframes · v0.1</div>
          <h1 className="hand-tight text-5xl leading-none mt-1">Hearing test — 4 screens, 3 ways each</h1>
          <p className="hand text-[15px] mt-2 max-w-2xl text-neutral-700">
            Low-fi explorations. Pick a tab to see three layout directions side-by-side for that step.
            Mix &amp; match — when one click together, we'll move to hi-fi.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="sk-soft px-3 py-1.5 mono text-[10px] bg-[var(--paper-2)]">flow: setup → L ear → R ear → results</div>
          <div className="mono text-[10px] text-neutral-500">freqs: 250 · 500 · 1k · 2k · 4k · 8k Hz</div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-[1400px] mx-auto flex items-end gap-1 border-b-[1.5px] border-[var(--ink)] pl-2">
        {STEPS.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`tab ${active === s.id ? 'active' : ''}`}
          >
            {s.label}
          </button>
        ))}
        <div className="ml-auto mb-2 mono text-[10px] text-neutral-600">
          showing <b>{STEPS.findIndex(s=>s.id===active)+1}</b> of 4
        </div>
      </div>

      {/* Variant grid */}
      <div className="max-w-[1400px] mx-auto mt-10 flex flex-wrap gap-x-10 gap-y-12 justify-center">
        {Variants.map((V, i) => <V key={active + i} />)}
      </div>

      {/* Footer notes */}
      <footer className="max-w-[1400px] mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px]">
        <div className="sk-dashed p-4 bg-[var(--paper-2)]">
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Notes — flow</div>
          <div className="hand">
            All variants assume the same state shape: <span className="mono bg-[var(--paper)] px-1">{`{step, ear, freqIdx, db, results: {L, R}}`}</span>.
            Variant choice only changes the view layer.
          </div>
        </div>
        <div className="sk-dashed p-4 bg-[var(--paper-2)]">
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Notes — audio</div>
          <div className="hand">
            Tones via Web Audio <span className="mono bg-[var(--paper)] px-1">OscillatorNode</span> at each freq,
            gain ramps from −60 dB to threshold; capture <span className="mono bg-[var(--paper)] px-1">gain.value</span> on tap.
          </div>
        </div>
        <div className="sk-dashed p-4 bg-[var(--paper-2)]">
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Open questions</div>
          <div className="hand">
            · Does each ear test all 6 freqs before switching, or interleave?<br/>
            · Threshold method: ascending only, or Hughson-Westlake?<br/>
            · Send target: API endpoint, email, or print PDF?
          </div>
        </div>
      </footer>

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakColor label="Accent" value={t.accent}
          options={['#2f6fd6', '#d97757', '#1f8a5b', '#7a5ae0']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakColor label="Ink" value={t.ink}
          options={['#1a1a1a', '#2b2417', '#0f172a']}
          onChange={(v) => setTweak('ink', v)} />
        <TweakColor label="Paper" value={t.paper}
          options={['#f6f3ec', '#f3efe4', '#ffffff', '#eee7d7']}
          onChange={(v) => setTweak('paper', v)} />
        <TweakSection label="Navigation" />
        <TweakRadio label="Step" value={active}
          options={STEPS.map(s => s.id)}
          onChange={(v) => setActive(v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
