import { Search, Filter } from "lucide-react";
import type { Patient } from "../../types/patient";
import { cn } from "../../lib/cn";

interface Props {
  patients: Patient[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const STATUS_DOT: Record<Patient["status"], string> = {
  active: "bg-emerald-500",
  "follow-up": "bg-clinical-accent",
  new: "bg-sky-500",
  discharged: "bg-zinc-400",
};

export default function PatientListPanel({ patients, selectedId, onSelect }: Props) {
  return (
    <aside className="flex h-full flex-col border-r border-clinical-border bg-white">
      <div className="border-b border-clinical-border px-5 py-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-clinical-ink">
            Patients
          </h2>
          <span className="font-mono text-xs text-clinical-muted">
            {patients.length} active
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-clinical-border bg-clinical-bg px-3 py-2">
          <Search size={14} className="text-clinical-muted" />
          <input
            placeholder="Search by name, ID, phone…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-clinical-muted"
          />
          <button className="text-clinical-muted hover:text-clinical-ink">
            <Filter size={14} />
          </button>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto py-2">
        {patients.map((p) => {
          const active = p.id === selectedId;
          return (
            <li key={p.id}>
              <button
                onClick={() => onSelect(p.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-l-2 px-5 py-3 text-left transition",
                  active
                    ? "border-clinical-accent bg-clinical-accent/5"
                    : "border-transparent hover:bg-clinical-bg",
                )}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ background: p.avatarColor }}
                >
                  {p.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="truncate text-sm font-medium text-clinical-ink">
                      {p.firstName} {p.lastName}
                    </div>
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        STATUS_DOT[p.status],
                      )}
                    />
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-clinical-muted">
                    <span className="font-mono">{p.id}</span>
                    <span>·</span>
                    <span className="truncate">{p.city}</span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
