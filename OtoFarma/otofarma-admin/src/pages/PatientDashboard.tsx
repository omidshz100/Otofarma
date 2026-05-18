import { useState } from "react";
import type { Patient } from "../types/patient";
import { mockPatients } from "../data/mockPatients";
import PatientListPanel from "../components/patients/PatientListPanel";
import PatientProfileCard from "../components/patients/PatientProfileCard";
import Audiogram from "../components/patients/Audiogram";
import HearingTestHistory from "../components/patients/HearingTestHistory";
import HearingAidStatus from "../components/patients/HearingAidStatus";
import AppointmentTimeline from "../components/patients/AppointmentTimeline";
import ClinicalNotes from "../components/patients/ClinicalNotes";
import StatTile from "../components/ui/StatTile";
import Button from "../components/ui/Button";
import { CalendarPlus, FileDown, MessageSquare, Video } from "lucide-react";

export default function PatientDashboard() {
  const [patients] = useState<Patient[]>(mockPatients);
  const [selectedId, setSelectedId] = useState<string>(patients[0].id);
  const patient = patients.find((p) => p.id === selectedId)!;
  const latestTest = patient.tests[0];

  return (
    <div className="grid h-full grid-cols-[320px_1fr] bg-clinical-bg">
      <PatientListPanel
        patients={patients}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <main className="flex min-w-0 flex-col overflow-y-auto">
        {/* Page header */}
        <header className="flex items-center justify-between border-b border-clinical-border bg-white px-8 py-5">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-clinical-muted">
              Patient · {patient.id}
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-clinical-ink">
              {patient.firstName} {patient.lastName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" icon={<FileDown size={16} />}>
              Export record
            </Button>
            <Button variant="ghost" icon={<MessageSquare size={16} />}>
              Message
            </Button>
            <Button variant="secondary" icon={<CalendarPlus size={16} />}>
              Schedule visit
            </Button>
            <Button variant="primary" icon={<Video size={16} />}>
              Start video call
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6 p-8">
          {/* Left column */}
          <section className="col-span-12 xl:col-span-8 space-y-6">
            <PatientProfileCard patient={patient} />

            <div className="grid grid-cols-4 gap-4">
              <StatTile
                label="Pure-tone avg."
                value="41"
                unit="dB HL"
                trend="+3 vs Feb"
                tone="warn"
              />
              <StatTile
                label="Last test"
                value="14 days"
                unit="ago"
                trend="2026-05-04"
                tone="neutral"
              />
              <StatTile
                label="Aid usage"
                value="11.2"
                unit="h/day"
                trend="+0.8 vs last wk"
                tone="good"
              />
              <StatTile
                label="Open orders"
                value="1"
                unit=""
                trend="In production"
                tone="info"
              />
            </div>

            <Audiogram test={latestTest} />

            <HearingTestHistory tests={patient.tests} />
          </section>

          {/* Right column */}
          <aside className="col-span-12 xl:col-span-4 space-y-6">
            <HearingAidStatus aids={patient.aids} />
            <AppointmentTimeline appointments={patient.appointments} />
            <ClinicalNotes notes={patient.notes} />
          </aside>
        </div>
      </main>
    </div>
  );
}
