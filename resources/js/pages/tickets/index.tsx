import {
    index as ticketsIndex,
    show,
} from '@/actions/App/Http/Controllers/TicketController';
import { index as workshopsIndex } from '@/actions/App/Http/Controllers/WorkshopController';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import { StatusBadge } from '@/components/ticket-badges';
import DashboardLayout from '@/layouts/dashboard-layout';
import {
    fieldClassName,
    labelClassName,
    primaryButtonClassName,
    secondaryButtonClassName,
} from '@/lib/ui';
import type { Paginated, Ticket } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

type Filters = {
    search: string | null;
    status: string | null;
    priority: string | null;
};

type Props = {
    tickets: Paginated<Ticket>;
    filters: Filters;
};

const statusOptions: Array<{ value: string; label: string }> = [
    { value: '', label: 'الكل' },
    { value: 'pending', label: 'قيد الإرسال' },
    { value: 'active', label: 'قيد المتابعة' },
    { value: 'completed', label: 'مكتملة' },
    { value: 'cancelled', label: 'ملغاة' },
];

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function TicketsIndex({ tickets, filters }: Props) {
    const user = usePage().props.auth.user;
    const canCreate = user?.role === 'customer';
    const isTechnician = user?.role === 'technician';
    const hasActiveFilters = Boolean(
        filters.search || filters.status || filters.priority,
    );

    function submitFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const search = formData.get('search');
        const status = formData.get('status');

        router.get(
            ticketsIndex.url(),
            {
                search:
                    typeof search === 'string' && search !== ''
                        ? search
                        : undefined,
                status:
                    typeof status === 'string' && status !== ''
                        ? status
                        : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function resetFilters() {
        router.get(
            ticketsIndex.url(),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    const content = (
        <>
            <form
                onSubmit={submitFilters}
                className="border-border/40 mb-8 grid gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:grid-cols-3"
            >
                <div className="sm:col-span-2">
                    <label htmlFor="search" className={labelClassName}>
                        البحث
                    </label>
                    <input
                        id="search"
                        name="search"
                        type="search"
                        defaultValue={filters.search ?? ''}
                        placeholder="رقم الطلب أو العنوان…"
                        className={fieldClassName}
                    />
                </div>
                <div>
                    <label htmlFor="status" className={labelClassName}>
                        الحالة
                    </label>
                    <select
                        id="status"
                        name="status"
                        defaultValue={filters.status ?? ''}
                        className={fieldClassName}
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-wrap gap-2 sm:col-span-3">
                    <button type="submit" className={primaryButtonClassName}>
                        تطبيق الفلاتر
                    </button>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className={secondaryButtonClassName}
                        >
                            مسح الفلاتر
                        </button>
                    )}
                </div>
            </form>

            {tickets.data.length === 0 ? (
                <div className="border-border rounded-2xl border border-dashed bg-white px-6 py-14 text-center">
                    <div
                        className="bg-primary/10 mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                        aria-hidden="true"
                    >
                        🧾
                    </div>
                    <p className="text-muted-foreground mt-4">
                        {hasActiveFilters
                            ? 'لا توجد طلبات مطابقة لبحثك.'
                            : 'لا توجد طلبات صيانة بعد.'}
                    </p>
                    {canCreate && !hasActiveFilters && (
                        <Link
                            href={workshopsIndex()}
                            className={`${primaryButtonClassName} mt-4`}
                        >
                            تصفح الورش لتقديم طلب جديد
                        </Link>
                    )}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className={`${secondaryButtonClassName} mt-4`}
                        >
                            مسح الفلاتر
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {tickets.data.map((ticket) => (
                        <Link
                            key={ticket.id}
                            href={show(ticket.id)}
                            prefetch
                            className="group border-border/40 flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="bg-muted text-foreground rounded-full px-2.5 py-1 font-mono text-xs font-semibold">
                                    {ticket.ticket_number}
                                </span>
                                <StatusBadge status={ticket.status} />
                            </div>

                            <div>
                                <h2 className="text-heading truncate font-bold">
                                    {ticket.title}
                                </h2>
                                <p className="text-muted-foreground mt-0.5 text-sm">
                                    {ticket.category?.name ?? '—'}
                                </p>
                                {!canCreate && ticket.customer?.name && (
                                    <p className="text-muted-foreground/70 mt-0.5 text-xs">
                                        العميل: {ticket.customer.name}
                                    </p>
                                )}
                            </div>

                            <div className="text-muted-foreground text-sm">
                                <p className="truncate">{ticket.address}</p>
                                <p className="text-muted-foreground/70 mt-0.5 text-xs">
                                    {formatDate(ticket.created_at)}
                                </p>
                            </div>

                            <span className="text-accent mt-auto text-sm font-semibold group-hover:underline">
                                عرض التفاصيل ←
                            </span>
                        </Link>
                    ))}
                </div>
            )}

            {(tickets.prev_page_url || tickets.next_page_url) && (
                <div className="mt-8 flex items-center justify-between text-sm">
                    {tickets.prev_page_url ? (
                        <Link
                            href={tickets.prev_page_url}
                            className="text-accent font-medium hover:underline"
                            preserveScroll
                        >
                            السابق
                        </Link>
                    ) : (
                        <span />
                    )}
                    <span className="text-muted-foreground">
                        صفحة {tickets.current_page} من {tickets.last_page}
                    </span>
                    {tickets.next_page_url ? (
                        <Link
                            href={tickets.next_page_url}
                            className="text-accent font-medium hover:underline"
                            preserveScroll
                        >
                            التالي
                        </Link>
                    ) : (
                        <span />
                    )}
                </div>
            )}
        </>
    );

    if (isTechnician) {
        return (
            <DashboardLayout title="طلبات الإصلاح">
                <Head title="طلبات الإصلاح" />
                {content}
            </DashboardLayout>
        );
    }

    return (
        <>
            <Head title="طلباتي" />

            <div dir="rtl" className="bg-muted text-foreground min-h-screen">
                <Header />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-heading text-2xl font-bold tracking-tight sm:text-3xl">
                                {canCreate ? 'طلباتي' : 'جميع الطلبات'}
                            </h1>
                            <p className="text-muted-foreground mt-2 text-sm">
                                {canCreate
                                    ? 'متابعة وإدارة جميع طلبات الصيانة الخاصة بك.'
                                    : 'إدارة ومتابعة طلبات الصيانة.'}
                            </p>
                        </div>
                        {canCreate && (
                            <Link
                                href={workshopsIndex()}
                                className={primaryButtonClassName}
                            >
                                تصفح الورش / طلب جديد
                            </Link>
                        )}
                    </div>

                    {content}
                </main>

                <Footer />
            </div>
        </>
    );
}
