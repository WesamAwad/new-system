import {
    destroy,
    index as ticketsIndex,
    update,
} from '@/actions/App/Http/Controllers/TicketController';
import { store as storeUpdate } from '@/actions/App/Http/Controllers/TicketUpdateController';
import InputError from '@/components/input-error';
import { PriorityLabel, StatusBadge } from '@/components/ticket-badges';
import AppLayout from '@/layouts/app-layout';
import type { Ticket } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';

type TechnicianOption = {
    id: number;
    name: string;
    email?: string;
};

type Props = {
    ticket: Ticket;
    technicians: TechnicianOption[];
};

export default function TicketsShow({ ticket, technicians }: Props) {
    const user = usePage().props.auth.user;
    const isAdmin = user?.role === 'admin';
    const isStaff = isAdmin || user?.role === 'technician';
    const canDelete =
        user?.role === 'admin' ||
        (user?.role === 'customer' &&
            ticket.user_id === user.id &&
            ticket.status === 'pending');
    const canUpdate =
        user?.role === 'admin' ||
        (user?.role === 'technician' && ticket.assigned_to === user.id) ||
        (user?.role === 'customer' && ticket.user_id === user.id);

    return (
        <AppLayout title={ticket.ticket_number}>
            <Head title={ticket.ticket_number} />

            <div className="mb-4">
                <Link
                    href={ticketsIndex()}
                    className="text-sm text-teal-700 hover:underline"
                >
                    ← Back to tickets
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="space-y-4 lg:col-span-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                            <StatusBadge status={ticket.status} />
                            <PriorityLabel priority={ticket.priority} />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            {ticket.title}
                        </h2>
                        <p className="mt-3 whitespace-pre-wrap text-slate-700">
                            {ticket.description}
                        </p>
                        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-slate-500">Category</dt>
                                <dd className="font-medium">
                                    {ticket.category?.name ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Address</dt>
                                <dd className="font-medium">
                                    {ticket.address}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Customer</dt>
                                <dd className="font-medium">
                                    {ticket.customer?.name ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Assignee</dt>
                                <dd className="font-medium">
                                    {ticket.assignee?.name ?? 'Unassigned'}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold tracking-wide text-slate-500 uppercase">
                            Updates
                        </h3>
                        <div className="space-y-4">
                            {(ticket.updates ?? []).length === 0 && (
                                <p className="text-sm text-slate-500">
                                    No updates yet.
                                </p>
                            )}
                            {(ticket.updates ?? []).map((updateItem) => (
                                <div
                                    key={updateItem.id}
                                    className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                                >
                                    <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                        <span className="font-medium text-slate-700">
                                            {updateItem.user?.name ?? 'User'}
                                        </span>
                                        <span>
                                            {new Date(
                                                updateItem.created_at,
                                            ).toLocaleString()}
                                        </span>
                                        {updateItem.is_internal && (
                                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">
                                                Internal
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-800">
                                        {updateItem.message}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Form
                            {...storeUpdate.form(ticket.id)}
                            className="mt-6 space-y-3 border-t border-slate-100 pt-4"
                            resetOnSuccess
                        >
                            {({ errors, processing }) => (
                                <>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Add update
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={3}
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    />
                                    <InputError message={errors.message} />
                                    {isStaff && (
                                        <label className="flex items-center gap-2 text-sm text-slate-600">
                                            <input
                                                type="checkbox"
                                                name="is_internal"
                                                value="1"
                                                className="rounded border-slate-300 text-teal-700"
                                            />
                                            Internal note
                                        </label>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                                    >
                                        {processing
                                            ? 'Posting…'
                                            : 'Post update'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </div>
                </section>

                <aside className="space-y-4">
                    {isAdmin && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-sm font-semibold text-slate-800">
                                Assign technician
                            </h3>
                            <Form
                                action={update.url(ticket.id)}
                                method="patch"
                                className="space-y-3"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <select
                                            name="assigned_to"
                                            defaultValue={
                                                ticket.assigned_to ?? ''
                                            }
                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                        >
                                            <option value="">Unassigned</option>
                                            {technicians.map((technician) => (
                                                <option
                                                    key={technician.id}
                                                    value={technician.id}
                                                >
                                                    {technician.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.assigned_to}
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                                        >
                                            {processing
                                                ? 'Saving…'
                                                : 'Save assignee'}
                                        </button>
                                    </>
                                )}
                            </Form>
                        </div>
                    )}

                    {canUpdate && isStaff && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-sm font-semibold text-slate-800">
                                Update status
                            </h3>
                            <Form
                                action={update.url(ticket.id)}
                                method="patch"
                                className="space-y-3"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <select
                                            name="status"
                                            defaultValue={ticket.status}
                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="assigned">
                                                Assigned
                                            </option>
                                            <option value="in_progress">
                                                In progress
                                            </option>
                                            <option value="completed">
                                                Completed
                                            </option>
                                            <option value="cancelled">
                                                Cancelled
                                            </option>
                                        </select>
                                        <InputError message={errors.status} />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                        >
                                            {processing
                                                ? 'Saving…'
                                                : 'Save status'}
                                        </button>
                                    </>
                                )}
                            </Form>
                        </div>
                    )}

                    {canUpdate && !isStaff && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-sm font-semibold text-slate-800">
                                Edit details
                            </h3>
                            <Form
                                action={update.url(ticket.id)}
                                method="patch"
                                className="space-y-3"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <input
                                            name="title"
                                            defaultValue={ticket.title}
                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                        />
                                        <InputError message={errors.title} />
                                        <textarea
                                            name="description"
                                            defaultValue={ticket.description}
                                            rows={4}
                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                        <input
                                            name="address"
                                            defaultValue={ticket.address}
                                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                        />
                                        <InputError message={errors.address} />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                        >
                                            {processing
                                                ? 'Saving…'
                                                : 'Save changes'}
                                        </button>
                                    </>
                                )}
                            </Form>
                        </div>
                    )}

                    {canDelete && (
                        <Form action={destroy.url(ticket.id)} method="delete">
                            {({ processing }) => (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                                    onClick={(event) => {
                                        if (!confirm('Delete this ticket?')) {
                                            event.preventDefault();
                                        }
                                    }}
                                >
                                    {processing ? 'Deleting…' : 'Delete ticket'}
                                </button>
                            )}
                        </Form>
                    )}
                </aside>
            </div>
        </AppLayout>
    );
}
