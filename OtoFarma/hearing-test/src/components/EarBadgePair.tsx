import type { Ear } from '../hooks/useAudioEngine';

interface Props { active: Ear; }

export default function EarBadgePair({ active }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      {(['L', 'R'] as Ear[]).map((s) => (
        <div key={s}
          className="w-7 h-7 rounded-full flex items-center justify-center mono text-[11px] font-semibold transition-colors"
          style={{
            background: active === s ? 'var(--ink)' : 'transparent',
            color: active === s ? 'var(--surface)' : 'var(--muted)',
            border: active === s ? '0' : '1.5px solid var(--line-2)',
          }}
        >{s}</div>
      ))}
    </div>
  );
}
