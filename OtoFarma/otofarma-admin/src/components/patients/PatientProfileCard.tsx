import type { Patient } from "../../types/patient";
import { Phone, Mail, MapPin, Calendar, ShieldCheck, Stethoscope } from "lucide-react";

function age(dob: string) {
  const d = new Date(dob);
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

export default function PatientProfileCard({ patient }: { patient: Patient }) {
  const dob = new Date(patient.dateOfBirth).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <section className="overflow-hidden rounded-xl border border-clinical-border bg-white">
      <div className="flex gap-5 p-5">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-semibold text-white"
          style={{ background: patient.avatarColor }}
        >
          {patient.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-clinical-accent/10 px-2 py-0.5 text-xs font-medium text-clinical-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-clinical-accent" />
              {patient.status === "follow-up" ? "Follow-up due" : patient.status}
            </span>
            {patient.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-clinical-border bg-clinical-bg px-2 py-0.5 text-xs font-medium text-clinical-muted"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-x-6 gap-y-2 text-sm">
            <Field icon={<Calendar size={14} />} label="DOB">
              {dob} <span className="text-clinical-muted">· {age(patient.dateOfBirth)} yrs</span>
            </Field>
            <Field icon={<MapPin size={14} />} label="City">
              {patient.city}
            </Field>
            <Field icon={<Stethoscope size={14} />} label="Doctor">
              {patient.primaryDoctor}
            </Field>
            <Field icon={<Phone size={14} />} label="Phone">
              <span className="font-mono">{patient.phone}</span>
            </Field>
            <Field icon={<Mail size={14} />} label="Email">
              {patient.email}
            </Field>
            <Field icon={<ShieldCheck size={14} />} label="Coverage">
              {patient.insurance}
            </Field>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-clinical-muted">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-0.5 truncate text-sm text-clinical-ink">{children}</div>
    </div>
  );
}
