import type { Ear } from '../hooks/useAudioEngine';

type Step = 'setup' | 'earIntro' | 'test' | 'results';

interface Props {
  step: Step;
  ear: Ear;
}

export default function Stepper({ step, ear }: Props) {
  const phases = ['setup', 'L', 'R', 'results'];
  let activeIdx = 0;
  if (step === 'setup') activeIdx = 0;
  else if (step === 'earIntro' || step === 'test') activeIdx = ear === 'L' ? 1 : 2;
  else if (step === 'results') activeIdx = 3;

  return (
    <div className="flex items-center gap-1.5">
      {phases.map((p, i) => (
        <div key={p}
          className="rounded-full transition-all duration-300"
          style={{
            background: i < activeIdx ? 'var(--ink)' : i === activeIdx ? 'var(--accent)' : 'var(--line-2)',
            width: i === activeIdx ? '14px' : '6px',
            height: '6px',
            borderRadius: i === activeIdx ? '3px' : '999px',
          }}
        />
      ))}
    </div>
  );
}
