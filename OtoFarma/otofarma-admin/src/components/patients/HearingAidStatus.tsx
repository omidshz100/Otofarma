import type { HearingAid } from "../../types/patient";
import Card from "../ui/Card";
import { BatteryMedium, Wrench } from "lucide-react";

export default function HearingAidStatus({ aids }: { aids: HearingAid[] }) {
  return (
    <Card
      title="Fitted devices"
      actions={
        <button className="text-xs font-medium text-clinical-accent hover:underline">
          Order new →
        </button>
      }
    >
      <ul className="space-y-4">
        {aids.map((a) => (
          <li
            key={a.id}
            className="rounded-lg border border-clinical-border bg-clinical-bg p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-clinical-ink">
                  {a.model}
                </div>
                <div className="mt-0.5 font-mono text-xs text-clinical-muted">
                  S/N {a.serial}
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {a.status}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <Meta label="Ear">
                {a.ear === "both" ? "Bilateral" : a.ear === "left" ? "Left" : "Right"}
              </Meta>
              <Meta label="Fitted">
                {a.fittedOn
                  ? new Date(a.fittedOn).toLocaleDateString("en-GB")
                  : "—"}
              </Meta>
            </div>

            {typeof a.batteryLevel === "number" && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 text-clinical-muted">
                    <BatteryMedium size={14} /> Battery health
                  </span>
                  <span className="font-mono text-clinical-ink">
                    {a.batteryLevel}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-clinical-accent"
                    style={{ width: `${a.batteryLevel}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-md border border-clinical-border bg-white px-2.5 py-1.5 text-xs font-medium text-clinical-ink hover:bg-clinical-bg">
                <Wrench size={12} /> Service
              </button>
              <button className="rounded-md border border-clinical-border bg-white px-2.5 py-1.5 text-xs font-medium text-clinical-ink hover:bg-clinical-bg">
                Adjust program
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-clinical-muted">
        {label}
      </div>
      <div className="mt-0.5 text-clinical-ink">{children}</div>
    </div>
  );
}
