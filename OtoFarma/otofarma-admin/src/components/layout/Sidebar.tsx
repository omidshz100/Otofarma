import {
  Activity,
  Users,
  ClipboardList,
  Video,
  Building2,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { cn } from "../../lib/cn";

const PRIMARY = [
  { icon: Activity, label: "Overview", to: "/" },
  { icon: Users, label: "Patients", to: "/patients", active: true, badge: 248 },
  { icon: ClipboardList, label: "Orders", to: "/orders", badge: 12 },
  { icon: Video, label: "Video calls", to: "/calls", badge: 4 },
  { icon: Building2, label: "Pharmacies", to: "/pharmacies" },
];

const SECONDARY = [
  { icon: Settings, label: "Settings", to: "/settings" },
  { icon: HelpCircle, label: "Help", to: "/help" },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-[232px] shrink-0 flex-col border-r border-clinical-border bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-clinical-ink">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M7 12a5 5 0 0 1 10 0v3a4 4 0 0 1-4 4h-1"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="9" cy="14" r="1.4" fill="#0EA5A8" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight text-clinical-ink">
            OtoFarma
          </div>
          <div className="text-[10px] uppercase tracking-wider text-clinical-muted">
            Clinician suite
          </div>
        </div>
      </div>

      <div className="px-3">
        <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-wider text-clinical-muted">
          Workspace
        </div>
        <nav className="space-y-0.5">
          {PRIMARY.map((it) => (
            <NavItem key={it.label} {...it} />
          ))}
        </nav>
      </div>

      <div className="mt-6 px-3">
        <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-wider text-clinical-muted">
          System
        </div>
        <nav className="space-y-0.5">
          {SECONDARY.map((it) => (
            <NavItem key={it.label} {...it} />
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-clinical-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-clinical-accent to-sky-600 text-center text-xs font-semibold leading-8 text-white">
            MR
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-clinical-ink">
              Dr. Marco Ricci
            </div>
            <div className="truncate text-[10px] text-clinical-muted">
              Audiologist · Napoli
            </div>
          </div>
          <button className="text-clinical-muted hover:text-clinical-ink">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
  badge,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  to: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <a
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
        active
          ? "bg-clinical-ink text-white"
          : "text-clinical-muted hover:bg-clinical-bg hover:text-clinical-ink",
      )}
    >
      <Icon size={16} />
      <span className="flex-1">{label}</span>
      {typeof badge === "number" && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-mono",
            active
              ? "bg-white/15 text-white"
              : "bg-clinical-bg text-clinical-muted",
          )}
        >
          {badge}
        </span>
      )}
    </a>
  );
}
