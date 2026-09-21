import { index as workshopsIndex } from '@/actions/App/Http/Controllers/WorkshopController';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import { Head, Link } from '@inertiajs/react';

const stats = [
    { label: '45,000+ جهاز تم إصلاحه' },
    { label: 'ضمان معتمد 180 يوماً' },
    { label: 'دعم فني 24/7' },
] as const;

const values = [
    {
        icon: '💬',
        title: 'شفافية كاملة',
        description:
            'أسعار واضحة للقطع والعمالة منذ اللحظة الأولى، بدون تكاليف مخفية.',
    },
    {
        icon: '🛡️',
        title: 'ورش موثوقة',
        description:
            'كل ورشة على المنصة معتمدة ومقيّمة من عملاء حقيقيين قبل ظهورها في الدليل.',
    },
    {
        icon: '📡',
        title: 'تتبع لحظي',
        description: 'متابعة حالة طلب الصيانة أولاً بأول من الاستلام وحتى التسليم.',
    },
] as const;

export default function About() {
    return (
        <>
            <Head title="من نحن" />

            <div dir="rtl" className="bg-muted text-foreground min-h-screen">
                <Header />

                <main>
                    <section className="bg-white py-14 sm:py-20">
                        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                            <p className="text-primary mb-2 text-sm font-medium">
                                قصتنا
                            </p>
                            <h1 className="text-heading text-3xl font-bold tracking-tight sm:text-4xl">
                                نجعل صيانة أجهزتك{' '}
                                <span className="text-primary">
                                    أسهل وأكثر شفافية
                                </span>
                            </h1>
                            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
                                سويفت فيكس منصة رقمية متخصصة تربط أصحاب الأجهزة
                                الذكية بورش وفنيي صيانة معتمدين، بهدف القضاء على
                                الغموض في سوق الصيانة من خلال أسعار شفافة، ودليل
                                ورش موثّق، ومتابعة حية لحالة كل طلب.
                            </p>

                            <div className="text-muted-foreground mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:gap-6">
                                {stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="bg-secondary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
                                    >
                                        <span aria-hidden="true">✓</span>
                                        <span>{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-muted py-14 sm:py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <h2 className="text-heading mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
                                ما الذي يميزنا؟
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-3">
                                {values.map((value) => (
                                    <article
                                        key={value.title}
                                        className="border-border/40 rounded-2xl border bg-white p-6 text-center shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="bg-secondary mx-auto mb-4 flex size-11 items-center justify-center rounded-xl text-xl">
                                            <span aria-hidden="true">
                                                {value.icon}
                                            </span>
                                        </div>
                                        <h3 className="text-heading mb-1 text-base font-bold">
                                            {value.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {value.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-brand-ink">
                        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-12 text-center sm:px-6 lg:px-8">
                            <h2 className="max-w-2xl text-2xl font-bold text-white sm:text-3xl">
                                جاهز تجرب سويفت فيكس؟
                            </h2>
                            <Link
                                href={workshopsIndex()}
                                className="bg-primary hover:bg-primary-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition"
                            >
                                <span aria-hidden="true">🔧</span>
                                تصفح الورش المعتمدة
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
