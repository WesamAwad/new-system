import { index as workshopsIndex } from '@/actions/App/Http/Controllers/WorkshopController';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import WorkshopCard from '@/components/workshops/WorkshopCard';
import {
    fieldClassName,
    labelClassName,
    primaryButtonClassName,
    secondaryButtonClassName,
} from '@/lib/ui';
import type { Category, Paginated, Workshop } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent } from 'react';

type Filters = {
    search: string | null;
    city: string | null;
    category: string | null;
    min_rating: string | null;
};

type Props = {
    workshops: Paginated<Workshop>;
    filters: Filters;
    categories: Array<Pick<Category, 'id' | 'name' | 'slug'>>;
};

const minRatings = ['3', '4', '4.5'];

export default function WorkshopsIndex({
    workshops,
    filters,
    categories,
}: Props) {
    const hasActiveFilters = Boolean(
        filters.search ||
        filters.city ||
        filters.category ||
        filters.min_rating,
    );

    function submitFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const search = formData.get('search');
        const city = formData.get('city');
        const category = formData.get('category');
        const minRating = formData.get('min_rating');

        router.get(
            workshopsIndex.url(),
            {
                search:
                    typeof search === 'string' && search !== ''
                        ? search
                        : undefined,
                city:
                    typeof city === 'string' && city !== '' ? city : undefined,
                category:
                    typeof category === 'string' && category !== ''
                        ? category
                        : undefined,
                min_rating:
                    typeof minRating === 'string' && minRating !== ''
                        ? minRating
                        : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function resetFilters() {
        router.get(
            workshopsIndex.url(),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    return (
        <>
            <Head title="الورش المعتمدة" />

            <div dir="rtl" className="bg-muted text-foreground min-h-screen">
                <Header />

                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-heading text-2xl font-bold tracking-tight sm:text-3xl">
                            الورش المعتمدة
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm">
                            {workshops.total} ورشة
                            {hasActiveFilters ? ' (نتائج مطابقة للبحث)' : ''}
                        </p>
                    </div>

                    <form
                        onSubmit={submitFilters}
                        className="border-border/40 mb-8 grid gap-3 rounded-xl border bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
                    >
                        <div className="sm:col-span-2 lg:col-span-1">
                            <label htmlFor="search" className={labelClassName}>
                                بحث
                            </label>
                            <input
                                id="search"
                                name="search"
                                type="search"
                                defaultValue={filters.search ?? ''}
                                placeholder="اسم الورشة، المدينة…"
                                className={fieldClassName}
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className={labelClassName}>
                                المدينة
                            </label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                defaultValue={filters.city ?? ''}
                                placeholder="غزة، خان يونس…"
                                className={fieldClassName}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="category"
                                className={labelClassName}
                            >
                                نوع الخدمة
                            </label>
                            <select
                                id="category"
                                name="category"
                                defaultValue={filters.category ?? ''}
                                className={fieldClassName}
                            >
                                <option value="">كل الخدمات</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.slug}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="min_rating"
                                className={labelClassName}
                            >
                                الحد الأدنى للتقييم
                            </label>
                            <select
                                id="min_rating"
                                name="min_rating"
                                defaultValue={filters.min_rating ?? ''}
                                className={fieldClassName}
                            >
                                <option value="">كل التقييمات</option>
                                {minRatings.map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating}+ ★
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
                            <button
                                type="submit"
                                className={primaryButtonClassName}
                            >
                                تطبيق الفلاتر
                            </button>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className={secondaryButtonClassName}
                                >
                                    إعادة تعيين
                                </button>
                            )}
                        </div>
                    </form>

                    {workshops.data.length === 0 ? (
                        <div className="border-border rounded-xl border border-dashed bg-white px-6 py-12 text-center">
                            <p className="text-muted-foreground">
                                {hasActiveFilters
                                    ? 'لا توجد ورش مطابقة لبحثك.'
                                    : 'لا توجد ورش متاحة حالياً.'}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className={`${secondaryButtonClassName} mt-4`}
                                >
                                    مسح الفلاتر
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {workshops.data.map((workshop) => (
                                <WorkshopCard
                                    key={workshop.id}
                                    workshop={workshop}
                                />
                            ))}
                        </div>
                    )}

                    {(workshops.prev_page_url || workshops.next_page_url) && (
                        <div className="mt-8 flex items-center justify-between text-sm">
                            {workshops.prev_page_url ? (
                                <Link
                                    href={workshops.prev_page_url}
                                    className="text-accent font-medium hover:underline"
                                    preserveScroll
                                >
                                    السابق
                                </Link>
                            ) : (
                                <span />
                            )}
                            <span className="text-muted-foreground">
                                صفحة {workshops.current_page} من{' '}
                                {workshops.last_page}
                            </span>
                            {workshops.next_page_url ? (
                                <Link
                                    href={workshops.next_page_url}
                                    className="text-accent font-medium hover:underline"
                                    preserveScroll
                                >
                                    التالي
                                </Link>
                            ) : (
                                <span />
                            )}
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
