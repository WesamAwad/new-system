# TASK: Landing Page / Home Feature (UI & Layout)

## Objective

Implement the main SwiftFix Landing Page based on the Figma design (`الرئيسية - سويفت فيكس`) using React (TSX), Inertia.js, and Tailwind CSS.

---

## 1. Component Architecture

Break down the page into clean, modular components inside `resources/js/components/landing/`:

- **Navbar (`Header.tsx`):**
    - Brand Logo (`SwiftFix`).
    - Navigation links: `الرئيسية`, `خدمات الصيانة`, `الفنيين المعتمدين`, `كيف نعمل`, `تتبع الطلب`.
    - Auth Action Buttons: `تسجيل الدخول` and `إنشاء حساب` (or User Profile dropdown if authenticated).

- **Hero Section (`HeroSection.tsx`):**
    - Badge tag: `المنصة رقم 1 لخدمات صيانة الأجهزة في المنطقة`.
    - Main Heading: `صيانة أجهزتك الذكية عند بابك أو بأقرب مركز موثوق`.
    - Description paragraph highlighting warranties, fast service, and certified technicians.
    - Interactive Search/Filter Box:
        - Device Type Selector (`نوع الجهاز: هواتف ذكية`).
        - Location Input (`المدينة أو الحي`).
        - Action Button (`ابحث الآن`).
    - Trust Metrics / Highlights Bar (e.g., `15,000+ جهاز تم إصلاحه`, `ضمان يصل إلى 180 يوم`).
    - Hero Graphic / Banner Illustration on the left.

- **Services Section (`ServicesGrid.tsx`):**
    - Section Title & Subtitle: `خدمات الصيانة الأكثر طلباً` with a descriptive tagline.
    - Responsive Grid of Service Cards:
        1. `تبديل الشاشات المكسورة`
        2. `تغيير وصيانة البطاريات`
        3. `صيانة منافذ الشحن والصوت`
        4. `معالجة أضرار السوائل واللوحات`
    - Each card should include an icon, title, description, and action button/link.

- **Footer (`Footer.tsx`):**
    - Brand info, quick links, support, and copyright notice.

---

## 2. Technical & UI Requirements

- **Figma Alignment:** Replicate layout, fonts, cards, rounded borders, and shadows strictly from the Figma frame (`الرئيسية - سويفت فيكس`).
- **Theme Standard:** Strictly use standard Tailwind CSS classes and predefined Theme colors from `app.css` (No hardcoded HEX values).
- **RTL & Responsiveness:** Ensure proper Right-To-Left layout direction and full responsiveness across mobile, tablet, and desktop screens.

---

## 3. Inertia & Routing

- Route: `/` mapped to `HomeController@index` or direct Inertia render of `resources/js/pages/welcome.tsx` (or `home.tsx`).
- Pass dynamic stats or services data from Laravel backend or render structured props.

---

## 4. Verification & Pest Testing

- Verify page renders correctly without console errors or broken styles.
- Run Pest feature test:
    ```bash
    php artisan test --filter=PageRenderTest
    ```
