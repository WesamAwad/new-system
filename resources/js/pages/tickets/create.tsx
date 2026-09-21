import {
    index as ticketsIndex,
    store,
} from '@/actions/App/Http/Controllers/TicketController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import type { Category } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

type Props = {
    categories: Array<Pick<Category, 'id' | 'name' | 'slug' | 'base_price'>>;
    preselectedWorkshop: { id: number; name: string } | null;
};

export default function TicketsCreate({
    categories,
    preselectedWorkshop,
}: Props) {
    return (
        <AppLayout title="New ticket">
            <Head title="New ticket" />

            <div className="mb-4">
                <Link
                    href={ticketsIndex()}
                    className="text-sm text-teal-700 hover:underline"
                >
                    ← Back to tickets
                </Link>
            </div>

            {preselectedWorkshop && (
                <div className="mb-4 max-w-2xl rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
                    طلب موجه إلى ورشة{' '}
                    <span className="font-semibold">
                        {preselectedWorkshop.name}
                    </span>
                </div>
            )}

            <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <Form {...store.form()} className="space-y-4">
                    {({ errors, processing }) => (
                        <>
                            {preselectedWorkshop && (
                                <input
                                    type="hidden"
                                    name="workshop_id"
                                    value={preselectedWorkshop.id}
                                />
                            )}
                            <div>
                                <label
                                    htmlFor="category_id"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Category
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    required
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a category
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Title
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    required
                                    maxLength={255}
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows={5}
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div>
                                <label
                                    htmlFor="address"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Address
                                </label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    required
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div>
                                <label
                                    htmlFor="priority"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    required
                                    defaultValue="medium"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="emergency">Emergency</option>
                                </select>
                                <InputError message={errors.priority} />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Submitting…' : 'Submit ticket'}
                            </button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
