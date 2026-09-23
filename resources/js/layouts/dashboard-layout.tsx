import { destroy as destroySession } from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import { index as dashboardIndex } from '@/actions/App/Http/Controllers/DashboardController';
import { index as ticketsIndex } from '@/actions/App/Http/Controllers/TicketController';
import { edit as editWorkshopProfile } from '@/actions/App/Http/Controllers/WorkshopProfileController';
import { index as reviewsIndex } from '@/actions/App/Http/Controllers/WorkshopReviewController';
import { Form, Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ title?: string }>;

const navLinks: Array<{ href: string; label: string }> = [
    { href: dashboardIndex.url(), label: 'الرئيسية' },
    { href: ticketsIndex.url(), label: 'طلبات الإصلاح' },
    { href: editWorkshopProfile.url(), label: 'ورشتي' },
    { href: reviewsIndex.url(), label: 'المراجعات' },
];

export default function DashboardLayout({ children, title }: Props) {
    const { props, url } = usePage();
    const user = props.auth.user;
    const flash = props.flash;
    const currentPath = url.split('?')[0];

    return (
        <div dir="rtl" className="bg-muted text-foreground flex min-h-screen">
            <aside className="border-border/40 hidden w-60 shrink-0 border-s bg-white sm:block">
                <div className="border-border/40 flex h-16 items-center gap-2 border-b px-5">
                    <img
                        src="/images/landing/logo.png"
                        alt="SwiftFix"
                        className="h-8 w-auto object-contain"
                    />
                    <span className="text-foreground text-sm font-bold">
                        سويفت فيكس
                    </span>
                </div>

                <nav className="flex flex-col gap-1 p-3">
                    {navLinks.map((link) => {
                        const active = currentPath === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                                    active
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <div className="flex flex-1 flex-col">
                <header className="border-border/40 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
                    {title && (
                        <h1 className="text-heading text-lg font-bold">
                            {title}
                        </h1>
                    )}

                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm">
                            {user?.name}
                        </span>
                        <Form {...destroySession.form()}>
                            <button
                                type="submit"
                                className="border-border text-muted-foreground hover:bg-muted rounded-lg border px-3 py-2 text-xs font-medium"
                            >
                                تسجيل الخروج
                            </button>
                        </Form>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6">
                    {flash.success && (
                        <div
                            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                            role="status"
                        >
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div
                            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                            role="alert"
                        >
                            {flash.error}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
