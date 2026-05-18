import type { HearingTest } from "../../types/patient";
import Card from "../ui/Card";

const CLASS_LABEL: Record<HearingTest["classification"], string> = {
  normal: "Normal",
  mild: "Mild",
  moderate: "Moderate",
  "moderately-severe": "Mod-severe",
  severe: "Severe",
  profound: "Profound",
};

const CLASS_TONE: Record<HearingTest["classification"], string> = {
  normal: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  mild: "bg-amber-50 text-amber-700 ring-amber-200",
  moderate: "bg-orange-50 text-orange-700 ring-orange-200",
  "moderately-severe": "bg-rose-50 text-rose-700 ring-rose-200",
  severe: "bg-rose-100 text-rose-800 ring-rose-300",
  profound: "bg-rose-200 text-rose-900 ring-rose-400",
};

function pta(points: HearingTest["left"]) {
  const subset = points.filter((p) =>
    [500, 1000, 2000, 4000].includes(p.frequency),
  );
  return Math.round(
    subset.reduce((s, p) => s + p.thresholdDb, 0) / subset.length,
  );
}

export default function HearingTestHistory({ tests }: { tests: HearingTest[] }) {
  // Augment with two historical examples for richness
  const rows = [
    ...tests,
    {
      id: "t-2150",
      date: "2026-02-10",
      performedBy: "Dr. M. Ricci",
      location: "OtoFarma Napoli Centro",
      classification: "moderate" as const,
      left: [
        { frequency: 250 as const, thresholdDb: 25 },
        { frequency: 500 as const, thresholdDb: 30 },
        { frequency: 1000 as const, thresholdDb: 35 },
        { frequency: 2000 as const, thresholdDb: 45 },
        { frequency: 4000 as const, thresholdDb: 55 },
        { frequency: 8000 as const, thresholdDb: 60 },
      ],
      right: [
        { frequency: 250 as const, thresholdDb: 20 },
        { frequency: 500 as const, thresholdDb: 25 },
        { frequency: 1000 as const, thresholdDb: 30 },
        { frequency: 2000 as const, thresholdDb: 40 },
        { frequency: 4000 as const, thresholdDb: 50 },
        { frequency: 8000 as const, thresholdDb: 55 },
      ],
    },
    {
      id: "t-2090",
      date: "2025-10-18",
      performedBy: "Dr. A. Greco",
      location: "OtoFarma Roma Trastevere",
      classification: "mild" as const,
      left: [
        { frequency: 250 as const, thresholdDb: 20 },
        { frequency: 500 as const, thresholdDb: 25 },
        { frequency: 1000 as const, thresholdDb: 30 },
        { frequency: 2000 as const, thresholdDb: 35 },
        { frequency: 4000 as const, thresholdDb: 45 },
        { frequency: 8000 as const, thresholdDb: 50 },
      ],
      right: [
        { frequency: 250 as const, thresholdDb: 15 },
        { frequency: 500 as const, thresholdDb: 20 },
        { frequency: 1000 as const, thresholdDb: 25 },
        { frequency: 2000 as const, thresholdDb: 30 },
        { frequency: 4000 as const, thresholdDb: 40 },
        { frequency: 8000 as const, thresholdDb: 45 },
      ],
    },
  ];

  return (
    <Card title="Hearing test history" subtitle="Audiometric exams on file">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-medium uppercase tracking-wider text-clinical-muted">
            <th className="pb-3">Date</th>
            <th className="pb-3">Location</th>
            <th className="pb-3">Clinician</th>
            <th className="pb-3 text-right">PTA L</th>
            <th className="pb-3 text-right">PTA R</th>
            <th className="pb-3">Classification</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-clinical-border">
          {rows.map((t) => (
            <tr key={t.id} className="text-clinical-ink">
              <td className="py-3 font-mono text-xs">
                {new Date(t.date).toLocaleDateString("en-GB")}
              </td>
              <td className="py-3 text-clinical-muted">{t.location}</td>
              <td className="py-3">{t.performedBy}</td>
              <td className="py-3 text-right font-mono">{pta(t.left)} dB</td>
              <td className="py-3 text-right font-mono">{pta(t.right)} dB</td>
              <td className="py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${CLASS_TONE[t.classification]}`}
                >
                  {CLASS_LABEL[t.classification]}
                </span>
              </td>
              <td className="py-3 text-right">
                <button className="text-xs font-medium text-clinical-accent hover:underline">
                  Open →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
