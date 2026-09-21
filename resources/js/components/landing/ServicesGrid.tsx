import { register } from '@/routes';
import { Link } from '@inertiajs/react';

export type LandingService = {
    title: string;
    description: string;
    meta: string;
    icon: string;
};

type ServicesGridProps = {
    services: LandingService[];
};

const iconMap: Record<string, string> = {
    screen: '📱',
    battery: '🔋',
    port: '🔌',
    board: '🛠️',
};

export default function ServicesGrid({ services }: ServicesGridProps) {
    return (
        <section id="services" className="bg-white py-14 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <p className="text-primary mb-2 text-sm font-medium">
                        خدمات سريعة
                    </p>
                    <h2 className="text-heading text-2xl font-bold tracking-tight sm:text-3xl">
                        خدمات الصيانة الأكثر طلباً
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-sm">
                        اختر الخدمة المناسبة وابدأ طلب الفحص مع فنيين معتمدين
                        وضمان واضح قبل التنفيذ.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {services.map((service) => (
                        <article
                            key={service.title}
                            className="border-border/40 bg-muted/60 flex h-full flex-col rounded-2xl border p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div className="bg-secondary mb-4 flex size-11 items-center justify-center rounded-xl text-xl">
                                <span aria-hidden="true">
                                    {iconMap[service.icon] ?? '⚙️'}
                                </span>
                            </div>
                            <h3 className="text-heading mb-2 text-base font-bold">
                                {service.title}
                            </h3>
                            <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed">
                                {service.description}
                            </p>
                            <div className="border-border/30 flex items-center justify-between gap-2 border-t pt-4">
                                <span className="text-subtle text-xs">
                                    {service.meta}
                                </span>
                                <Link
                                    href={register()}
                                    className="text-primary hover:text-primary-hover inline-flex items-center gap-1 text-sm font-medium"
                                >
                                    طلب فحص
                                    <span aria-hidden="true">←</span>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
