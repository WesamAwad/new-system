import { register } from '@/routes';
import { router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

type Metric = {
    label: string;
    icon: string;
};

type HeroSectionProps = {
    metrics: Metric[];
};

const deviceTypes = [
    'هواتف ذكية',
    'أجهزة لوحية',
    'حواسيب محمولة',
    'ساعات ذكية',
] as const;

export default function HeroSection({ metrics }: HeroSectionProps) {
    const [deviceType, setDeviceType] = useState<string>(deviceTypes[0]);
    const [location, setLocation] = useState('');

    function handleSearch(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        router.visit(register.url());
    }

    return (
        <section id="top" className="bg-muted">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
                <div className="space-y-6 text-start">
                    <div className="inline-flex rounded-full bg-secondary px-3 py-1.5 text-xs text-foreground">
                        المنصة رقم 1 لخدمات صيانة الأجهزة في المنطقة
                    </div>

                    <h1 className="text-3xl leading-tight font-bold tracking-tight text-heading sm:text-4xl lg:text-5xl">
                        صيانة أجهزتك الذكية{' '}
                        <span className="text-primary">عند بابك</span> أو بأقرب
                        مركز موثوق
                    </h1>

                    <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        فنيون معتمدون، قطع غيار أصلية، وضمان حقيقي يصل إلى 180
                        يوماً مع تسعير شفاف قبل بدء الإصلاح.
                    </p>

                    <div className="flex flex-wrap justify-start gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                            Apple
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                            Samsung
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                            Huawei
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                            ساعات ذكية
                        </span>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="rounded-2xl border border-border/40 bg-white p-3 shadow-md sm:p-4"
                    >
                        <div className="grid gap-3 sm:grid-cols-3">
                            <label className="space-y-1 text-start">
                                <span className="text-xs text-subtle">
                                    نوع الجهاز
                                </span>
                                <select
                                    value={deviceType}
                                    onChange={(event) =>
                                        setDeviceType(event.target.value)
                                    }
                                    className="h-11 w-full rounded-xl border-0 bg-surface px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    {deviceTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="space-y-1 text-start">
                                <span className="text-xs text-subtle">
                                    المدينة أو الحي
                                </span>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(event) =>
                                        setLocation(event.target.value)
                                    }
                                    placeholder="مثل الرياض - العليا"
                                    className="h-11 w-full rounded-xl border-0 bg-surface px-3 text-sm text-foreground outline-none placeholder:text-subtle focus:ring-2 focus:ring-primary/30"
                                />
                            </label>

                            <button
                                type="submit"
                                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover sm:mt-5"
                            >
                                <span aria-hidden="true">🔍</span>
                                ابحث الآن
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-wrap items-center justify-start gap-4 text-xs text-muted-foreground sm:gap-6">
                        {metrics.map((metric) => (
                            <div
                                key={metric.label}
                                className="inline-flex items-center gap-1.5"
                            >
                                <span aria-hidden="true">✓</span>
                                <span>{metric.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-white shadow-lg">
                        <img
                            src="/images/landing/hero-devices.png"
                            alt="صيانة أجهزة ذكية"
                            className="aspect-4/3 w-full object-cover"
                        />
                        <div className="absolute inset-s-4 top-4 rounded-xl border border-border/30 bg-white/90 px-3 py-2 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                            قطع غيار أصلية 100%
                        </div>
                        <div className="absolute inset-e-4 bottom-4 rounded-xl border border-border/30 bg-white/90 px-3 py-2 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                            فحص أولي خلال 30 دقيقة
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
