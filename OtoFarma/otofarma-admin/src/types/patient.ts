export type EarSide = "left" | "right";

export type Frequency = 250 | 500 | 1000 | 2000 | 4000 | 8000;

export interface AudiogramPoint {
  frequency: Frequency;
  /** Hearing threshold in dB HL (0 = normal, higher = worse) */
  thresholdDb: number;
}

export interface HearingTest {
  id: string;
  date: string; // ISO
  performedBy: string;
  location: string;
  left: AudiogramPoint[];
  right: AudiogramPoint[];
  classification:
    | "normal"
    | "mild"
    | "moderate"
    | "moderately-severe"
    | "severe"
    | "profound";
  notes?: string;
}

export interface HearingAid {
  id: string;
  model: string;
  ear: EarSide | "both";
  serial: string;
  fittedOn?: string;
  status: "active" | "in-production" | "shipped" | "returned";
  batteryLevel?: number;
}

export interface Appointment {
  id: string;
  type: "in-person" | "video" | "phone";
  with: string;
  at: string; // ISO
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  summary?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO
  gender: "f" | "m" | "x";
  city: string;
  phone: string;
  email: string;
  insurance?: string;
  avatarColor: string; // for placeholder
  initials: string;
  primaryDoctor: string;
  status: "active" | "follow-up" | "new" | "discharged";
  tags: string[];
  lastVisit: string; // ISO
  tests: HearingTest[];
  aids: HearingAid[];
  appointments: Appointment[];
  notes: { id: string; at: string; author: string; body: string }[];
}
