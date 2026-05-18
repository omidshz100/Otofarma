import type { Patient } from "../types/patient";

export const mockPatients: Patient[] = [
  {
    id: "p-1042",
    firstName: "Elena",
    lastName: "Conti",
    dateOfBirth: "1957-03-14",
    gender: "f",
    city: "Napoli",
    phone: "+39 081 555 0142",
    email: "elena.conti@example.it",
    insurance: "SSN — ASL Napoli 1",
    avatarColor: "#0EA5A8",
    initials: "EC",
    primaryDoctor: "Dr. M. Ricci",
    status: "follow-up",
    tags: ["Bilateral", "Presbycusis"],
    lastVisit: "2026-05-04",
    tests: [
      {
        id: "t-2201",
        date: "2026-05-04",
        performedBy: "Dr. M. Ricci",
        location: "OtoFarma Napoli Centro",
        classification: "moderate",
        left: [
          { frequency: 250, thresholdDb: 25 },
          { frequency: 500, thresholdDb: 30 },
          { frequency: 1000, thresholdDb: 40 },
          { frequency: 2000, thresholdDb: 50 },
          { frequency: 4000, thresholdDb: 60 },
          { frequency: 8000, thresholdDb: 65 },
        ],
        right: [
          { frequency: 250, thresholdDb: 20 },
          { frequency: 500, thresholdDb: 25 },
          { frequency: 1000, thresholdDb: 35 },
          { frequency: 2000, thresholdDb: 45 },
          { frequency: 4000, thresholdDb: 55 },
          { frequency: 8000, thresholdDb: 60 },
        ],
        notes:
          "Symmetric sloping loss consistent with age-related presbycusis. Recommended bilateral RIC fitting.",
      },
    ],
    aids: [
      {
        id: "a-501",
        model: "OF Lyra RIC-312",
        ear: "both",
        serial: "OF-24-001-4421",
        fittedOn: "2026-03-22",
        status: "active",
        batteryLevel: 72,
      },
    ],
    appointments: [
      {
        id: "ap-9001",
        type: "video",
        with: "Dr. M. Ricci",
        at: "2026-05-22T10:30:00",
        status: "scheduled",
        summary: "Fitting follow-up",
      },
      {
        id: "ap-9000",
        type: "in-person",
        with: "Dr. M. Ricci",
        at: "2026-05-04T15:00:00",
        status: "completed",
        summary: "Audiometric exam + impression",
      },
    ],
    notes: [
      {
        id: "n-1",
        at: "2026-05-04",
        author: "Dr. M. Ricci",
        body: "Patient reports improved speech-in-noise but mild occlusion. Adjust vent size at next fitting.",
      },
    ],
  },
];
