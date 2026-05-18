import type { Appointment } from "../../types/patient";
import Card from "../ui/Card";
import { Video, MapPin, Phone } from "lucide-react";

const ICON = {
  video: Video,
  "in-person": MapPin,
  phone: Phone,
};

export default function AppointmentTimeline({
  appointments,
}: {
  appointments: Appointment[];
}) {
  return (
    <Card
      title="Appointments"
      actions={
        <button className="text-xs font-medium text-clinical-accent hover:underline">
          Schedule →
        </button>
      }
    >
      <ol className="relative space-y-5 before:absolute before:left-[11px] before:top-1 before:h-[calc(100%-8px)] before:w-px before:bg-clinical-border">
        {appointments.map((a) => {
          const Icon = ICON[a.type];
          const upcoming = a.status === "scheduled";
          return (
            <li key={a.id} className="relative flex gap-3 pl-8">
              <span
                className={`absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border ${
                  upcoming
                    ? "border-clinical-accent bg-white text-clinical-accent"
                    : "border-clinical-border bg-clinical-bg text-clinical-muted"
                }`}
              >
                <Icon size={12} />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-clinical-ink">
                    {a.summary}
                  </div>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wider ${
                      upcoming ? "text-clinical-accent" : "text-clinical-muted"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-clinical-muted">
                  {new Date(a.at).toLocaleString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · {a.with}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
