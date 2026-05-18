export type StatusTone = 'good' | 'warn' | 'bad' | 'muted';

export interface HearingStatus {
  key: string;
  label: string;
  tone: StatusTone;
}

export function classify(arr: number[] | null): HearingStatus {
  if (!arr || arr.length < 6)
    return { key: 'pending', label: 'In progress', tone: 'muted' };
  const pta = (arr[1] + arr[2] + arr[3]) / 3;
  if (pta <= 25) return { key: 'normal',   label: 'Normal hearing',    tone: 'good' };
  if (pta <= 40) return { key: 'mild',     label: 'Mild loss',         tone: 'warn' };
  if (pta <= 55) return { key: 'moderate', label: 'Moderate loss',     tone: 'warn' };
  if (pta <= 70) return { key: 'modsev',   label: 'Moderately severe', tone: 'bad'  };
  if (pta <= 90) return { key: 'severe',   label: 'Severe loss',       tone: 'bad'  };
  return { key: 'profound', label: 'Profound loss', tone: 'bad' };
}
