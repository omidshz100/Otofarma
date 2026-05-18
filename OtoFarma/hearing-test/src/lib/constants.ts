export const FREQS = [250, 500, 1000, 2000, 4000, 8000] as const;
export type Freq = (typeof FREQS)[number];

export const RAMP_MS = 7000;
export const RECORDED_HOLD_MS = 850;
export const TONE_FADE = 0.035;
export const MAX_GAIN = 0.28;

export const DEMO_LEFT  = [10, 15, 20, 25, 35, 45];
export const DEMO_RIGHT = [15, 10, 15, 20, 25, 35];

export const dbToGain = (db: number): number =>
  MAX_GAIN * Math.pow(10, (Math.max(0, Math.min(90, db)) - 90) / 20);

export const fmtHz = (f: number): string =>
  f >= 1000 ? f / 1000 + ' kHz' : f + ' Hz';

export const fmtHzShort = (f: number): string =>
  f >= 1000 ? f / 1000 + 'k' : '' + f;
