import {
    create,
    index as ticketsIndex,
    show,
} from '@/actions/App/Http/Controllers/TicketController';
import { PriorityLabel, StatusBadge } from '@/components/ticket-badges';
import AppLayout from '@/layouts/app-layout';
import {
    fieldClassName,
    labelClassName,
    primaryButtonClassName,
    secondaryButtonClassName,
} from '@/lib/ui';
import type { Paginated, Ticket, TicketPriority, TicketStatus } from '@/types';
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

const statuses: TicketStatus[] = [
    'pending',
    'assigned',
    'in_progress',
    'completed',
    'cancelled',
];

const priorities: TicketPriority[] = ['low', 'medium', 'high', 'emergency'];

export default function TicketsIndex({ tickets, filters }: Props) {
    const user = usePage().props.auth.user;
    const canCreate = user?.role === 'customer' || user?.role === 'admin';
    const hasActiveFilters = Boolean(
        filters.search || filters.status || filters.priority,
    );

    function submitFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const search = formData.get('search');
        const status = formData.get('status');
        const priority = formData.get('priority');

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
                priority:
                    typeof priority === 'string' && priority !== ''
                        ? priority
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

    return (
        <AppLayout title="Tickets">
            <Head title="Tickets" />

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                    {tickets.total} ticket{tickets.total === 1 ? '' : 's'}
                    {hasActiveFilters ? ' (filtered)' : ''}
                </p>
                {canCreate && (
                    <Link href={create()} className={primaryButtonClassName}>
                        New ticket
                    </Link>
                )}
            </div>

            <form
                onSubmit={submitFilters}
                className="mb-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
            >
                <div className="sm:col-span-2 lg:col-span-2">
                    <label htmlFor="search" className={labelClassName}>
                        Search
                    </label>
                    <input
                        id="search"
                        name="search"
                        type="search"
                        defaultValue={filters.search ?? ''}
                        placeholder="Title, number, address…"
                        className={fieldClassName}
                    />
                </div>
                <div>
                    <label htmlFor="status" className={labelClassName}>
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        defaultValue={filters.status ?? ''}
                        className={fieldClassName}
                    >
                        <option value="">All statuses</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="priority" className={labelClassName}>
                        Priority
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        defaultValue={filters.priority ?? ''}
                        className={fieldClassName}
                    >
                        <option value="">All priorities</option>
                        {priorities.map((priority) => (
                            <option key={priority} value={priority}>
                                {priority}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
                    <button type="submit" className={primaryButtonClassName}>
                        Apply filters
                    </button>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className={secondaryButtonClassName}
                        >
                            Reset
                        </button>
                    )}
                </div>
            </form>

            {tickets.data.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <p className="text-slate-600">
                        {hasActiveFilters
                            ? 'No tickets match your filters.'
                            : 'No tickets yet.'}
                    </p>
                    {canCreate && !hasActiveFilters && (
                        <Link
                            href={create()}
                            className={`${primaryButtonClassName} mt-4`}
                        >
                            Create your first ticket
                        </Link>
                    )}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className={`${secondaryButtonClassName} mt-4`}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="space-y-3 md:hidden">
                        {tickets.data.map((ticket) => (
                            <Link
                                key={ticket.id}
                                href={show(ticket.id)}
                                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                                prefetch
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-medium text-teal-800">
                                            {ticket.ticket_number}
                                        </p>
                                        <p className="mt-1 truncate text-slate-800">
                                            {ticket.title}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {ticket.category?.name ?? '—'}
                                        </p>
                                    </div>
                                    <StatusBadge status={ticket.status} />
                                </div>
                                <div className="mt-3 flex items-center justify-between text-sm">
                                    <PriorityLabel priority={ticket.priority} />
                                    <span className="text-slate-500">
                                        {ticket.customer?.name ?? '—'}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                <tr>
                                    <th className="px-4 py-3">Ticket</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Priority</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Customer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tickets.data.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        className="hover:bg-slate-50/80"
                                    >
                                        <td className="px-4 py-3">
                                            <Link
                                                href={show(ticket.id)}
                                                className="font-medium text-teal-800 hover:underline"
                                                prefetch
                                            >
                                                {ticket.ticket_number}
                                            </Link>
                                            <div className="mt-0.5 max-w-xs truncate text-slate-600">
                                                {ticket.title}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {ticket.category?.name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <PriorityLabel
                                                priority={ticket.priority}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge
                                                status={ticket.status}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {ticket.customer?.name ?? '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {(tickets.prev_page_url || tickets.next_page_url) && (
                <div className="mt-4 flex items-center justify-between text-sm">
                    {tickets.prev_page_url ? (
                        <Link
                            href={tickets.prev_page_url}
                            className="text-teal-700 hover:underline"
                            preserveScroll
                        >
                            Previous
                        </Link>
                    ) : (
                        <span />
                    )}
                    <span className="text-slate-500">
                        Page {tickets.current_page} of {tickets.last_page}
                    </span>
                    {tickets.next_page_url ? (
                        <Link
                            href={tickets.next_page_url}
                            className="text-teal-700 hover:underline"
                            preserveScroll
                        >
                            Next
                        </Link>
                    ) : (
                        <span />
                    )}
                </div>
            )}
        </AppLayout>
    );
}
