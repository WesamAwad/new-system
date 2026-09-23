import { update } from '@/actions/App/Http/Controllers/WorkshopReviewController';
import { RatingStars } from '@/components/rating-stars';
import DashboardLayout from '@/layouts/dashboard-layout';
import { primaryButtonClassName, secondaryButtonClassName } from '@/lib/ui';
import type { Paginated, WorkshopReview } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

type Props = {
    reviews: Paginated<WorkshopReview>;
};

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function DashboardReviews({ reviews }: Props) {
    return (
        <DashboardLayout title="المراجعات">
            <Head title="المراجعات" />

            {reviews.data.length === 0 ? (
                <div className="border-border rounded-2xl border border-dashed bg-white px-6 py-14 text-center">
                    <p className="text-muted-foreground">لا توجد مراجعات بعد.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {reviews.data.map((review) => (
                        <li
                            key={review.id}
                            className="border-border/40 rounded-2xl border bg-white p-5 shadow-sm"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <span className="text-foreground font-semibold">
                                        {review.client_name}
                                    </span>
                                    <span className="text-muted-foreground mr-2 text-xs">
                                        {formatDate(review.created_at)}
                                    </span>
                                </div>
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                                        review.is_approved
                                            ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
                                            : 'bg-amber-50 text-amber-800 ring-amber-200'
                                    }`}
                                >
                                    {review.is_approved
                                        ? 'ظاهرة للعملاء'
                                        : 'بانتظار الموافقة'}
                                </span>
                            </div>

                            <div className="mt-2">
                                <RatingStars rating={review.rating} />
                            </div>

                            <p className="text-muted-foreground mt-2 text-sm">
                                {review.comment}
                            </p>

                            <Form {...update.form(review.id)} className="mt-4">
                                {({ processing }) => (
                                    <>
                                        <input
                                            type="hidden"
                                            name="is_approved"
                                            value={
                                                review.is_approved ? '0' : '1'
                                            }
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={
                                                review.is_approved
                                                    ? secondaryButtonClassName
                                                    : primaryButtonClassName
                                            }
                                        >
                                            {review.is_approved
                                                ? 'إلغاء الظهور'
                                                : 'الموافقة وإظهارها'}
                                        </button>
                                    </>
                                )}
                            </Form>
                        </li>
                    ))}
                </ul>
            )}

            {(reviews.prev_page_url || reviews.next_page_url) && (
                <div className="mt-6 flex items-center justify-between text-sm">
                    {reviews.prev_page_url ? (
                        <Link
                            href={reviews.prev_page_url}
                            className="text-accent font-medium hover:underline"
                            preserveScroll
                        >
                            السابق
                        </Link>
                    ) : (
                        <span />
                    )}
                    <span className="text-muted-foreground">
                        صفحة {reviews.current_page} من {reviews.last_page}
                    </span>
                    {reviews.next_page_url ? (
                        <Link
                            href={reviews.next_page_url}
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
        </DashboardLayout>
    );
}
