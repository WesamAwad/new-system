import { store } from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';

export default function ForgotPassword() {
    return (
        <AppLayout title="Forgot password">
            <Head title="Forgot password" />

            <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="mb-4 text-sm text-slate-600">
                    Enter your email and we will send a password reset link.
                </p>

                <Form {...store.form()} className="space-y-4">
                    {({ errors, processing, recentlySuccessful }) => (
                        <>
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
                                    autoComplete="username"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Sending…' : 'Email reset link'}
                            </button>

                            {recentlySuccessful && (
                                <p className="text-sm text-teal-700">
                                    If that email exists, a reset link was sent.
                                </p>
                            )}
                        </>
                    )}
                </Form>

                <p className="mt-4 text-center text-sm text-slate-600">
                    <Link
                        href={login()}
                        className="font-medium text-teal-700 hover:underline"
                    >
                        Back to login
                    </Link>
                </p>
            </div>
        </AppLayout>
    );
}
