const steps = [
    {
        number: '1',
        title: 'حدد العطل ونوع الخدمة',
        description:
            'اختر نوع الجهاز ووصف المشكلة خلال ثوانٍ عبر نموذج البحث السريع.',
    },
    {
        number: '2',
        title: 'اختر الفني المناسب',
        description:
            'تصفّح الفنيين والمراكز المعتمدة حسب الموقع والتقييم والتوافر.',
    },
    {
        number: '3',
        title: 'استلم مع الضمان المعتمد',
        description:
            'تابع حالة الطلب لحظة بلحظة واستلم جهازك بضمان يصل إلى 180 يوماً.',
    },
] as const;

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-muted py-14 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-heading mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
                    كيف تعمل منصة سويفت فيكس؟
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {steps.map((step) => (
                        <article
                            key={step.number}
                            className="bg-surface rounded-2xl p-6 text-center shadow-sm"
                        >
                            <div className="bg-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-full text-lg font-bold text-white">
                                {step.number}
                            </div>
                            <h3 className="text-heading mb-2 text-base font-bold">
                                {step.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
