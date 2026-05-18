import { useRef, useCallback, useEffect } from 'react';
import { dbToGain, TONE_FADE } from '../lib/constants';

export type Ear = 'L' | 'R';
export type WaveformType = 'sine' | 'triangle' | 'square';

export function useAudioEngine() {
  const ctxRef  = useRef<AudioContext | null>(null);
  const oscRef  = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const panRef  = useRef<StereoPannerNode | null>(null);

  const ensure = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || !oscRef.current || !gainRef.current) return;
    const t = ctx.currentTime;
    try {
      gainRef.current.gain.cancelScheduledValues(t);
      gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, t);
      gainRef.current.gain.linearRampToValueAtTime(0, t + TONE_FADE);
      oscRef.current.stop(t + TONE_FADE + 0.02);
    } catch (_) { /* node already stopped */ }
    oscRef.current = null;
    gainRef.current = null;
    panRef.current = null;
  }, []);

  const start = useCallback((freq: number, ear: Ear, waveform: WaveformType = 'sine') => {
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
    osc.start();
    oscRef.current = osc;
    gainRef.current = gain;
    panRef.current = pan;
  }, [ensure, stop]);

  const setDb = useCallback((db: number) => {
    const ctx = ctxRef.current;
    if (!ctx || !gainRef.current) return;
    gainRef.current.gain.setTargetAtTime(dbToGain(db), ctx.currentTime, 0.02);
  }, []);

  useEffect(() => () => {
    stop();
    try { ctxRef.current?.close(); } catch (_) {}
  }, [stop]);

  return { ensure, start, stop, setDb };
}
