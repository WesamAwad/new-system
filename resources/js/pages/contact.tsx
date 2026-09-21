import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import { Head } from '@inertiajs/react';

const channels = [
    {
        label: 'اتصل بنا',
        value: '0599 000 000',
        href: 'tel:0599000000',
        icon: '📞',
    },
    {
        label: 'راسلنا',
        value: 'support@swiftfix.com',
        href: 'mailto:support@swiftfix.com',
        icon: '✉️',
    },
    {
        label: 'موقعنا',
        value: 'غزة، فلسطين',
        href: null,
        icon: '📍',
    },
    {
        label: 'أوقات الدعم',
        value: 'السبت – الخميس، 9 ص – 9 م',
        href: null,
        icon: '🕒',
    },
] as const;

export default function Contact() {
    return (
        <>
            <Head title="تواصل معنا" />

            <div dir="rtl" className="bg-muted text-foreground min-h-screen">
                <Header />

                <main className="py-14 sm:py-20">
                    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                        <p className="text-primary mb-2 text-sm font-medium">
                            نحن هنا لمساعدتك
                        </p>
                        <h1 className="text-heading text-3xl font-bold tracking-tight sm:text-4xl">
                            تواصل معنا
                        </h1>
                        <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-sm leading-relaxed sm:text-base">
                            فريق الدعم جاهز لمساعدتك في أي استفسار عن الطلبات أو
                            الورش المعتمدة أو التسجيل كفني صيانة.
                        </p>
                    </div>

                    <div className="mx-auto mt-12 grid max-w-3xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
                        {channels.map((channel) => {
                            const content = (
                                <>
                                    <div className="bg-secondary mx-auto mb-3 flex size-11 items-center justify-center rounded-xl text-xl">
                                        <span aria-hidden="true">
                                            {channel.icon}
                                        </span>
                                    </div>
                                    <p className="text-heading font-bold">
                                        {channel.label}
                                    </p>
                                    <p
                                        dir="ltr"
                                        className="text-muted-foreground mt-1 text-sm"
                                    >
                                        {channel.value}
                                    </p>
                                </>
                            );

                            const className =
                                'rounded-2xl border border-border/40 bg-white p-6 text-center shadow-sm transition hover:shadow-md';

                            return channel.href ? (
                                <a
                                    key={channel.label}
                                    href={channel.href}
                                    className={className}
                                >
                                    {content}
                                </a>
                            ) : (
                                <div key={channel.label} className={className}>
                                    {content}
                                </div>
                            );
                        })}
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
