# Design.md — SwiftFix UI/UX Design System & Layout Guidelines

## 1. Design Principles

- **Clarity & Transparency:** High emphasis on readability for price estimates, statuses, and technician ratings[cite: 8].
- **Responsive First:** Seamless adaptability across Mobile, Tablet, Desktop, and Large Desktop screens without horizontal overflow[cite: 8].
- **Bi-Directional Support (RTL/LTR):** First-class support for Arabic (RTL) and English (LTR) typography and alignment[cite: 8].

## 2. Color System & Design Tokens (Tailwind Base)

- **Primary Brand Accent:** Teal / Slate variants (configurable via `ui.ts` / `tailwind.config.js` for centralized color replacement).
- **Status Colors:**
    - `Pending` / `In Review`: Amber / Yellow badge (`bg-amber-100 text-amber-800`).
    - `In Repair` / `In Progress`: Blue badge (`bg-blue-100 text-blue-800`).
    - `Ready` / `Completed`: Green / Emerald badge (`bg-emerald-100 text-emerald-800`).
    - `Cancelled` / `Rejected`: Red badge (`bg-red-100 text-red-800`).

## 3. Core Component Wireframes & Layout Specs

### A. Navigation & Shell

- **Header / Navbar:** Logo, Search Bar, Category Links, Language Toggle, User Profile Dropdown / Auth Links.
- **Sidebar (Dashboard Views):** Navigation links for Tickets, Services, Profile Settings, and Order Management.

### B. Core Screens Breakdown

1. **Landing / Search Page:**
    - Hero section with Search input (Device type, problem, location).
    - Grid of featured certified repair centers with rating stars, price range, and service focus[cite: 8].
2. **Technician / Center Profile Page:**
    - Center details, verification badge, price list for parts/labor, and verified customer reviews list[cite: 8].
3. **Repair Ticket Request / Booking Form:**
    - Device selection, issue description, address input, and price estimate preview.
4. **Ticket Details Page (`tickets/show.tsx`):**
    - Header with Ticket ID, Status Badge, Priority Level[cite: 8].
    - Summary card: Customer details, assigned technician, device category, address[cite: 8].
    - Timeline / Updates feed: History of status updates and notes[cite: 8].

## 4. Required UI States (Global Mandatory Standard)

Every component and page must explicitly handle:

- **Loading State:** Skeleton loaders or subtle spinners during request processing.
- **Empty State:** Friendly graphic and message when search results or ticket lists yield no data (e.g., "No repair tickets found").
- **Error State:** Clear inline form validation error messages or alert boxes.
- **Success State:** Flash messages for successful actions (e.g., "Ticket updated successfully").
- **Disabled State:** Visual gray-out and pointer-events disablement on submitting buttons.
