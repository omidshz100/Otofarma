import { cn } from "../../lib/cn";

interface Props {
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  tone?: "neutral" | "good" | "warn" | "bad" | "info";
}

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  neutral: "text-clinical-muted",
  good: "text-emerald-600",
  warn: "text-amber-600",
  bad: "text-rose-600",
  info: "text-clinical-accent",
};

export default function StatTile({
  label,
  value,
  unit,
  trend,
  tone = "neutral",
}: Props) {
  return (
    <div className="rounded-xl border border-clinical-border bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wider text-clinical-muted">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span
          className="font-semibold tracking-tight text-clinical-ink"
          style={{ font: "600 28px ui-monospace, 'Geist Mono', monospace" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-clinical-muted">
            {unit}
          </span>
        )}
      </div>
      {trend && (
        <div className={cn("mt-1.5 text-xs font-medium", TONE[tone])}>
          {trend}
        </div>
      )}
    </div>
  );
}
