import { useState, useEffect } from 'react';
import { useAudioEngine, type Ear } from './hooks/useAudioEngine';
import { FREQS } from './lib/constants';
import Logo from './components/Logo';
import Stepper from './components/Stepper';
import SetupScreen from './screens/SetupScreen';
import EarIntroScreen from './screens/EarIntroScreen';
import TestScreen from './screens/TestScreen';
import ResultsScreen from './screens/ResultsScreen';

type Step = 'setup' | 'earIntro' | 'test' | 'results';
type Results = { L: number[]; R: number[] };

function Header({ step, ear, onReset }: { step: Step; ear: Ear; onReset: () => void }) {
  return (
    <header className="stage flex items-center justify-between pt-6 pb-5">
      <Logo />
      <div className="flex items-center gap-4">
        <Stepper step={step} ear={ear} />
        {step !== 'setup' && (
          <button
            onClick={onReset}
            className="mono text-[10.5px] uppercase tracking-wider transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >restart</button>
        )}
      </div>
    </header>
  );
}

export default function App() {
  const audio = useAudioEngine();

  const [step, setStep]       = useState<Step>('setup');
  const [ear, setEar]         = useState<Ear>('L');
  const [freqIdx, setFreqIdx] = useState(0);
  const [results, setResults] = useState<Results>({ L: [], R: [] });

  useEffect(() => {
    document.body.classList.add('bg-grid');
    return () => document.body.classList.remove('bg-grid');
  }, []);

  const reset = () => {
    audio.stop();
    setResults({ L: [], R: [] });
    setEar('L');
    setFreqIdx(0);
    setStep('setup');
  };

  const startTest = () => {
    audio.ensure();
    setEar('L');
    setFreqIdx(0);
    setResults({ L: [], R: [] });
    setStep('earIntro');
  };

  const beginEar = () => {
    setFreqIdx(0);
    setStep('test');
  };

  const advance = () => {
    if (freqIdx < FREQS.length - 1) {
      setFreqIdx(i => i + 1);
    } else if (ear === 'L') {
      setEar('R');
      setFreqIdx(0);
      setStep('earIntro');
    } else {
      setStep('results');
    }
  };

  const onHeard = (db: number) => {
    setResults(r => ({ ...r, [ear]: [...r[ear], db] }));
    advance();
  };

  const onSkipNoResponse = (db: number) => {
    setResults(r => ({ ...r, [ear]: [...r[ear], db] }));
    advance();
  };

  let scene: React.ReactNode;
  if (step === 'setup')
    scene = <SetupScreen onStart={startTest} />;
  else if (step === 'earIntro')
    scene = <EarIntroScreen ear={ear} onBegin={beginEar} />;
  else if (step === 'test')
    scene = <TestScreen ear={ear} freqIdx={freqIdx} audio={audio} tone="sine"
               onHeard={onHeard} onSkipNoResponse={onSkipNoResponse} />;
  else
    scene = <ResultsScreen results={results} onRetake={reset} />;

  return (
    <div className="min-h-screen pb-10">
      <Header step={step} ear={ear} onReset={reset} />
      <div key={step + ear + freqIdx}>{scene}</div>
    </div>
  );
}
