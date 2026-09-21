import {
    destroy,
    store,
    update,
} from "@/actions/App/Http/Controllers/CategoryController";
import InputError from "@/components/input-error";
import AppLayout from "@/layouts/app-layout";
import type { Category } from "@/types";
import { Form, Head, usePage } from "@inertiajs/react";

type Props = {
    categories: Category[];
};

export default function CategoriesIndex({ categories }: Props) {
    const user = usePage().props.auth.user;
    const isAdmin = user?.role === "admin";

    return (
        <AppLayout title="Categories">
            <Head title="Categories" />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-3 lg:col-span-2">
                    {categories.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-500">
                            No categories available.
                        </div>
                    ) : (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h2 className="font-semibold text-slate-900">
                                            {category.name}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {category.description ||
                                                "No description"}
                                        </p>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Base price:{" "}
                                            <span className="font-medium text-slate-800">
                                                {category.base_price}
                                            </span>
                                            {category.is_active === false && (
                                                <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                                                    Inactive
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {isAdmin && (
                                        <Form
                                            action={destroy.url(category.id)}
                                            method="delete"
                                        >
                                            {({ processing }) => (
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="text-sm font-medium text-red-600 hover:underline disabled:opacity-60"
                                                    onClick={(event) => {
                                                        if (
                                                            !confirm(
                                                                "Delete this category?",
                                                            )
                                                        ) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </Form>
                                    )}
                                </div>

                                {isAdmin && (
                                    <Form
                                        action={update.url(category.id)}
                                        method="patch"
                                        className="mt-4 grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2"
                                    >
                                        {({ errors, processing }) => (
                                            <>
                                                <input
                                                    name="name"
                                                    defaultValue={category.name}
                                                    className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                                <input
                                                    name="base_price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    defaultValue={
                                                        category.base_price
                                                    }
                                                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                                                />
                                                <input
                                                    type="hidden"
                                                    name="is_active"
                                                    value="0"
                                                />
                                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                                    <input
                                                        type="checkbox"
                                                        name="is_active"
                                                        value="1"
                                                        defaultChecked={
                                                            category.is_active !==
                                                            false
                                                        }
                                                    />
                                                    Active
                                                </label>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2"
                                                >
                                                    {processing
                                                        ? "Saving…"
                                                        : "Save category"}
                                                </button>
                                            </>
                                        )}
                                    </Form>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {isAdmin && (
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-3 font-semibold text-slate-900">
                            Add category
                        </h2>
                        <Form
                            {...store.form()}
                            className="space-y-3"
                            resetOnSuccess
                        >
                            {({ errors, processing }) => (
                                <>
                                    <input
                                        name="name"
                                        required
                                        placeholder="Name"
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <InputError message={errors.name} />
                                    <textarea
                                        name="description"
                                        placeholder="Description"
                                        rows={3}
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        name="base_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        placeholder="Base price"
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <InputError message={errors.base_price} />
                                    <input
                                        type="hidden"
                                        name="is_active"
                                        value="0"
                                    />
                                    <label className="flex items-center gap-2 text-sm text-slate-600">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            value="1"
                                            defaultChecked
                                        />
                                        Active
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                    >
                                        {processing
                                            ? "Creating…"
                                            : "Create category"}
                                    </button>
                                </>
                            )}
                        </Form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
