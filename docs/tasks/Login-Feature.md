# TASK: Authentication - Login Feature (UI & Backend)

## Objective

Implement the Login flow for SwiftFix based on the Figma design (`تسجيل الدخول - سويفت فيكس`) and integrate it with Laravel + Inertia React TS.

---

## 1. Prerequisites & Test Data

- Create a Database Seeder or Test User in `database/seeders/DatabaseSeeder.php` with:
    - Email: `test@swiftfix.com`
    - Password: `password`
    - Role: `Client`

---

## 2. Frontend Implementation (`resources/js/pages/auth/login.tsx`)

- **Figma Alignment:** Update the layout and styling of `login.tsx` to strictly match the Figma design (Split-screen layout: Dark branding panel on the left, login form on the right).
- **Form State:** Use Inertia's `useForm` hook to handle inputs:
    - `email` (string, required)
    - `password` (string, required)
    - `remember` (boolean, optional)
- **UI States & Feedback:**
    - Display inline validation errors under relevant fields (`errors.email`, `errors.password`).
    - Disable the submit button and show a loading spinner/state during form processing (`processing`).
    - Add navigation links to "Forgot Password?" and "Create New Account".

---

## 3. Backend Implementation

- **Validation:** Use or update `LoginRequest` to validate incoming requests:
    - `email`: `required|string|email`
    - `password`: `required|string`
    - `remember`: `boolean`
- **Rate Limiting:** Ensure login throttling is enabled to protect against brute-force attacks.
- **Authentication & Redirection:**
    - Authenticate the user securely using Laravel Fortify / Breeze session guard.
    - On success: Redirect the user to the appropriate page based on their role (`Client` or `Technician`).
    - On failure: Return back with explicit field error messages.

---

## 4. Verification & Testing

- Run automated tests via Pest:
    ```bash
    php artisan test --filter=LoginTest
    ```
