// OtoFarma — Hearing Test (Hi-Fi Interactive Prototype)
// Real Web Audio: OscillatorNode + GainNode ramping, StereoPanner per ear.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ────────────────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────────────────

const FREQS = [250, 500, 1000, 2000, 4000, 8000];
const RAMP_MS = 7000;            // dB rises from 0 → 90 over this duration
const GAP_MS = 700;              // pause between tones
const TONE_FADE = 0.035;         // anti-click fade (s)
const MAX_GAIN = 0.28;           // safety cap at the loudest dB on the scale
const RECORDED_HOLD_MS = 850;    // "got it" feedback duration

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#0f8a7a",
  "tone": "sine",
  "demoMode": false
}/*EDITMODE-END*/;

// dB HL (display) → linear gain. At 0 dB ≈ near-inaudible, at 90 dB ≈ loud.
const dbToGain = (db) => MAX_GAIN * Math.pow(10, (Math.max(0, Math.min(90, db)) - 90) / 20);

const fmtHz = (f) => (f >= 1000 ? (f / 1000) + ' kHz' : f + ' Hz');
const fmtHzShort = (f) => (f >= 1000 ? (f / 1000) + 'k' : '' + f);

// Status classification from a results array (per ear)
function classify(arr) {
  if (!arr || arr.length < 6) return { key: 'pending', label: 'In progress', tone: 'muted' };
  // Average over speech-relevant freqs 500, 1k, 2k (PTA)
  const pta = (arr[1] + arr[2] + arr[3]) / 3;
  if (pta <= 25) return { key: 'normal',   label: 'Normal hearing',    tone: 'good' };
  if (pta <= 40) return { key: 'mild',     label: 'Mild loss',         tone: 'warn' };
  if (pta <= 55) return { key: 'moderate', label: 'Moderate loss',     tone: 'warn' };
  if (pta <= 70) return { key: 'modsev',   label: 'Moderately severe', tone: 'bad'  };
  if (pta <= 90) return { key: 'severe',   label: 'Severe loss',       tone: 'bad'  };
  return { key: 'profound', label: 'Profound loss', tone: 'bad' };
}

// Sample data for demo mode
const DEMO_LEFT  = [10, 15, 20, 25, 35, 45];
const DEMO_RIGHT = [15, 10, 15, 20, 25, 35];

// ────────────────────────────────────────────────────────────────────────────
// Audio engine hook
// ────────────────────────────────────────────────────────────────────────────

function useAudioEngine() {
  const ctxRef     = useRef(null);
  const oscRef     = useRef(null);
  const gainRef    = useRef(null);
  const panRef     = useRef(null);

  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || !oscRef.current) return;
    const t = ctx.currentTime;
    try {
      gainRef.current.gain.cancelScheduledValues(t);
      gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, t);
      gainRef.current.gain.linearRampToValueAtTime(0, t + TONE_FADE);
      oscRef.current.stop(t + TONE_FADE + 0.02);
    } catch (e) { /* node already stopped */ }
    oscRef.current = null;
    gainRef.current = null;
    panRef.current = null;
  }, []);

  const start = useCallback((freq, ear, waveform = 'sine') => {
    const ctx = ensure();
    stop();
    const osc = ctx.createOscillator();
    osc.type = waveform;
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const pan = ctx.createStereoPanner();
    pan.pan.value = ear === 'L' ? -1 : 1;
    osc.connect(gain).connect(pan).connect(ctx.destination);
    // Fade in to the current target (will be set by setDb shortly)
    osc.start();
    oscRef.current = osc;
    gainRef.current = gain;
    panRef.current = pan;
  }, [ensure, stop]);

  const setDb = useCallback((db) => {
    const ctx = ctxRef.current;
    if (!ctx || !gainRef.current) return;
    const target = dbToGain(db);
    // Smooth ramp prevents zipper noise
    gainRef.current.gain.setTargetAtTime(target, ctx.currentTime, 0.02);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { stop(); if (ctxRef.current) { try { ctxRef.current.close(); } catch(e){} } }, [stop]);

  return { ensure, start, stop, setDb };
}

// ────────────────────────────────────────────────────────────────────────────
// Small UI atoms
// ────────────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" stroke="var(--ink)" strokeWidth="1.4" />
        <path d="M7 14c0-3 2-5 5-5s5 2 5 5"  stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 14c0-2 1-3 3-3s3 1 3 3"  stroke="var(--ink)"    strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="12" cy="14" r="1.2" fill="var(--ink)" />
      </svg>
      <div className="leading-none">
        <div className="text-[15px] font-semibold tracking-tight">OtoFarma</div>
        <div className="mono text-[9.5px] uppercase tracking-[.15em] text-[var(--muted)]">hearing check</div>
      </div>
    </div>
  );
}

function Stepper({ step, ear, freqIdx }) {
  // 4 dots: setup, left ear, right ear, results
  const phases = ['setup', 'L', 'R', 'results'];
  let activeIdx = 0;
  if (step === 'setup') activeIdx = 0;
  else if (step === 'earIntro' || step === 'test') activeIdx = ear === 'L' ? 1 : 2;
  else if (step === 'results') activeIdx = 3;

  return (
    <div className="flex items-center gap-1.5">
      {phases.map((p, i) => (
        <div key={p} className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i < activeIdx ? 'var(--ink)' : i === activeIdx ? 'var(--accent)' : 'var(--line-2)',
              width: i === activeIdx ? '14px' : '6px',
              borderRadius: i === activeIdx ? '3px' : '999px',
            }}
          />
        </div>
      ))}
    </div>
  );
}

function Header({ step, ear, freqIdx, onReset }) {
  return (
    <header className="stage flex items-center justify-between pt-6 pb-5">
      <Logo />
      <div className="flex items-center gap-4">
        <Stepper step={step} ear={ear} freqIdx={freqIdx} />
        {step !== 'setup' && (
          <button
            onClick={onReset}
            className="mono text-[10.5px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            title="Restart"
          >restart</button>
        )}
      </div>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SCREEN 1 — Setup
// ────────────────────────────────────────────────────────────────────────────

function SetupScreen({ onStart }) {
  const [headphones, setHeadphones] = useState(false);
  const [volume, setVolume]         = useState(false);
  const [quiet, setQuiet]           = useState(false);
  const ready = headphones && volume;

  return (
    <main className="stage scene-enter">
      <div className="card-lg p-7">
        <div className="mono text-[10.5px] uppercase tracking-[.18em] text-[var(--muted)]">Before you start</div>
        <h1 className="serif text-[34px] leading-[1.05] tracking-tight mt-2">
          Let's check<br/>your hearing.
        </h1>
        <p className="text-[14.5px] text-[var(--ink-2)] mt-3 leading-relaxed">
          A short test — about 3 minutes. We'll play tones at six pitches, in each ear.
        </p>

        {/* Hero headphone illustration */}
        <div className="mt-5 mb-5 flex justify-center">
          <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
            <path d="M 25 78 Q 25 25, 90 25 Q 155 25, 155 78"
                  stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <rect x="12"  y="68" width="28" height="42" rx="10" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2"/>
            <rect x="140" y="68" width="28" height="42" rx="10" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2"/>
            <rect x="17"  y="73" width="18" height="32" rx="6" fill="var(--accent-soft)"/>
            <rect x="145" y="73" width="18" height="32" rx="6" fill="var(--accent-soft)"/>
            {/* Sound waves */}
            <path d="M 46 89 q 3 -4 0 -8" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
            <path d="M 51 92 q 5 -7 0 -14" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".6"/>
            <path d="M 134 89 q -3 -4 0 -8" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
            <path d="M 129 92 q -5 -7 0 -14" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".6"/>
          </svg>
        </div>

        <div className="space-y-2.5">
          <Checkbox checked={headphones} onChange={setHeadphones}
                    label="Headphones connected"
                    sub="Over-ear or in-ear, both sides working" />
          <Checkbox checked={volume} onChange={setVolume}
                    label="Device volume at 50%"
                    sub="Use your side buttons to set it" />
          <Checkbox checked={quiet} onChange={setQuiet}
                    label="Quiet environment"
                    sub="Optional — but improves accuracy" optional />
        </div>

        <button
          disabled={!ready}
          onClick={onStart}
          className="hero-btn w-full mt-6 py-4 text-[15.5px] font-semibold tracking-tight"
        >
          {ready ? 'Start hearing test' : 'Confirm the steps above'}
        </button>
        <div className="mono text-[10px] text-center mt-2.5 text-[var(--muted)]">
          ~ 3 min · no microphone access needed
        </div>
      </div>
    </main>
  );
}

function Checkbox({ checked, onChange, label, sub, optional }) {
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
      <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
           style={{
             background: checked ? 'var(--accent)' : 'var(--surface)',
             border: checked ? '0' : '1.5px solid var(--line-2)',
           }}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.5 L5 9 L9.5 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-[14px] font-medium">{label}</div>
          {optional && <span className="mono text-[9.5px] uppercase tracking-wider text-[var(--muted)]">optional</span>}
        </div>
        {sub && <div className="text-[12.5px] text-[var(--muted)] mt-0.5">{sub}</div>}
      </div>
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SCREEN 2 — Ear intro
// ────────────────────────────────────────────────────────────────────────────

function EarIntroScreen({ ear, onBegin }) {
  const isLeft = ear === 'L';
  return (
    <main className="stage scene-enter">
      <div className="card-lg p-7">
        <div className="flex items-center justify-between">
          <div className="mono text-[10.5px] uppercase tracking-[.18em] text-[var(--muted)]">
            {isLeft ? 'Step 1 of 2' : 'Step 2 of 2'}
          </div>
          <EarBadgePair active={ear} />
        </div>

        <h1 className="serif text-[34px] leading-[1.05] tracking-tight mt-3">
          Now testing<br/>
          <span style={{ color: 'var(--accent)' }}>your {isLeft ? 'left' : 'right'} ear.</span>
        </h1>
        <p className="text-[14.5px] text-[var(--ink-2)] mt-3 leading-relaxed">
          You'll hear a series of tones at different pitches. They start very faint and grow
          louder. <strong>Tap the button the moment you hear anything</strong> — even barely.
        </p>

        <div className="mt-6 flex justify-center">
          <EarVisual side={ear} size={210} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <Stat n="6"  label="pitches" />
          <Stat n="~7s" label="each" />
          <Stat n="1"  label="tap each" />
        </div>

        <button
          onClick={onBegin}
          className="hero-btn w-full mt-6 py-4 text-[15.5px] font-semibold tracking-tight"
        >
          Begin {isLeft ? 'left' : 'right'} ear
        </button>
      </div>
    </main>
  );
}

function Stat({ n, label }) {
  return (
    <div className="card py-3 px-2">
      <div className="serif text-[22px] leading-none">{n}</div>
      <div className="mono text-[9.5px] uppercase tracking-wider text-[var(--muted)] mt-1.5">{label}</div>
    </div>
  );
}

function EarBadgePair({ active }) {
  const dot = (s) => (
    <div
      key={s}
      className="w-7 h-7 rounded-full flex items-center justify-center mono text-[11px] font-semibold transition-colors"
      style={{
        background: active === s ? 'var(--ink)' : 'transparent',
        color: active === s ? 'var(--surface)' : 'var(--muted)',
        border: active === s ? '0' : '1.5px solid var(--line-2)',
      }}
    >{s}</div>
  );
  return <div className="flex items-center gap-1.5">{dot('L')}{dot('R')}</div>;
}

function EarVisual({ side, size = 200 }) {
  // Concentric soft circles + central letter
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full" style={{ background: 'var(--accent-soft)', opacity: .35 }} />
      <div className="absolute rounded-full" style={{ inset: 22, background: 'var(--accent-soft)', opacity: .65 }} />
      <div className="absolute rounded-full flex items-center justify-center" style={{ inset: 44, background: 'var(--accent)' }}>
        <div className="serif text-[78px] leading-none text-white" style={{ marginTop: -6 }}>{side}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SCREEN 3 — Test (Web Audio)
// ────────────────────────────────────────────────────────────────────────────

function TestScreen({ ear, freqIdx, onHeard, onSkipNoResponse, onAllDone, audio, results, tone }) {
  const [phase, setPhase]         = useState('listening'); // listening | recorded
  const [currentDb, setCurrentDb] = useState(0);
  const recordedRef               = useRef(null);

  // Refs so async callbacks can be cancelled deterministically across unmounts/clicks
  const rafRef         = useRef(0);
  const advanceTimerRef = useRef(0);
  const phaseRef       = useRef('listening');
  const dbRef          = useRef(0);
  const resolvedRef    = useRef(false); // becomes true once this tone is finished (heard OR timed out)

  const freq = FREQS[freqIdx];

  const cancelPending = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
    if (advanceTimerRef.current) { clearTimeout(advanceTimerRef.current); advanceTimerRef.current = 0; }
  };

  // Start tone + ramp on every freq change
  useEffect(() => {
    cancelPending();
    resolvedRef.current = false;
    phaseRef.current = 'listening';
    dbRef.current = 0;
    setPhase('listening');
    setCurrentDb(0);

    audio.start(freq, ear, tone);
    audio.setDb(0);

    let startT = 0;

    const tick = (now) => {
      if (resolvedRef.current) return;
      if (!startT) startT = now;
      const t = Math.min(1, (now - startT) / RAMP_MS);
      const db = Math.round(t * 90);
      dbRef.current = db;
      setCurrentDb(db);
      audio.setDb(db);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // No response — record ceiling and advance after a short beat
        resolvedRef.current = true;
        rafRef.current = 0;
        recordedRef.current = 95;
        audio.stop();
        phaseRef.current = 'recorded';
        setPhase('recorded');
        advanceTimerRef.current = setTimeout(() => {
          advanceTimerRef.current = 0;
          onSkipNoResponse(95);
        }, RECORDED_HOLD_MS);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      // Mark resolved so any in-flight rAF bails, then cancel everything.
      resolvedRef.current = true;
      cancelPending();
      audio.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freq, ear, tone]);

  const handleHeard = () => {
    // Synchronous guard via ref so rapid keypress/click can't double-fire
    if (phaseRef.current !== 'listening' || resolvedRef.current) return;
    resolvedRef.current = true;
    const db = dbRef.current;
    recordedRef.current = db;
    cancelPending();        // kill the dB-ramping rAF immediately
    audio.stop();
    phaseRef.current = 'recorded';
    setPhase('recorded');
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = 0;
      onHeard(db);
    }, RECORDED_HOLD_MS);
  };

  // Keyboard shortcut: spacebar. Use a ref so we always call the latest handler.
  const handleHeardRef = useRef(handleHeard);
  handleHeardRef.current = handleHeard;
  useEffect(() => {
    const k = (e) => { if (e.code === 'Space') { e.preventDefault(); handleHeardRef.current?.(); } };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  const progress = (freqIdx + (phase === 'recorded' ? 1 : currentDb / 90)) / FREQS.length;

  return (
    <main className="stage scene-enter">
      <div className="card-lg p-6">
        {/* Top status bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EarBadgePair active={ear} />
            <span className="text-[13px] text-[var(--ink-2)] font-medium">{ear === 'L' ? 'Left' : 'Right'} ear</span>
          </div>
          <div className="mono text-[10.5px] uppercase tracking-[.16em] text-[var(--muted)]">
            tone {freqIdx + 1} of {FREQS.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
          <div
            className="h-full transition-[width] duration-150 ease-out"
            style={{ width: `${progress * 100}%`, background: 'var(--accent)' }}
          />
        </div>

        {/* Frequency dots strip */}
        <div className="mt-5 flex items-center justify-between px-1">
          {FREQS.map((f, i) => {
            const done = i < freqIdx || (i === freqIdx && phase === 'recorded');
            const cur  = i === freqIdx && phase === 'listening';
            return (
              <div key={f} className="flex flex-col items-center gap-1.5">
                <div
                  className="rounded-full transition-all"
                  style={{
                    width:  cur ? 10 : 7,
                    height: cur ? 10 : 7,
                    background: done ? 'var(--ink)' : cur ? 'var(--accent)' : 'var(--line-2)',
                    boxShadow: cur ? '0 0 0 4px rgba(15,138,122,0.18)' : 'none',
                  }}
                />
                <div className="mono text-[9.5px] num" style={{ color: cur ? 'var(--ink)' : 'var(--muted)', fontWeight: cur ? 600 : 400 }}>
                  {fmtHzShort(f)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hero pulse */}
        <div className="mt-6 mb-5 flex justify-center">
          <div className="relative" style={{ width: 240, height: 240 }}>
            {phase === 'listening' && (
              <>
                <div className="absolute inset-0 rounded-full pulse-ring" style={{ background: 'var(--accent-soft)' }} />
                <div className="absolute inset-0 rounded-full pulse-ring" style={{ background: 'var(--accent-soft)', animationDelay: '.6s' }} />
                <div className="absolute inset-0 rounded-full pulse-ring" style={{ background: 'var(--accent-soft)', animationDelay: '1.2s' }} />
              </>
            )}
            <div
              className={`absolute rounded-full flex flex-col items-center justify-center transition-colors ${phase === 'listening' ? 'breathe' : ''}`}
              style={{
                inset: 30,
                background: phase === 'recorded' ? 'var(--ink)' : 'var(--accent)',
                color: 'white',
              }}
            >
              {phase === 'listening' ? (
                <>
                  <div className="serif text-[44px] leading-none num">{freq >= 1000 ? freq / 1000 : freq}</div>
                  <div className="mono text-[10.5px] uppercase tracking-[.18em] opacity-80 mt-1">{freq >= 1000 ? 'kHz' : 'Hz'}</div>
                  <div className="mt-3 mono text-[13px] num opacity-95">{currentDb} dB</div>
                </>
              ) : (
                <>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13 L10 18 L19 7" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="mono text-[10.5px] uppercase tracking-[.18em] opacity-80 mt-2">recorded</div>
                  <div className="text-[13px] num opacity-95 mt-1">
                    {recordedRef.current === 95 ? 'no response' : `${recordedRef.current} dB`}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleHeard}
          disabled={phase !== 'listening'}
          className="hero-btn w-full py-4 text-[16px] font-semibold tracking-tight flex items-center justify-center gap-2"
        >
          {phase === 'listening' ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 11c0-4 4-7 8-7s8 3 8 7v3a4 4 0 0 1-4 4h-1v-7h5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 11v3a4 4 0 0 0 4 4h1v-7H4z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              I hear it
            </>
          ) : 'Got it'}
        </button>
        <div className="mono text-[10px] text-center mt-2.5 text-[var(--muted)]">
          tap as soon as you hear anything · or press <span className="px-1.5 py-0.5 rounded border border-[var(--line)]">space</span>
        </div>
      </div>
    </main>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SCREEN 4 — Results / Audiogram
// ────────────────────────────────────────────────────────────────────────────

function Audiogram({ left, right, w = 360, h = 240, showZones = true }) {
  const padL = 38, padR = 14, padT = 18, padB = 32;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const dbMax = 100;
  const xs = FREQS.map((_, i) => padL + (i / (FREQS.length - 1)) * innerW);
  const yFor = (db) => padT + (db / dbMax) * innerH;
  const dbTicks = [0, 20, 40, 60, 80, 100];

  const pathFor = (data) =>
    data.map((db, i) => (i === 0 ? 'M' : 'L') + xs[i].toFixed(1) + ' ' + yFor(Math.min(db, 95)).toFixed(1)).join(' ');

  // approx path length for draw animation (good enough)
  const pathLen = 700;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      {/* Severity zones */}
      {showZones && (
        <g>
          <rect x={padL} y={yFor(0)}  width={innerW} height={yFor(25)-yFor(0)}  fill="rgba(15,138,122,0.07)" />
          <rect x={padL} y={yFor(25)} width={innerW} height={yFor(40)-yFor(25)} fill="rgba(180,120,26,0.07)" />
          <rect x={padL} y={yFor(40)} width={innerW} height={yFor(55)-yFor(40)} fill="rgba(180,120,26,0.13)" />
          <rect x={padL} y={yFor(55)} width={innerW} height={yFor(70)-yFor(55)} fill="rgba(177,69,69,0.10)" />
          <rect x={padL} y={yFor(70)} width={innerW} height={yFor(100)-yFor(70)} fill="rgba(177,69,69,0.16)" />
        </g>
      )}

      {/* axes */}
      <rect x={padL} y={padT} width={innerW} height={innerH} fill="none" stroke="var(--ink)" strokeWidth="1" opacity=".5" />

      {/* horizontal grid + dB labels */}
      {dbTicks.map(db => (
        <g key={db}>
          <line x1={padL} y1={yFor(db)} x2={padL+innerW} y2={yFor(db)} stroke="var(--ink)" strokeWidth=".5" opacity=".15" />
          <text x={padL-7} y={yFor(db)+3.5} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono" fill="var(--muted)">{db}</text>
        </g>
      ))}
      <text x={padL-26} y={padT+innerH/2} textAnchor="middle" fontSize="9.5" fontFamily="JetBrains Mono" fill="var(--muted)"
            transform={`rotate(-90 ${padL-26} ${padT+innerH/2})`}>dB HL</text>

      {/* vertical grid + freq labels */}
      {FREQS.map((f, i) => (
        <g key={f}>
          <line x1={xs[i]} y1={padT} x2={xs[i]} y2={padT+innerH} stroke="var(--ink)" strokeWidth=".5" opacity=".1" />
          <text x={xs[i]} y={padT+innerH+15} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--muted)">
            {fmtHzShort(f)}
          </text>
        </g>
      ))}
      <text x={padL+innerW/2} y={h-4} textAnchor="middle" fontSize="9.5" fontFamily="JetBrains Mono" fill="var(--muted)">Frequency (Hz)</text>

      {/* Left ear: solid + X markers */}
      {left && left.length === 6 && (
        <>
          <path d={pathFor(left)} fill="none" stroke="var(--ink)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" className="plot-line"
                style={{ ['--len']: pathLen }} />
          {left.map((db, i) => (
            <g key={'L'+i} className="plot-point" style={{ animationDelay: `${0.55 + i*0.08}s` }}
               stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round">
              <line x1={xs[i]-5} y1={yFor(Math.min(db,95))-5} x2={xs[i]+5} y2={yFor(Math.min(db,95))+5} />
              <line x1={xs[i]-5} y1={yFor(Math.min(db,95))+5} x2={xs[i]+5} y2={yFor(Math.min(db,95))-5} />
            </g>
          ))}
        </>
      )}

      {/* Right ear: accent + O markers */}
      {right && right.length === 6 && (
        <>
          <path d={pathFor(right)} fill="none" stroke="var(--accent)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 4"
                className="plot-line" style={{ ['--len']: pathLen, animationDelay: '.25s' }} />
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

function StatusPill({ status }) {
  const map = {
    good:  { bg: 'rgba(15,138,122,0.13)', fg: 'var(--accent)', dot: 'var(--accent)' },
    warn:  { bg: 'rgba(180,120,26,0.13)', fg: 'var(--warn)',   dot: 'var(--warn)'   },
    bad:   { bg: 'rgba(177,69,69,0.13)',  fg: 'var(--danger)', dot: 'var(--danger)' },
    muted: { bg: 'var(--line)',           fg: 'var(--muted)',  dot: 'var(--muted)'  },
  };
  const c = map[status.tone] || map.muted;
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
         style={{ background: c.bg, color: c.fg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      <span className="text-[12.5px] font-semibold">{status.label}</span>
    </div>
  );
}

function ResultsScreen({ results, onRetake }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const left  = results.L;
  const right = results.R;
  const sL = classify(left);
  const sR = classify(right);
  // Worse-of-two for headline
  const headline = (sL.tone === 'bad' || sR.tone === 'bad') ? (sL.tone === 'bad' ? sL : sR)
                   : (sL.tone === 'warn' || sR.tone === 'warn') ? (sL.tone === 'warn' ? sL : sR)
                   : sL;

  const send = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  return (
    <main className="stage scene-enter" style={{ width: 'min(440px, calc(100vw - 24px))' }}>
      <div className="card-lg p-6">
        <div className="flex items-center justify-between">
          <div className="mono text-[10.5px] uppercase tracking-[.18em] text-[var(--muted)]">Your audiogram</div>
          <div className="mono text-[10.5px] text-[var(--muted)] num">{new Date().toLocaleDateString(undefined, { day:'2-digit', month:'short', year:'numeric' })}</div>
        </div>

        <h1 className="serif text-[30px] leading-[1.05] tracking-tight mt-2">{headline.label}</h1>
        <div className="mt-2"><StatusPill status={headline} /></div>

        <p className="text-[13.5px] text-[var(--ink-2)] mt-3 leading-relaxed">
          {headline.tone === 'good'
            ? 'Your hearing is within normal limits across the tested range. Keep protecting it from loud sounds.'
            : headline.tone === 'warn'
            ? 'A mild-to-moderate threshold shift was detected, especially at higher pitches. A follow-up consultation is recommended.'
            : 'Significant hearing loss was detected. We recommend scheduling a clinical evaluation with an audiologist.'}
        </p>

        {/* Chart */}
        <div className="mt-4 -mx-1 overflow-hidden rounded-2xl" style={{ background: 'var(--surface)' }}>
          <Audiogram left={left} right={right} w={400} h={250} showZones />
        </div>

        {/* Legend */}
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

        {/* Per-ear summary */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <EarSummaryCard ear="L" status={sL} data={left} />
          <EarSummaryCard ear="R" status={sR} data={right} />
        </div>

        {/* Actions */}
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
                  <path d="M5 13 L10 18 L19 7" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sent to OtoFarma
              </>
            ) : sending ? 'Sending…' : 'Send to OtoFarma'}
          </button>
          <div className="flex gap-2.5">
            <button onClick={() => window.print()}
                    className="flex-1 py-3 rounded-full text-[13.5px] font-medium border"
                    style={{ borderColor: 'var(--line-2)', color: 'var(--ink-2)' }}>
              Save PDF
            </button>
            <button onClick={onRetake}
                    className="flex-1 py-3 rounded-full text-[13.5px] font-medium border"
                    style={{ borderColor: 'var(--line-2)', color: 'var(--ink-2)' }}>
              Retake test
            </button>
          </div>
        </div>

        <div className="mono text-[10px] text-center mt-3 text-[var(--muted)] leading-relaxed">
          This is a screening test, not a clinical diagnosis.<br/>
          Consult an audiologist for a calibrated evaluation.
        </div>
      </div>
    </main>
  );
}

function EarSummaryCard({ ear, status, data }) {
  const pta = data ? ((data[1] + data[2] + data[3]) / 3).toFixed(0) : '—';
  return (
    <div className="card p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center mono text-[11px] font-semibold"
               style={{ background: ear === 'L' ? 'var(--ink)' : 'var(--accent)', color: 'white' }}>{ear}</div>
          <div className="text-[12.5px] font-medium">{ear === 'L' ? 'Left' : 'Right'}</div>
        </div>
        <div className="mono text-[10px] text-[var(--muted)] num">PTA {pta} dB</div>
      </div>
      <div className="mt-2 text-[12px] font-medium" style={{
        color: status.tone === 'good' ? 'var(--accent)' : status.tone === 'warn' ? 'var(--warn)' : 'var(--danger)'
      }}>{status.label}</div>
      <div className="mt-2 grid grid-cols-6 gap-1">
        {data && data.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className="w-full rounded-sm" style={{
              height: Math.max(2, (Math.min(v, 90) / 90) * 24),
              background: ear === 'L' ? 'var(--ink)' : 'var(--accent)',
              opacity: .85
            }} />
            <div className="mono text-[8.5px] text-[var(--muted)]">{fmtHzShort(FREQS[i])}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// App — state machine
// ────────────────────────────────────────────────────────────────────────────

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const audio = useAudioEngine();

  const [step, setStep]         = useState('setup');     // setup | earIntro | test | results
  const [ear, setEar]           = useState('L');
  const [freqIdx, setFreqIdx]   = useState(0);
  const [results, setResults]   = useState({ L: [], R: [] });

  // Sync accent into CSS
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  // Demo mode — jump straight to results with sample data
  const enterDemo = () => {
    setResults({ L: DEMO_LEFT, R: DEMO_RIGHT });
    setStep('results');
  };

  const reset = () => {
    audio.stop();
    setResults({ L: [], R: [] });
    setEar('L');
    setFreqIdx(0);
    setStep('setup');
  };

  const startTest = () => {
    audio.ensure(); // user gesture
    setEar('L');
    setFreqIdx(0);
    setResults({ L: [], R: [] });
    setStep('earIntro');
  };

  const beginEar = () => {
    setFreqIdx(0);
    setStep('test');
  };

  const onHeard = (db) => {
    setResults(r => {
      const next = { ...r, [ear]: [...r[ear], db] };
      return next;
    });
    advance();
  };
  const onSkipNoResponse = (db) => {
    setResults(r => ({ ...r, [ear]: [...r[ear], db] }));
    advance();
  };

  const advance = () => {
    if (freqIdx < FREQS.length - 1) {
      setFreqIdx(i => i + 1);
    } else {
      if (ear === 'L') {
        setEar('R');
        setFreqIdx(0);
        setStep('earIntro');
      } else {
        setStep('results');
      }
    }
  };

  let scene;
  if (step === 'setup')          scene = <SetupScreen onStart={startTest} />;
  else if (step === 'earIntro')  scene = <EarIntroScreen ear={ear} onBegin={beginEar} />;
  else if (step === 'test')      scene = <TestScreen
                                             ear={ear} freqIdx={freqIdx}
                                             audio={audio} results={results}
                                             tone={t.tone}
                                             onHeard={onHeard}
                                             onSkipNoResponse={onSkipNoResponse}
                                             onAllDone={() => setStep('results')}
                                           />;
  else if (step === 'results')   scene = <ResultsScreen results={results} onRetake={reset} />;

  return (
    <div className="min-h-screen pb-10" data-screen-label={step}>
      <Header step={step} ear={ear} freqIdx={freqIdx} onReset={reset} />
      <div key={step + ear + freqIdx}>{scene}</div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakColor label="Accent" value={t.accent}
          options={['#0f8a7a', '#2a6fdb', '#7a5ae0', '#d97757']}
          onChange={(v) => setTweak('accent', v)} />

        <TweakSection label="Audio" />
        <TweakSelect label="Tone" value={t.tone}
          options={['sine', 'triangle', 'square']}
          onChange={(v) => setTweak('tone', v)} />

        <TweakSection label="Demo" />
        <TweakButton label="Skip to results" onClick={enterDemo} />
        <TweakButton label="Restart flow" onClick={reset} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
