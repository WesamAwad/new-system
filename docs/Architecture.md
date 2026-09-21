## 1. Stack Overview

- **Framework:** Laravel 11+
- **Frontend Bridge:** Inertia.js (Monolithic Single-Page Application pattern)
- **UI Layer:** React.js 18+ with TypeScript & Tailwind CSS
- **Database:** MySQL 8.0+
- **Authentication:** Laravel Fortify / Breeze (Inertia Edition) with Session-based cookie auth.

## 2. System Architecture Diagram (Conceptual Flow)

[ Browser / Client (React + TS + Inertia) ]
│ ▲
HTTPS / Json Props │ │ Dynamic Page Props
▼ │
[ Laravel Web Routes & Middleware ]
│
▼
[ Form Request Validation ]
│
▼
[ Controller / Business Logic ]
│
┌─────────┴─────────┐
▼ ▼
[ Eloquent Models ] [ Policy / Auth ]
│
▼
[ MySQL DB ]

## 3. Data Flow Architecture

1. **Request Lifecycle:**
    - Client triggers navigation or form submission via Inertia.
    - Laravel route intercepts request and passes through authentication/role middleware.
2. **Business Logic & Persistence:**
    - Form Requests validate input payload.
    - Controller verifies authorization via Laravel Policies.
    - Controller executes model actions (CRUD) on MySQL database.
3. **Response Rendering:**
    - Controller returns an `Inertia::render('PageName', $props)` response.
    - Inertia delivers props as JSON over the wire without a full page reload, re-rendering the target React TypeScript page component.

## 4. Security & Mass-Assignment Protection

- **Data Integrity:** Strict foreign key integrity on database tables (e.g., preventing category deletion if linked to active repair tickets).
- **Mass-Assignment Guard:** Restricted Model `$fillable` arrays preventing parameter tampering (e.g., preventing explicit role escalation or unauthorized attribute manipulation).
- **Security Checks:** CSRF token verification on all mutation requests, SQL injection prevention via PDO parameter binding, and XSS sanitization.
