# TASK: Authentication - Client Register Feature (UI & Backend)

## Objective

Implement the Client Registration flow for SwiftFix based on the Figma design (`إنشاء حساب جديد - سويفت فيكس`) and integrate it with Laravel + Inertia React TS.

---

## 1. Prerequisites & Database Adjustments

- Ensure `users` migration and `User` Model support all required fields from Figma:
    - `name` (Full Name / الاسم الكامل)
    - `email` (Email / البريد الإلكتروني)
    - `phone` (Phone Number with country code / رقم الجوال)
    - `city` (City / المدينة)
    - `address` (Detailed Address / العنوان)
    - `account_type` or `role` (Client vs Service Center/Technician switch / نوع الحساب)
    - `password` (Hashed Password)

---

## 2. Frontend Implementation (`resources/js/pages/auth/register.tsx`)

- **Figma Alignment:**
    - Split-screen layout: Branding graphic panel on the left, registration form on the right.
    - Role switcher tab at the top (عميل أفراد / فني صيانة معتمد).
    - Form layout with two-column fields matching Figma (Name, Phone, City, Address, Password, Confirm Password).
    - Include terms and conditions checkbox.
- **Form State:** Use Inertia's `useForm` hook to manage inputs, submission, and validation errors.
- **UI & Theme Tokens:** Use standard Tailwind CSS classes and the theme colors defined in `app.css`.

---

## 3. Backend Implementation

- **Validation Request:** Use or update `RegisterRequest`:
    - `name`: `required|string|max:255`
    - `email`: `required|string|email|max:255|unique:users`
    - `phone`: `required|string|max:20`
    - `city`: `nullable|string|max:100`
    - `address`: `nullable|string|max:255`
    - `password`: `required|string|min:8|confirmed`
    - `role`: `required|in:client,technician`
- **Actions:** Hash password, create user record, assign role, automatically log in or redirect to the OTP verification screen.

---

## 4. Verification & Testing

- Run automated tests via Pest:
    ```bash
    php artisan test --filter=RegisterTest
    ```

## 5. Automated Testing (Pest)

Make sure to create/update `tests/Feature/Auth/RegistrationTest.php` to cover the following test cases:

- [ ] **Successful Registration:** Valid inputs successfully create a user record in the database with hashed password and role, and redirect the user.
- [ ] **Duplicate Email:** Submitting an already existing email returns a validation error for the `email` field.
- [ ] **Password Validation:** Password mismatch (confirmation failure) or weak password (less than 8 characters) triggers proper validation errors.
- [ ] **Required Fields:** Missing required fields (e.g., `name`, `phone`, `role`) triggers validation errors.
