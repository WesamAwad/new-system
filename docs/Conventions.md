# Conventions.md — SwiftFix Code & Development Standards

## 1. General Principles

- **Language Standards:** English for code, comments, variables, database schemas, and git commits. Dual language support (Arabic/English) for UI text[cite: 8].
- **Clean Code:** Strictly adhere to Single Responsibility Principle (SRP) and DRY (Don't Repeat Yourself).
- **Git Commit Naming:** Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `style:`).

## 2. Laravel Backend Conventions

- **PHP Version:** PHP 8.2+ with strict typing enabled (`declare(strict_types=1);`).
- **Routing:** Use named routes in `routes/web.php` with Wayfinder / Inertia route helpers.
- **Controllers:** Keep controllers thin. Delegate authorization to Policies/Requests and business logic to Actions or Service classes. Use Invokable or Resource Controllers where applicable.
- **Validation:** Enforce validation using dedicated Form Requests (`php artisan make:request`). Never perform raw validation inside inline controller methods.
- **Database Models:**
    - Explicitly define `$fillable` (never use `$guarded = []` to prevent mass-assignment risks).
    - Use Enums for predefined static statuses (e.g., `TicketStatus`, `TicketPriority`).
    - Always define foreign key constraints and model relationships clearly.

## 3. Frontend (React + TypeScript) Conventions

- **TypeScript Strictness:** Strict mode enabled. Avoid using `any`; define explicit interfaces/types for all Inertia props, form payloads, and API data.
- **File Structure:**
    - Components: PascalCase (e.g., `Button.tsx`, `TicketCard.tsx`).
    - Pages: Lowercase or camelCase under `resources/js/pages/` matching Laravel routes (e.g., `tickets/show.tsx`, `login.tsx`).
- **UI & Styling:** Use Tailwind CSS exclusively. Centralize shared UI tokens/classes (e.g., in `resources/js/lib/ui.ts`) to maintain geometric and design consistency.
- **Forms & State:** Use Inertia's `<Form>` or `useForm()` hook for server-driven forms, ensuring bound field states and automatic error handling.
- **Tailwind Best Practices:** Always use standard/canonical Tailwind v4 classes (e.g., use `inset-s-3` instead of `start-3`, `bg-linear-to-t` instead of `bg-gradient-to-t`, and official scale classes instead of arbitrary pixels like `w-[18px]` where applicable).

## 4. Testing Standards

- **Testing Framework:** Pest PHP for backend/feature testing.
- **Coverage Mandates:** All core CRUD actions, form validations, authorization checks (Policies), and critical edge cases must have passing automated tests.
