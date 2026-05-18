import type { HearingTest } from "../../types/patient";
import Card from "../ui/Card";

interface Props {
  test: HearingTest;
}

const FREQS: HearingTest["left"][number]["frequency"][] = [
  250, 500, 1000, 2000, 4000, 8000,
];
// dB HL bands shown on the y-axis (audiogram convention: low at top, high at bottom)
const DB_MIN = -10;
const DB_MAX = 90;

const W = 720;
const H = 340;
const PAD_L = 56;
const PAD_R = 24;
const PAD_T = 28;
const PAD_B = 40;
const innerW = W - PAD_L - PAD_R;
const innerH = H - PAD_T - PAD_B;

function xFor(i: number) {
  return PAD_L + (innerW * i) / (FREQS.length - 1);
}
function yFor(db: number) {
  return PAD_T + ((db - DB_MIN) / (DB_MAX - DB_MIN)) * innerH;
}

const SEVERITY_BANDS = [
  { from: -10, to: 25, label: "Normal", color: "#ECFEF4" },
  { from: 25, to: 40, label: "Mild", color: "#FEF7E6" },
  { from: 40, to: 55, label: "Moderate", color: "#FDECD7" },
  { from: 55, to: 70, label: "Mod-severe", color: "#FBDDD0" },
  { from: 70, to: 90, label: "Severe", color: "#F6CFCF" },
];

export default function Audiogram({ test }: Props) {
  const leftPath = test.left
    .map((pt, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(pt.thresholdDb)}`)
    .join(" ");
  const rightPath = test.right
    .map((pt, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(pt.thresholdDb)}`)
    .join(" ");

  return (
    <Card
      title="Audiogram — air conduction"
      subtitle={`Performed ${new Date(test.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} · ${test.performedBy}`}
      actions={
        <div className="flex items-center gap-4 text-xs text-clinical-muted">
          <Legend swatch="#0EA5A8" shape="o" label="Right ear" />
          <Legend swatch="#2563EB" shape="x" label="Left ear" />
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Severity bands */}
        {SEVERITY_BANDS.map((b) => (
          <rect
            key={b.label}
            x={PAD_L}
            y={yFor(b.from)}
            width={innerW}
            height={yFor(b.to) - yFor(b.from)}
            fill={b.color}
            opacity={0.55}
          />
        ))}

        {/* Y grid + labels */}
        {Array.from({ length: 11 }, (_, i) => DB_MIN + i * 10).map((db) => (
          <g key={db}>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={yFor(db)}
              y2={yFor(db)}
              stroke="#E5E8EC"
              strokeWidth={db === 0 ? 1.5 : 1}
            />
            <text
              x={PAD_L - 10}
              y={yFor(db) + 4}
              textAnchor="end"
              className="fill-clinical-muted"
              style={{ font: "500 11px ui-monospace, Geist Mono, monospace" }}
            >
              {db}
            </text>
          </g>
        ))}

        {/* X grid + freq labels */}
        {FREQS.map((f, i) => (
          <g key={f}>
            <line
              x1={xFor(i)}
              x2={xFor(i)}
              y1={PAD_T}
              y2={H - PAD_B}
              stroke="#E5E8EC"
            />
            <text
              x={xFor(i)}
              y={H - PAD_B + 18}
              textAnchor="middle"
              className="fill-clinical-muted"
              style={{ font: "500 11px ui-monospace, Geist Mono, monospace" }}
            >
              {f >= 1000 ? `${f / 1000}k` : f}
            </text>
          </g>
        ))}

        {/* Axis titles */}
        <text
          x={PAD_L - 38}
          y={PAD_T + innerH / 2}
          transform={`rotate(-90 ${PAD_L - 38} ${PAD_T + innerH / 2})`}
          textAnchor="middle"
          className="fill-clinical-ink"
          style={{ font: "600 11px ui-sans-serif, system-ui" }}
        >
          Hearing level (dB HL)
        </text>
        <text
          x={PAD_L + innerW / 2}
          y={H - 6}
          textAnchor="middle"
          className="fill-clinical-ink"
          style={{ font: "600 11px ui-sans-serif, system-ui" }}
        >
          Frequency (Hz)
        </text>

        {/* Right ear */}
        <path d={rightPath} fill="none" stroke="#0EA5A8" strokeWidth={2} />
        {test.right.map((pt, i) => (
          <circle
            key={`r-${pt.frequency}`}
            cx={xFor(i)}
            cy={yFor(pt.thresholdDb)}
            r={6}
            fill="white"
            stroke="#0EA5A8"
            strokeWidth={2}
          />
        ))}

        {/* Left ear */}
        <path
          d={leftPath}
          fill="none"
          stroke="#2563EB"
          strokeWidth={2}
          strokeDasharray="4 3"
        />
        {test.left.map((pt, i) => {
          const x = xFor(i);
          const y = yFor(pt.thresholdDb);
          return (
            <g key={`l-${pt.frequency}`}>
              <line
                x1={x - 5}
                y1={y - 5}
                x2={x + 5}
                y2={y + 5}
                stroke="#2563EB"
                strokeWidth={2}
              />
              <line
                x1={x - 5}
                y1={y + 5}
                x2={x + 5}
                y2={y - 5}
                stroke="#2563EB"
                strokeWidth={2}
              />
            </g>
          );
        })}
      </svg>
    </Card>
  );
}

function Legend({
  swatch,
  shape,
  label,
}: {
  swatch: string;
  shape: "o" | "x";
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="18" height="18" viewBox="0 0 18 18">
        {shape === "o" ? (
          <circle cx="9" cy="9" r="5" fill="white" stroke={swatch} strokeWidth="2" />
        ) : (
          <>
            <line x1="4" y1="4" x2="14" y2="14" stroke={swatch} strokeWidth="2" />
            <line x1="14" y1="4" x2="4" y2="14" stroke={swatch} strokeWidth="2" />
          </>
        )}
      </svg>
      <span>{label}</span>
    </span>
  );
}
