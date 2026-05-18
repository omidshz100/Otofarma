import { useState, useEffect, useRef } from 'react';
import type { Ear, WaveformType } from '../hooks/useAudioEngine';
import type { useAudioEngine } from '../hooks/useAudioEngine';
import { FREQS, RAMP_MS, RECORDED_HOLD_MS } from '../lib/constants';
import { fmtHzShort } from '../lib/constants';
import EarBadgePair from '../components/EarBadgePair';

type AudioEngine = ReturnType<typeof useAudioEngine>;
type Phase = 'listening' | 'recorded';

interface Props {
  ear: Ear;
  freqIdx: number;
  audio: AudioEngine;
  tone: WaveformType;
  onHeard: (db: number) => void;
  onSkipNoResponse: (db: number) => void;
}

export default function TestScreen({ ear, freqIdx, audio, tone, onHeard, onSkipNoResponse }: Props) {
  const [phase, setPhase]       = useState<Phase>('listening');
  const [currentDb, setCurrentDb] = useState(0);
  const recordedRef             = useRef<number>(0);

  const rafRef          = useRef<number>(0);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef        = useRef<Phase>('listening');
  const dbRef           = useRef(0);
  const resolvedRef     = useRef(false);

  const freq = FREQS[freqIdx];

  const cancelPending = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
    if (advanceTimerRef.current) { clearTimeout(advanceTimerRef.current); advanceTimerRef.current = null; }
  };

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

    const tick = (now: number) => {
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
        resolvedRef.current = true;
        rafRef.current = 0;
        recordedRef.current = 95;
        audio.stop();
        phaseRef.current = 'recorded';
        setPhase('recorded');
        advanceTimerRef.current = setTimeout(() => {
          advanceTimerRef.current = null;
          onSkipNoResponse(95);
        }, RECORDED_HOLD_MS);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      resolvedRef.current = true;
      cancelPending();
      audio.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freq, ear, tone]);

  const handleHeard = () => {
    if (phaseRef.current !== 'listening' || resolvedRef.current) return;
    resolvedRef.current = true;
    const db = dbRef.current;
    recordedRef.current = db;
    cancelPending();
    audio.stop();
    phaseRef.current = 'recorded';
    setPhase('recorded');
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      onHeard(db);
    }, RECORDED_HOLD_MS);
  };

  const handleHeardRef = useRef(handleHeard);
  handleHeardRef.current = handleHeard;
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); handleHeardRef.current(); }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  const progress = (freqIdx + (phase === 'recorded' ? 1 : currentDb / 90)) / FREQS.length;

  return (
    <main className="stage scene-enter">
      <div className="card-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EarBadgePair active={ear} />
            <span className="text-[13px] font-medium" style={{ color: 'var(--ink-2)' }}>
              {ear === 'L' ? 'Left' : 'Right'} ear
            </span>
          </div>
          <div className="mono text-[10.5px] uppercase tracking-[.16em]" style={{ color: 'var(--muted)' }}>
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

        {/* Frequency dots */}
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
                <div
                  className="mono text-[9.5px] num"
                  style={{ color: cur ? 'var(--ink)' : 'var(--muted)', fontWeight: cur ? 600 : 400 }}
                >
                  {fmtHzShort(f)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hero pulse blob */}
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
                  <div className="serif text-[44px] leading-none num">
                    {freq >= 1000 ? freq / 1000 : freq}
                  </div>
                  <div className="mono text-[10.5px] uppercase tracking-[.18em] opacity-80 mt-1">
                    {freq >= 1000 ? 'kHz' : 'Hz'}
                  </div>
                  <div className="mt-3 mono text-[13px] num opacity-95">{currentDb} dB</div>
                </>
              ) : (
                <>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13 L10 18 L19 7" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
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

        <button
          onClick={handleHeard}
          disabled={phase !== 'listening'}
          className="hero-btn w-full py-4 text-[16px] font-semibold tracking-tight flex items-center justify-center gap-2"
        >
          {phase === 'listening' ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 11c0-4 4-7 8-7s8 3 8 7v3a4 4 0 0 1-4 4h-1v-7h5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 11v3a4 4 0 0 0 4 4h1v-7H4z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              I hear it
            </>
          ) : 'Got it'}
        </button>
        <div className="mono text-[10px] text-center mt-2.5" style={{ color: 'var(--muted)' }}>
          tap as soon as you hear anything · or press{' '}
          <span className="px-1.5 py-0.5 rounded border" style={{ borderColor: 'var(--line)' }}>space</span>
        </div>
      </div>
    </main>
  );
}
