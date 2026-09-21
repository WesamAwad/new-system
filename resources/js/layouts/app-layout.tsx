import { destroy as destroySession } from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import { index as categoriesIndex } from '@/actions/App/Http/Controllers/CategoryController';
import {
    create as ticketsCreate,
    index as ticketsIndex,
} from '@/actions/App/Http/Controllers/TicketController';
import { primaryButtonClassName, secondaryButtonClassName } from '@/lib/ui';
import { home, login, register } from '@/routes';
import { Form, Link, usePage } from '@inertiajs/react';
import { useState, type PropsWithChildren } from 'react';

export default function AppLayout({
    children,
    title,
}: PropsWithChildren<{ title?: string }>) {
    const { auth, flash, name } = usePage().props;
    const user = auth.user;
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = user
        ? [
              { href: ticketsIndex(), label: 'Tickets' },
              ...(user.role === 'customer' || user.role === 'admin'
                  ? [{ href: ticketsCreate(), label: 'New ticket' }]
                  : []),
              { href: categoriesIndex(), label: 'Categories' },
          ]
        : [
              { href: login(), label: 'Log in' },
              { href: register(), label: 'Register' },
          ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-6">
                        <Link
                            href={home()}
                            className="text-lg font-semibold tracking-tight text-teal-800"
                        >
                            {name || 'SwiftFix'}
                        </Link>
                        {user && (
                            <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 md:flex">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="hover:text-teal-700"
                                        prefetch
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </div>

                    <div className="hidden items-center gap-3 text-sm md:flex">
                        {user ? (
                            <>
                                <span className="max-w-[14rem] truncate text-slate-500">
                                    {user.name}{' '}
                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs tracking-wide text-slate-600 uppercase">
                                        {user.role}
                                    </span>
                                </span>
                                <Form {...destroySession.form()}>
                                    {({ processing }) => (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={secondaryButtonClassName}
                                        >
                                            {processing
                                                ? 'Logging out…'
                                                : 'Log out'}
                                        </button>
                                    )}
                                </Form>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="font-medium text-slate-700 hover:text-teal-700"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className={primaryButtonClassName}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 md:hidden"
                        aria-expanded={menuOpen}
                        aria-controls="mobile-nav"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? 'Close' : 'Menu'}
                    </button>
                </div>

                {menuOpen && (
                    <div
                        id="mobile-nav"
                        className="border-t border-slate-200 bg-white px-4 py-3 md:hidden"
                    >
                        <nav className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="rounded-md px-2 py-2 hover:bg-slate-50"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {user && (
                                <>
                                    <div className="px-2 py-1 text-slate-500">
                                        {user.name} · {user.role}
                                    </div>
                                    <Form {...destroySession.form()}>
                                        {({ processing }) => (
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className={`${secondaryButtonClassName} w-full`}
                                            >
                                                {processing
                                                    ? 'Logging out…'
                                                    : 'Log out'}
                                            </button>
                                        )}
                                    </Form>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                {title && (
                    <h1 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
                        {title}
                    </h1>
                )}

                {flash.success && (
                    <div
                        className="mb-4 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900"
                        role="status"
                    >
                        {flash.success}
                    </div>
                )}

                {flash.error && (
                    <div
                        className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                        role="alert"
                    >
                        {flash.error}
                    </div>
                )}

                {children}
            </main>
        </div>
    );
}
