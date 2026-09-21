import { store } from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';

type Props = {
    email: string;
    token: string;
};

export default function ResetPassword({ email, token }: Props) {
    return (
        <AppLayout title="Reset password">
            <Head title="Reset password" />

            <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <Form {...store.form()} className="space-y-4">
                    {({ errors, processing }) => (
                        <>
                            <input type="hidden" name="token" value={token} />

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    defaultValue={email}
                                    autoComplete="username"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    New password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Confirm password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Resetting…' : 'Reset password'}
                            </button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
