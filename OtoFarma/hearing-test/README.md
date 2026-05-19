# OtoFarma — Hearing Test

A mobile-web hearing screening app built for OtoFarma. Patients open it in their phone browser, put on headphones, and complete a pure-tone audiometry test across 6 frequencies in each ear. Results are shown as an interactive audiogram with automatic classification.

## Features

- Real pure-tone audiometry via the Web Audio API (OscillatorNode, GainNode, StereoPanner)
- Tests 6 frequencies: 250 Hz, 500 Hz, 1 kHz, 2 kHz, 4 kHz, 8 kHz — both ears
- dB ramp from 0 → 90 dB HL over ~7 seconds per tone
- Automatic PTA (Pure Tone Average) classification: Normal / Mild / Moderate / Moderately Severe / Severe / Profound
- Animated SVG audiogram on the results screen
- Keyboard shortcut: `Space` to respond during test
- Mobile-first layout (max 420 px), touch-friendly tap targets
- PWA-ready meta tags (add to Home Screen on iOS/Android)

## Tech Stack

| | |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Audio | Web Audio API (browser-native, no library) |
| Deployment | Vercel |

## Project Structure

```
src/
├── App.tsx                  # Top-level state machine (setup → earIntro → test → results)
├── index.css                # Tailwind directives + CSS variables + animations
├── hooks/
│   └── useAudioEngine.ts    # OscillatorNode lifecycle, dB ramping, stereo panning
├── lib/
│   ├── constants.ts         # Frequencies, timing, dB helpers
│   └── classify.ts          # PTA hearing classification logic
├── components/
│   ├── Logo.tsx
│   ├── Stepper.tsx          # 4-step progress indicator
│   └── EarBadgePair.tsx     # L / R ear indicator
└── screens/
    ├── SetupScreen.tsx      # Pre-test checklist (headphones, volume)
    ├── EarIntroScreen.tsx   # Per-ear intro with visual
    ├── TestScreen.tsx       # Live tone player + "I hear it" button
    └── ResultsScreen.tsx    # Audiogram chart + per-ear summary + send/save actions
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The dev server runs at `http://localhost:5173`.

## Deployment

The project deploys automatically to Vercel on every push to `main`. Build config is defined in `vercel.json` at the repo root:

- **Build command:** `cd OtoFarma/hearing-test && npm install && npm run build`
- **Output directory:** `OtoFarma/hearing-test/dist`

## Clinical Disclaimer

This app is a screening tool only — not a substitute for a calibrated clinical audiogram. Results depend on the user's device, headphones, and ambient environment. Always recommend a follow-up with a licensed audiologist for any detected threshold shift.
