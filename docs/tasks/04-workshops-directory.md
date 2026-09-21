# TASK: Workshop Directory & Profile Feature (UI & Backend)

## Objective

Implement the Workshop Directory and Profile pages where clients can explore featured workshops, view their ratings/reviews, services, and location, and visit a detailed workshop profile page using React (TSX), Inertia.js, and Laravel.

---

## 1. Database & Models Requirements

- **Workshops Table/Relation:**
    - Link `workshops` to `users` (where role = technician/workshop).
    - Attributes: `name`, `logo/avatar`, `bio`, `city`, `address`, `rating` (float), `reviews_count` (int), `is_featured` (boolean).
- **Services & Reviews Relations:**
    - Workshop offers multiple services (e.g., screen repair, battery replacement).
    - Workshop has multiple reviews (rating, comment, client_name, date).

---

## 2. Frontend Implementation

### A. Featured Workshops Section (Landing Page Integration)

- Component: `resources/js/components/landing/FeaturedWorkshops.tsx`
- Display top 3 featured workshops with:
    - Workshop Logo & Name
    - Rating stars & total review count (e.g., 4.9 ★ - 120 تقييم)
    - Location badge (e.g., غزة - الرمال)
    - Core services badges
    - Action button: `عرض الملف الشخصي`
    - "See All" link in the header redirecting to `/workshops`.

### B. Workshop Directory Page (`resources/js/pages/workshops/index.tsx`)

- Navigation Link in Header: `الورش المعتمدة`
- Page features:
    - Search & Filter bar (Filter by City, Device Type, Minimum Rating).
    - Grid list of all verified workshops with pagination.

### C. Workshop Profile Page (`resources/js/pages/workshops/show.tsx`)

- Detailed layout containing:
    - **Header Banner:** Workshop logo, name, status (متاح الان / مشغول), overall rating, and address.
    - **About Section:** Workshop description and working hours.
    - **Services Provided:** List of repair services with starting prices.
    - **Reviews & Ratings Section:** Customer feedback list (stars, comments, date).
    - **Primary CTA:** Button `طلب صيانة من هذه الورشة` (opens the ticket creation modal/page with this workshop pre-selected).

---

## 3. Backend & Routes

- `WorkshopController@index`: Fetch paginated list of workshops with optional city/rating filters.
- `WorkshopController@show`: Fetch specific workshop with its services and approved reviews.
- Update `HomeController@index` to pass the top 3 featured workshops to the Landing Page.

---

## 4. Verification & Pest Testing

- Run Pest feature test:
    ```bash
    php artisan test --filter=WorkshopTest
    ```
