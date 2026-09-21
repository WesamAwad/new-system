import { create } from '@/actions/App/Http/Controllers/TicketController';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import { RatingStars } from '@/components/rating-stars';
import type { Workshop } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Props = {
    workshop: Workshop;
};

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function WorkshopsShow({ workshop }: Props) {
    const services = workshop.services ?? [];
    const reviews = workshop.reviews ?? [];

    return (
        <>
            <Head title={workshop.name} />

            <div dir="rtl" className="bg-muted text-foreground min-h-screen">
                <Header />

                <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                    <section className="border-border/40 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="flex items-center gap-4">
                                {workshop.logo ? (
                                    <img
                                        src={workshop.logo}
                                        alt={workshop.name}
                                        className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                                    />
                                ) : (
                                    <div
                                        className="bg-primary/10 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold"
                                        aria-hidden="true"
                                    >
                                        {workshop.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-heading text-xl font-bold tracking-tight sm:text-2xl">
                                        {workshop.name}
                                    </h1>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        {workshop.city} — {workshop.address}
                                    </p>
                                    <div className="mt-2">
                                        <RatingStars
                                            rating={workshop.rating}
                                            reviewsCount={
                                                workshop.reviews_count
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                                    workshop.is_available
                                        ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
                                        : 'bg-slate-100 text-slate-600 ring-slate-200'
                                }`}
                            >
                                {workshop.is_available ? 'متاح الآن' : 'مشغول'}
                            </span>
                        </div>

                        <Link
                            href={create({
                                query: { workshop_id: workshop.id },
                            })}
                            className="bg-primary hover:bg-primary-hover mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white transition"
                        >
                            طلب صيانة من هذه الورشة
                        </Link>
                    </section>

                    {workshop.bio && (
                        <section className="border-border/40 mt-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="text-heading text-lg font-bold">
                                نبذة عن الورشة
                            </h2>
                            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                                {workshop.bio}
                            </p>
                        </section>
                    )}

                    <section className="border-border/40 mt-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-heading text-lg font-bold">
                            الخدمات المقدمة
                        </h2>
                        {services.length === 0 ? (
                            <p className="text-muted-foreground mt-3 text-sm">
                                لم يتم إضافة خدمات لهذه الورشة بعد.
                            </p>
                        ) : (
                            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                {services.map((service) => (
                                    <li
                                        key={service.id}
                                        className="border-border/40 flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
                                    >
                                        <span className="text-foreground font-medium">
                                            {service.category?.name}
                                        </span>
                                        <span className="text-muted-foreground">
                                            يبدأ من{' '}
                                            {Number(
                                                service.starting_price,
                                            ).toFixed(0)}{' '}
                                            ₪
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="border-border/40 mt-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-heading text-lg font-bold">
                            التقييمات والمراجعات
                        </h2>
                        {reviews.length === 0 ? (
                            <p className="text-muted-foreground mt-3 text-sm">
                                لا توجد تقييمات بعد لهذه الورشة.
                            </p>
                        ) : (
                            <ul className="mt-4 space-y-4">
                                {reviews.map((review) => (
                                    <li
                                        key={review.id}
                                        className="border-border/30 border-b pb-4 last:border-b-0 last:pb-0"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="text-foreground font-semibold">
                                                {review.client_name}
                                            </span>
                                            <RatingStars
                                                rating={review.rating}
                                            />
                                        </div>
                                        <p className="text-muted-foreground mt-2 text-sm">
                                            {review.comment}
                                        </p>
                                        <p className="text-muted-foreground/70 mt-1 text-xs">
                                            {formatDate(review.created_at)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
