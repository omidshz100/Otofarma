import type { Ear } from '../hooks/useAudioEngine';
import EarBadgePair from '../components/EarBadgePair';

function EarVisual({ side, size = 200 }: { side: Ear; size?: number }) {
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

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="card py-3 px-2 text-center">
      <div className="serif text-[22px] leading-none">{n}</div>
      <div className="mono text-[9.5px] uppercase tracking-wider mt-1.5" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  );
}

interface Props { ear: Ear; onBegin: () => void; }

export default function EarIntroScreen({ ear, onBegin }: Props) {
  const isLeft = ear === 'L';
  return (
    <main className="stage scene-enter">
      <div className="card-lg p-7">
        <div className="flex items-center justify-between">
          <div className="mono text-[10.5px] uppercase tracking-[.18em]" style={{ color: 'var(--muted)' }}>
            {isLeft ? 'Step 1 of 2' : 'Step 2 of 2'}
          </div>
          <EarBadgePair active={ear} />
        </div>

        <h1 className="serif text-[34px] leading-[1.05] tracking-tight mt-3">
          Now testing<br />
          <span style={{ color: 'var(--accent)' }}>your {isLeft ? 'left' : 'right'} ear.</span>
        </h1>
        <p className="text-[14.5px] mt-3 leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          You'll hear a series of tones at different pitches. They start very faint and grow louder.{' '}
          <strong>Tap the button the moment you hear anything</strong> — even barely.
        </p>

        <div className="mt-6 flex justify-center">
          <EarVisual side={ear} size={210} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Stat n="6"   label="pitches" />
          <Stat n="~7s" label="each"    />
          <Stat n="1"   label="tap each" />
        </div>

        <button onClick={onBegin} className="hero-btn w-full mt-6 py-4 text-[15.5px] font-semibold tracking-tight">
          Begin {isLeft ? 'left' : 'right'} ear
        </button>
      </div>
    </main>
  );
}
