import { index } from '@/actions/App/Http/Controllers/WorkshopController';
import WorkshopCard from '@/components/workshops/WorkshopCard';
import type { Workshop } from '@/types';
import { Link } from '@inertiajs/react';

type Props = {
    workshops: Workshop[];
};

export default function FeaturedWorkshops({ workshops }: Props) {
    if (workshops.length === 0) {
        return null;
    }

    return (
        <section id="workshops" className="bg-muted py-14 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-heading text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                            الورش المعتمدة
                        </h2>
                        <p className="text-muted-foreground mt-2 text-sm">
                            أفضل الورش تقييماً من عملاء سويفت فيكس الحقيقيين
                        </p>
                    </div>
                    <Link
                        href={index()}
                        className="text-accent text-sm font-semibold hover:underline"
                    >
                        عرض الكل ←
                    </Link>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {workshops.map((workshop) => (
                        <WorkshopCard key={workshop.id} workshop={workshop} />
                    ))}
                </div>
            </div>
        </section>
    );
}
