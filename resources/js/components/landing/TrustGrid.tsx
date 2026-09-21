const trustItems = [
    {
        title: 'فحص مجاني لـ 21 نقطة',
        description: 'تقرير واضح قبل بدء أي إصلاح.',
    },
    {
        title: 'تسعير فوري ومسبق',
        description: 'اعرف التكلفة قبل الموافقة على العمل.',
    },
    {
        title: 'حماية خصوصية البيانات',
        description: 'إجراءات صارمة للحفاظ على ملفاتك.',
    },
    {
        title: 'دفع آمن بعد المعاينة',
        description: 'ادفع بعد التأكد من نتيجة الفحص.',
    },
] as const;

export default function TrustGrid() {
    return (
        <section className="bg-muted py-14 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-heading mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
                    لماذا يثق بنا آلاف العملاء؟
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {trustItems.map((item) => (
                        <article
                            key={item.title}
                            className="bg-surface rounded-2xl p-5 text-right shadow-sm"
                        >
                            <div className="bg-secondary text-primary mb-3 flex size-10 items-center justify-center rounded-xl">
                                ★
                            </div>
                            <h3 className="text-heading mb-1 text-sm font-bold">
                                {item.title}
                            </h3>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                {item.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
