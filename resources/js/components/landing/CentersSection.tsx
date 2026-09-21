import { register } from '@/routes';
import { Link } from '@inertiajs/react';

const highlights = [
    'فحص بالمجهر الرقمي للأجزاء الدقيقة',
    'فحص جودة على 21 نقطة قبل التسليم',
    'حماية خصوصية البيانات أثناء الصيانة',
] as const;

export default function CentersSection() {
    return (
        <section id="centers" className="bg-white py-14 sm:py-16">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                {/* First in DOM = start side in RTL (right) */}
                <div className="space-y-6 text-start">
                    <h2 className="text-2xl leading-tight font-bold tracking-tight text-heading sm:text-3xl">
                        مراكز صيانة متطورة وفنيون مرخصون بدقة احترافية
                    </h2>
                    <ul className="space-y-3">
                        {highlights.map((item) => (
                            <li
                                key={item}
                                className="flex items-start justify-start gap-2 text-sm text-muted-foreground"
                            >
                                <span
                                    className="mt-0.5 text-primary"
                                    aria-hidden="true"
                                >
                                    ✓
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-wrap items-center justify-start gap-3">
                        <Link
                            href={register()}
                            className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
                        >
                            احجز زيارة للمركز
                        </Link>
                        <a
                            href="#how-it-works"
                            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                        >
                            <span aria-hidden="true">←</span>
                            تعرف على معاييرنا
                        </a>
                    </div>
                </div>

                <div className="relative">
                    <div className="overflow-hidden rounded-2xl border border-border/30 shadow-lg">
                        <img
                            src="/images/landing/technician.png"
                            alt="فني صيانة معتمد"
                            className="aspect-4/3 w-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-s-4 bottom-4 max-w-xs rounded-xl border border-border/30 bg-white/95 px-4 py-3 text-xs text-foreground shadow-md backdrop-blur">
                        مركز معتمد وسريع — ضمان حقيقي حتى 6 أشهر
                    </div>
                </div>
            </div>
        </section>
    );
}
