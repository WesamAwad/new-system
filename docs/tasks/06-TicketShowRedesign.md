# TicketShowRedesign.md — SwiftFix Ticket Details & Tracking Redesign Guidelines

## 1. General Purpose

Rebuild and redesign the ticket details/tracking page (`resources/js/pages/tickets/show.tsx`) into a clean, modern, Arabic-first ticket tracking layout matching the SwiftFix design system (Inertia + React + Tailwind CSS).

---

## 2. Design & Styling Standards

- **Direction & Language:** Full RTL support (`dir="rtl"`).
- **Layout:** Standard application layout using global `<Header />` and `<Footer />` components.
- **Color Palette:**
    - Primary Theme Colors: Use project Tailwind classes (`bg-primary`, `text-primary`, `border-primary`, `ring-primary`).
    - Backgrounds: Neutral light background (`bg-slate-50` or `bg-muted`).
    - Cards & Containers: White background (`bg-white`), subtle borders (`border-slate-100` / `border-slate-200`), smooth rounded corners (`rounded-2xl`), and light elevation (`shadow-sm`).
- **Typography:** Clear headings (`text-slate-900`) and soft body text (`text-slate-600` / `text-slate-500`).

---

## 3. Structural Breakdown (Grid Layout)

The page layout follows a 2-column grid on desktop screens (`lg:grid-cols-3`):

### A. Main Section (2 Columns - `lg:col-span-2`)

1. **Status Banner & Order Stepper:**
    - Ticket reference code badge (e.g., `SWIFT-IGOSCJ`).
    - Visual progress stepper with status steps:
        - Submitted (`تم الإرسال`)
        - Under Review / Assigned (`قيد المراجعة / تم التكليف`)
        - In Progress (`قيد الصيانة`)
        - Completed (`مكتملة`)
2. **Ticket Information Card:**
    - Ticket title and detailed description.
    - Selected category/service and location address.
    - Attached images gallery (if any).
3. **Activity Timeline & Updates (`UPDATES`):**
    - Chronological status logs and notes added by the assigned technician or workshop.

### B. Sidebar Section (1 Column - `lg:col-span-1`)

1. **Assigned Workshop / Technician Card:**
    - Workshop or Technician name, avatar, and contact info.
    - Quick action button for direct communication.
2. **Ticket Control Actions:**
    - Modal/collapsible option to edit ticket details (only if ticket status is still editable).
    - Cancel ticket button (if allowed by business rules).
