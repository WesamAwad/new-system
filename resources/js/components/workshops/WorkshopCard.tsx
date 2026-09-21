import { show } from '@/actions/App/Http/Controllers/WorkshopController';
import { RatingStars } from '@/components/rating-stars';
import type { Workshop } from '@/types';
import { Link } from '@inertiajs/react';

type Props = {
    workshop: Workshop;
};

export default function WorkshopCard({ workshop }: Props) {
    const services = (workshop.services ?? []).slice(0, 3);

    return (
        <div className="border-border/40 flex h-full flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
                {workshop.logo ? (
                    <img
                        src={workshop.logo}
                        alt={workshop.name}
                        className="h-12 w-12 shrink-0 rounded-xl object-cover"
                    />
                ) : (
                    <div
                        className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold"
                        aria-hidden="true"
                    >
                        {workshop.name.charAt(0)}
                    </div>
                )}
                <div className="min-w-0">
                    <h3 className="text-heading truncate font-bold">
                        {workshop.name}
                    </h3>
                    <RatingStars
                        rating={workshop.rating}
                        reviewsCount={workshop.reviews_count}
                    />
                </div>
            </div>

            <span className="bg-muted text-muted-foreground inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
                📍 {workshop.city}
            </span>

            {services.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {services.map((service) => (
                        <span
                            key={service.id}
                            className="border-border/50 text-foreground rounded-full border px-2.5 py-1 text-xs"
                        >
                            {service.category?.name}
                        </span>
                    ))}
                </div>
            )}

            <Link
                href={show(workshop.id)}
                className="bg-primary hover:bg-primary-hover mt-auto inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white transition"
            >
                عرض الملف الشخصي
            </Link>
        </div>
    );
}
