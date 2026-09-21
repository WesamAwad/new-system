import { store } from "@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController";
import InputError from "@/components/input-error";
import { home, register } from "@/routes";
import { request as passwordRequest } from "@/routes/password";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, type FormEvent } from "react";

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function Login() {
    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        email: "",
        password: "",
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        post(store.url());
    }

    return (
        <>
            <Head title="تسجيل الدخول" />

            <div className="bg-muted min-h-screen px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-295 flex-col gap-6">
                    <header className="flex items-center justify-between gap-4">
                        <Link
                            href={home()}
                            className="text-muted-foreground inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition hover:bg-white"
                        >
                            <span>العودة للرئيسية</span>
                            <svg
                                aria-hidden="true"
                                className="size-3"
                                fill="none"
                                viewBox="0 0 12 12"
                            >
                                <path
                                    d="M7.5 2.5 4 6l3.5 3.5"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                />
                            </svg>
                        </Link>

                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2"
                        >
                            <img
                                src="/images/auth/swiftfix-logo.png"
                                alt="SwiftFix"
                                className="h-16 w-32 object-contain"
                            />
                        </Link>
                    </header>

                    <div className="grid items-start gap-8 lg:grid-cols-12">
                        <aside className="order-2 lg:order-1 lg:col-span-5">
                            <div className="relative flex min-h-105 flex-col justify-end overflow-hidden rounded-xl p-8 shadow-sm sm:min-h-145">
                                <img
                                    src="/images/auth/login-hero.jpg"
                                    alt=""
                                    className="absolute inset-0 size-full object-cover"
                                />
                                <div className="from-brand-ink via-brand-ink/75 absolute inset-0 bg-linear-to-t to-transparent" />

                                <div className="relative space-y-4 text-right text-white">
                                    <div className="border-primary/30 bg-primary/20 text-brand-soft ms-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs backdrop-blur-sm">
                                        <span>
                                            المنظومة الأذكى لصيانة الأجهزة
                                        </span>
                                        <span aria-hidden="true">✓</span>
                                    </div>

                                    <h2 className="text-[1.65rem] leading-tight font-bold tracking-tight sm:text-[1.75rem]">
                                        أهلاً بعودتك... صيانة أجهزتك بضغطة زر
                                        واحدة
                                    </h2>

                                    <p className="text-on-brand/90 text-sm leading-relaxed">
                                        تابع حالة طلبك فورياً، تواصل مع فنيك
                                        المعتمد، واستمتع بضمان سويفت فيكس
                                        الحقيقي حتى 180 يوماً.
                                    </p>

                                    <div className="text-on-brand flex flex-wrap items-center justify-end gap-6 border-t border-white/10 pt-3 text-xs">
                                        <div className="inline-flex items-center gap-1.5">
                                            <span>دعم فني فوري 24/7</span>
                                            <span aria-hidden="true">🎧</span>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5">
                                            <span>+45,000 عميل يثقون بنا</span>
                                            <span aria-hidden="true">✓</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <section className="order-1 rounded-xl bg-white p-6 shadow-sm sm:p-10 lg:order-2 lg:col-span-7">
                            <div className="mb-6 space-y-1 text-right">
                                <div className="bg-secondary text-foreground mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs">
                                    <span>مرحباً بعودتك إلى سويفت فيكس</span>
                                    <span className="bg-primary size-2 rounded-full" />
                                </div>
                                <h1 className="text-heading text-[1.75rem] font-bold tracking-tight">
                                    تسجيل الدخول إلى حسابك
                                </h1>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    سجّل دخولك للوصول الفوري إلى طلبات الصيانة
                                    ومتابعة الفنيين وإدارة ضماناتك.
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled
                                className="border-border/40 text-foreground mb-6 flex w-full items-center justify-center gap-2.5 rounded-xl border bg-white px-4 py-3 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <span>المتابعة باستخدام Google</span>
                                <GoogleIcon />
                            </button>

                            <div className="relative mb-6 flex items-center justify-center">
                                <div className="bg-secondary h-px w-full" />
                                <span className="text-subtle absolute bg-white px-4 text-xs">
                                    أو عبر البريد الإلكتروني / رقم الجوال
                                </span>
                            </div>

                            <form
                                onSubmit={submit}
                                className="space-y-4"
                                noValidate
                            >
                                <div className="space-y-1.5 text-right">
                                    <label
                                        htmlFor="email"
                                        className="text-foreground block text-xs"
                                    >
                                        رقم الجوال أو البريد الإلكتروني
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(event) =>
                                                setData(
                                                    "email",
                                                    event.target.value,
                                                )
                                            }
                                            required
                                            autoComplete="username"
                                            placeholder="05X XXX XXXX / name@example.com"
                                            className="bg-surface text-foreground placeholder:text-subtle focus:ring-primary/30 h-11 w-full rounded-lg border-0 py-3 ps-10 pe-3.5 text-sm outline-none focus:ring-2"
                                        />
                                        <span className="text-subtle pointer-events-none absolute inset-s-3.5 top-1/2 -translate-y-1/2">
                                            <MailIcon />
                                        </span>
                                    </div>
                                    <InputError
                                        message={errors.email}
                                        className="text-right"
                                    />
                                </div>

                                <div className="space-y-1.5 text-right">
                                    <div className="flex items-center justify-between gap-3">
                                        <Link
                                            href={passwordRequest()}
                                            className="text-accent text-xs hover:underline"
                                        >
                                            نسيت كلمة المرور؟
                                        </Link>
                                        <label
                                            htmlFor="password"
                                            className="text-foreground block text-xs"
                                        >
                                            كلمة المرور
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={data.password}
                                            onChange={(event) =>
                                                setData(
                                                    "password",
                                                    event.target.value,
                                                )
                                            }
                                            required
                                            autoComplete="current-password"
                                            placeholder="••••••••••••"
                                            className="bg-surface text-foreground placeholder:text-subtle focus:ring-primary/30 h-11 w-full rounded-lg border-0 py-3 ps-10 pe-3.5 text-sm outline-none focus:ring-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (current) => !current,
                                                )
                                            }
                                            className="text-subtle hover:text-foreground absolute inset-s-3 top-1/2 -translate-y-1/2"
                                            aria-label={
                                                showPassword
                                                    ? "إخفاء كلمة المرور"
                                                    : "إظهار كلمة المرور"
                                            }
                                        >
                                            <EyeIcon />
                                        </button>
                                    </div>
                                    <InputError
                                        message={errors.password}
                                        className="text-right"
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-3 pt-1 pb-1">
                                    <button
                                        type="button"
                                        disabled
                                        className="text-muted-foreground inline-flex items-center gap-1 text-xs disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        <span className="text-primary">⚡</span>
                                        <span>دخول برمز التحقق (OTP)</span>
                                    </button>

                                    <label className="text-muted-foreground inline-flex cursor-pointer items-center gap-2 text-xs">
                                        <span>تذكرني على هذا الجهاز</span>
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(event) =>
                                                setData(
                                                    "remember",
                                                    event.target.checked,
                                                )
                                            }
                                            className="text-primary accent-primary focus:ring-primary size-4 rounded-[2.5px] border-0"
                                        />
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary-hover flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            <span>جاري تسجيل الدخول…</span>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowIcon />
                                            <span>تسجيل الدخول</span>
                                        </>
                                    )}
                                </button>

                                <p className="text-muted-foreground flex items-center justify-center gap-1.5 pt-1 text-center text-xs">
                                    <span>
                                        بياناتك محمية ومشفرة وفق أعلى معايير
                                        أمان الهيئة الوطنية للأمن السيبراني.
                                    </span>
                                    <LockIcon />
                                </p>
                            </form>

                            <div className="bg-surface mt-6 rounded-xl px-3 pt-5 pb-3 text-center text-sm">
                                <span className="text-muted-foreground">
                                    ليس لديك حساب بعد؟{" "}
                                </span>
                                <Link
                                    href={register()}
                                    className="text-accent inline-flex items-center gap-1 font-medium hover:underline"
                                >
                                    <ArrowIcon className="text-accent size-2.5" />
                                    <span>إنشاء حساب عميل جديد مجاناً</span>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

function GoogleIcon() {
    return (
        <svg aria-hidden="true" className="size-4" viewBox="0 0 16 16">
            <path
                className="fill-google-blue"
                d="M15.68 8.18c0-.55-.05-1.08-.14-1.59H8v3.01h4.3a3.68 3.68 0 0 1-1.6 2.41v2h2.59c1.51-1.39 2.39-3.44 2.39-5.83Z"
            />
            <path
                className="fill-google-green"
                d="M8 16c2.16 0 3.97-.72 5.29-1.95l-2.59-2a4.66 4.66 0 0 1-6.96-2.46H.99v2.07A8 8 0 0 0 8 16Z"
            />
            <path
                className="fill-google-yellow"
                d="M3.74 9.59A4.8 4.8 0 0 1 3.49 8c0-.55.1-1.09.25-1.59V4.34H.99A8 8 0 0 0 0 8c0 1.29.31 2.51.99 3.66l2.75-2.07Z"
            />
            <path
                className="fill-google-red"
                d="M8 3.16c1.18 0 2.23.4 3.06 1.2l2.3-2.3A7.94 7.94 0 0 0 8 0 8 8 0 0 0 .99 4.34l2.75 2.07A4.76 4.76 0 0 1 8 3.16Z"
            />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg
            aria-hidden="true"
            className="size-4"
            fill="none"
            viewBox="0 0 17 14"
        >
            <path
                d="M1.5 2.5h14v9H1.5v-9Zm0 0 7 5 7-5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.3"
            />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-3 w-4.5"
            fill="none"
            viewBox="0 0 18 13"
        >
            <path
                d="M1 6.5S3.5 1.5 9 1.5s8 5 8 5-2.5 5-8 5-8-5-8-5Z"
                stroke="currentColor"
                strokeWidth="1.3"
            />
            <circle
                cx="9"
                cy="6.5"
                r="2"
                stroke="currentColor"
                strokeWidth="1.3"
            />
        </svg>
    );
}

function ArrowIcon({
    className = "size-3.5 text-white",
}: {
    className?: string;
}) {
    return (
        <svg
            aria-hidden="true"
            className={className}
            fill="none"
            viewBox="0 0 14 14"
        >
            <path
                d="M8.5 3.5 12 7l-3.5 3.5M12 7H2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            aria-hidden="true"
            className="text-success h-3.5 w-2.5"
            fill="none"
            viewBox="0 0 11 14"
        >
            <rect
                x="1"
                y="6"
                width="9"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
            />
            <path
                d="M3 6V4a2.5 2.5 0 0 1 5 0v2"
                stroke="currentColor"
                strokeWidth="1.2"
            />
        </svg>
    );
}
