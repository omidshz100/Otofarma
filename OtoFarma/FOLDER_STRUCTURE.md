# OtoFarma Admin — Folder Structure

```
otofarma-admin/
├── public/
│   ├── favicon.svg
│   └── logo.svg
│
├── src/
│   ├── main.tsx                      # Vite entry, mounts <App />
│   ├── App.tsx                       # Router shell + global providers
│   ├── index.css                     # Tailwind directives + CSS vars
│   │
│   ├── pages/                        # Top-level routes
│   │   ├── PatientDashboard.tsx      # ← the page we're building first
│   │   ├── PatientDetail.tsx
│   │   ├── OrderManagement.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── VideoCallSchedule.tsx
│   │   ├── VideoCallRoom.tsx
│   │   ├── Pharmacies.tsx
│   │   ├── PharmacyDetail.tsx
│   │   └── Settings.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx          # Sidebar + Topbar + <Outlet />
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   │
│   │   ├── ui/                       # Design-system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── DropdownMenu.tsx
│   │   │   └── StatTile.tsx
│   │   │
│   │   ├── patients/
│   │   │   ├── PatientListPanel.tsx
│   │   │   ├── PatientListItem.tsx
│   │   │   ├── PatientProfileCard.tsx
│   │   │   ├── PatientVitals.tsx
│   │   │   ├── Audiogram.tsx         # SVG audiogram chart
│   │   │   ├── HearingTestHistory.tsx
│   │   │   ├── HearingAidStatus.tsx
│   │   │   ├── AppointmentTimeline.tsx
│   │   │   └── ClinicalNotes.tsx
│   │   │
│   │   ├── orders/
│   │   │   ├── OrderTable.tsx
│   │   │   ├── OrderStatusPill.tsx
│   │   │   ├── OrderTimeline.tsx
│   │   │   └── HearingAidSpecPanel.tsx
│   │   │
│   │   ├── calls/
│   │   │   ├── CallCalendar.tsx
│   │   │   ├── CallSlot.tsx
│   │   │   ├── UpcomingCalls.tsx
│   │   │   └── ScheduleCallDialog.tsx
│   │   │
│   │   └── pharmacies/
│   │       ├── PharmacyMap.tsx
│   │       ├── PharmacyTable.tsx
│   │       ├── PharmacyCard.tsx
│   │       └── InventoryPanel.tsx
│   │
│   ├── hooks/
│   │   ├── usePatients.ts
│   │   ├── useOrders.ts
│   │   ├── useCalls.ts
│   │   ├── usePharmacies.ts
│   │   └── useDebouncedValue.ts
│   │
│   ├── lib/
│   │   ├── api.ts                    # fetch wrappers
│   │   ├── format.ts                 # dates, dB, currency
│   │   ├── audiogram.ts              # PTA, classification helpers
│   │   └── cn.ts                     # className util
│   │
│   ├── types/
│   │   ├── patient.ts
│   │   ├── order.ts
│   │   ├── call.ts
│   │   └── pharmacy.ts
│   │
│   ├── data/
│   │   ├── mockPatients.ts
│   │   ├── mockOrders.ts
│   │   ├── mockCalls.ts
│   │   └── mockPharmacies.ts
│   │
│   ├── icons/                        # lucide-react re-exports / custom SVGs
│   │   └── index.ts
│   │
│   └── routes.tsx                    # React Router config
│
├── index.html
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

## Stack

- **React 18** + **TypeScript** (strict)
- **Vite** for dev/build
- **Tailwind CSS** with a small medical-tone palette extension
- **React Router** for navigation
- **TanStack Query** for server state (orders, patients, calls)
- **Recharts** or hand-rolled SVG for the audiogram
- **lucide-react** for icons
- **date-fns** for date math
```
