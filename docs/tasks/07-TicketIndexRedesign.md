# TicketIndexRedesign.md — SwiftFix My Tickets Page Redesign Guidelines

## 1. General Purpose

Rebuild and redesign the customer's tickets list page (`resources/js/pages/tickets/index.tsx`) into a clean, modern, Arabic-first layout matching the SwiftFix design system (Inertia + React + Tailwind CSS).

---

## 2. Design & Styling Standards

- **Direction & Language:** Full RTL support (`dir="rtl"`).
- **Layout:** Standard application layout using global `<Header />` and `<Footer />` components.
- **Color Palette:**
    - Primary Theme Colors: Project Tailwind classes (`bg-primary`, `text-primary`, `border-primary`, `ring-primary`).
    - Background: Neutral light background (`bg-slate-50` / `bg-muted`).
    - Cards & Tables: White background (`bg-white`), subtle borders (`border-slate-100` / `border-slate-200`), smooth rounded corners (`rounded-2xl`), and light elevation (`shadow-sm`).
- **Typography:** Bold headings (`text-slate-900`) and soft secondary text (`text-slate-600` / `text-slate-500`).

---

## 3. Structural Breakdown & Sections

### A. Page Header Section

- Title: **طلباتي** (My Tickets)
- Subtitle: متابعة وإدارة جميع طلبات الصيانة الخاصة بك.
- Action Button: **تصفح الورش / طلب جديد** (Browse Workshops / New Ticket) leading to the workshops directory.

### B. Filter & Search Bar Card

- **Search Input:** Search by ticket code or title.
- **Status Filter Dropdown:** All (`الكل`), Pending (`قيد الإرسال`), Assigned/In Progress (`قيد المتابعة`), Completed (`مكتملة`), Cancelled (`ملغاة`).
- **Clear / Apply Filters:** Clean button controls matching theme styles.

### C. Tickets Display List

- **Responsive Layout:**
    - Modern card-based list on mobile and desktop viewports (or styled data table).
- **Card Content:**
    - Ticket Reference Code Badge (e.g. `SWIFT-4SD9ZG`).
    - Service Category Name.
    - Status Badge with color-coded context (e.g., Green for completed, Orange for in-progress, Red/Gray for cancelled).
    - Date & Address summary.
    - Action Link: **عرض التفاصيل ←** navigating to `/tickets/{id}`.

### D. Empty State

- Friendly empty state component with an illustration/icon when the customer has no tickets matching the criteria, with a button to submit a new ticket.
