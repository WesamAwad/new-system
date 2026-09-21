import { destroy as destroySession } from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import { index as ticketsIndex } from '@/actions/App/Http/Controllers/TicketController';
import { index as workshopsIndex } from '@/actions/App/Http/Controllers/WorkshopController';
import { home, login, register } from '@/routes';
import { Form, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navLinks: Array<{
    href: string;
    label: string;
    active?: boolean;
}> = [
    { href: '#top', label: 'الرئيسية', active: true },
    { href: '#services', label: 'خدمات الصيانة' },
    { href: workshopsIndex.url(), label: 'الورش المعتمدة' },
    { href: '#how-it-works', label: 'كيف نعمل' },
    { href: '#track', label: 'تتبع الطلب' },
];

function isRouteHref(href: string): boolean {
    return !href.startsWith('#');
}

export default function Header() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="border-border/40 sticky top-0 z-40 border-b bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <Link
                    href={home()}
                    className="flex shrink-0 items-center gap-2"
                >
                    <img
                        src="/images/landing/logo.png"
                        alt="SwiftFix"
                        className="h-10 w-auto object-contain sm:h-12"
                    />
                    <span className="text-foreground hidden text-sm font-bold sm:inline">
                        سويفت فيكس
                    </span>
                </Link>

                <nav className="hidden items-center gap-6 lg:flex">
                    {navLinks.map((link) => {
                        const className = `relative text-sm transition ${
                            link.active
                                ? 'text-foreground after:bg-primary font-semibold after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:rounded-full'
                                : 'text-muted-foreground hover:text-foreground'
                        }`;

                        return isRouteHref(link.href) ? (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={className}
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.href}
                                href={link.href}
                                className={className}
                            >
                                {link.label}
                            </a>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        className="text-muted-foreground hover:bg-muted hidden rounded-lg p-2 sm:inline-flex"
                        aria-label="الإشعارات"
                    >
                        🔔
                    </button>

                    {user ? (
                        <>
                            <Link
                                href={ticketsIndex()}
                                className="text-foreground hover:text-primary hidden text-sm font-medium sm:inline"
                            >
                                {user.name}
                            </Link>
                            <Form {...destroySession.form()}>
                                <button
                                    type="submit"
                                    className="border-border text-muted-foreground hover:bg-muted rounded-lg border px-3 py-2 text-xs font-medium"
                                >
                                    تسجيل الخروج
                                </button>
                            </Form>
                        </>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="text-foreground hover:text-primary hidden items-center gap-1 text-sm font-medium sm:inline-flex"
                            >
                                <span aria-hidden="true">👤</span>
                                تسجيل الدخول
                            </Link>
                            <Link
                                href={register()}
                                className="bg-primary hover:bg-primary-hover rounded-xl px-3 py-2 text-xs font-bold text-white shadow-sm transition sm:px-4 sm:text-sm"
                            >
                                إنشاء حساب
                            </Link>
                        </>
                    )}

                    <button
                        type="button"
                        className="border-border inline-flex rounded-lg border px-2.5 py-2 text-sm lg:hidden"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-expanded={menuOpen}
                        aria-label="القائمة"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {menuOpen ? (
                <div className="border-border/40 border-t bg-white px-4 py-3 lg:hidden">
                    <div className="flex flex-col gap-3 text-right">
                        {navLinks.map((link) =>
                            isRouteHref(link.href) ? (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-muted-foreground hover:text-foreground text-sm"
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-muted-foreground hover:text-foreground text-sm"
                                >
                                    {link.label}
                                </a>
                            ),
                        )}
                        {!user ? (
                            <Link
                                href={login()}
                                className="text-foreground text-sm font-medium"
                            >
                                تسجيل الدخول
                            </Link>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </header>
    );
}
