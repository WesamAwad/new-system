import { store } from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import InputError from '@/components/input-error';
import { home, login } from '@/routes';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState, type FormEvent, type ReactNode } from 'react';

type RegisterRole = 'customer' | 'technician';

type RegisterForm = {
    name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    password: string;
    password_confirmation: string;
    role: RegisterRole;
    terms: boolean;
};

const cities = [
    'الرياض (متاح التوصيل الفوري)',
    'جدة',
    'الدمام',
    'مكة المكرمة',
    'المدينة المنورة',
] as const;

const inputClassName =
    'h-11 w-full rounded-lg border-0 bg-surface py-3 pe-3.5 text-sm text-foreground outline-none placeholder:text-subtle focus:ring-2 focus:ring-primary/30';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm<RegisterForm>({
        name: '',
        email: '',
        phone: '',
        city: cities[0],
        address: '',
        password: '',
        password_confirmation: '',
        role: 'customer',
        terms: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const passwordStrength = useMemo(() => {
        const value = data.password;
        let score = 0;

        if (value.length >= 8) {
            score += 1;
        }
        if (/[A-Z]/.test(value) && /[a-z]/.test(value)) {
            score += 1;
        }
        if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) {
            score += 1;
        }

        return score;
    }, [data.password]);

    const strengthLabel =
        passwordStrength === 0
            ? 'غير محدد'
            : passwordStrength === 1
              ? 'ضعيف'
              : passwordStrength === 2
                ? 'متوسط'
                : 'قوي';

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        post(store.url());
    }

    return (
        <>
            <Head title="إنشاء حساب جديد" />

            <div className="bg-muted min-h-screen px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-295 flex-col gap-6">
                    <nav className="flex items-center justify-end gap-2 text-xs">
                        <span className="text-accent">إنشاء حساب جديد</span>
                        <span className="text-subtle">›</span>
                        <Link
                            href={home()}
                            className="text-muted-foreground hover:underline"
                        >
                            الرئيسية
                        </Link>
                    </nav>

                    <div className="grid items-start gap-8 lg:grid-cols-12">
                        <aside className="order-2 lg:order-1 lg:col-span-5">
                            <div className="relative flex min-h-105 flex-col justify-end overflow-hidden rounded-xl p-8 shadow-sm sm:min-h-145">
                                <img
                                    src="/images/auth/register-hero.jpg"
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
                                        صيانة فورية وموثوقة... جهازك يعود
                                        كالجديد أمام عينيك
                                    </h2>

                                    <p className="text-on-brand/90 text-sm leading-relaxed">
                                        نصلك أينما كنت مع فنيين معتمدين وقطع
                                        غيار أصلية بضمان حقيقي يصل إلى 180 يوماً.
                                    </p>

                                    <div className="text-on-brand flex flex-wrap items-center justify-end gap-6 border-t border-white/10 pt-3 text-xs">
                                        <div className="inline-flex items-center gap-1.5">
                                            <span>ضمان معتمد 180 يوم</span>
                                            <span aria-hidden="true">🛡</span>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5">
                                            <span>إصلاح فوري في 35 دقيقة</span>
                                            <span aria-hidden="true">⏱</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <section className="order-1 rounded-xl bg-white p-6 shadow-sm sm:p-10 lg:order-2 lg:col-span-7">
                            <div className="mb-6 space-y-1 text-right">
                                <div className="bg-secondary text-foreground mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs">
                                    <span>انضم لمنظومة سويفت فيكس الذكية</span>
                                    <span className="bg-primary size-2 rounded-full" />
                                </div>
                                <h1 className="text-heading text-[1.75rem] font-bold tracking-tight">
                                    إنشاء حساب جديد
                                </h1>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    اختر نوع الحساب وابدأ طلب وإدارة خدمات
                                    الصيانة الفورية بكل سهولة وموثوقية.
                                </p>
                            </div>

                            <div className="mb-6 space-y-2 text-right">
                                <p className="text-foreground text-xs">
                                    نوع الحساب
                                </p>
                                <div className="bg-secondary grid grid-cols-2 gap-1.5 rounded-xl p-1.5">
                                    <RoleOption
                                        selected={data.role === 'technician'}
                                        label="فني صيانة معتمد (شريك)"
                                        onClick={() =>
                                            setData('role', 'technician')
                                        }
                                    />
                                    <RoleOption
                                        selected={data.role === 'customer'}
                                        label="عميل (أفراد وشركات)"
                                        onClick={() =>
                                            setData('role', 'customer')
                                        }
                                    />
                                </div>
                                <InputError
                                    message={errors.role}
                                    className="text-right"
                                />
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
                                    أو التسجيل بالبيانات الشخصية
                                </span>
                            </div>

                            <form
                                onSubmit={submit}
                                className="space-y-4"
                                noValidate
                            >
                                <Field
                                    id="name"
                                    label="الاسم الكامل"
                                    error={errors.name}
                                >
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                        required
                                        autoComplete="name"
                                        placeholder="مثال: خالد عبد العزيز السبيعي"
                                        className={`${inputClassName} ps-10`}
                                    />
                                </Field>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        id="email"
                                        label="البريد الإلكتروني"
                                        error={errors.email}
                                    >
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(event) =>
                                                setData(
                                                    'email',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                            autoComplete="username"
                                            placeholder="user@example.com"
                                            className={`${inputClassName} ps-10`}
                                        />
                                    </Field>

                                    <Field
                                        id="phone"
                                        label="رقم الجوال"
                                        error={errors.phone}
                                    >
                                        <div className="bg-surface flex overflow-hidden rounded-lg">
                                            <div className="border-border/40 text-muted-foreground flex items-center gap-1 border-e px-3 text-xs">
                                                <span>+966</span>
                                            </div>
                                            <input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                value={data.phone}
                                                onChange={(event) =>
                                                    setData(
                                                        'phone',
                                                        event.target.value,
                                                    )
                                                }
                                                required
                                                autoComplete="tel"
                                                placeholder="5X XXX XXXX"
                                                className="text-foreground placeholder:text-subtle h-11 w-full border-0 bg-transparent px-3 text-sm outline-none focus:ring-0"
                                            />
                                        </div>
                                    </Field>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        id="city"
                                        label="المدينة"
                                        error={errors.city}
                                    >
                                        <select
                                            id="city"
                                            name="city"
                                            value={data.city}
                                            onChange={(event) =>
                                                setData(
                                                    'city',
                                                    event.target.value,
                                                )
                                            }
                                            className={`${inputClassName} ps-3`}
                                        >
                                            {cities.map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>

                                    <Field
                                        id="address"
                                        label="الحي السكني"
                                        error={errors.address}
                                    >
                                        <input
                                            id="address"
                                            type="text"
                                            name="address"
                                            value={data.address}
                                            onChange={(event) =>
                                                setData(
                                                    'address',
                                                    event.target.value,
                                                )
                                            }
                                            autoComplete="street-address"
                                            placeholder="مثال: النرجس، الياسمين"
                                            className={`${inputClassName} ps-10`}
                                        />
                                    </Field>
                                </div>

                                <div className="space-y-1.5 text-right">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-subtle text-xs">
                                            مستوى القوة: {strengthLabel}
                                        </span>
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
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name="password"
                                            value={data.password}
                                            onChange={(event) =>
                                                setData(
                                                    'password',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                            autoComplete="new-password"
                                            placeholder="••••••••••••"
                                            className={`${inputClassName} ps-10`}
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
                                                    ? 'إخفاء كلمة المرور'
                                                    : 'إظهار كلمة المرور'
                                            }
                                        >
                                            👁
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                                        {[1, 2, 3].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 rounded-full ${
                                                    passwordStrength >= level
                                                        ? 'bg-primary'
                                                        : 'bg-secondary'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <InputError
                                        message={errors.password}
                                        className="text-right"
                                    />
                                </div>

                                <Field
                                    id="password_confirmation"
                                    label="تأكيد كلمة المرور"
                                    error={errors.password_confirmation}
                                >
                                    <input
                                        id="password_confirmation"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(event) =>
                                            setData(
                                                'password_confirmation',
                                                event.target.value,
                                            )
                                        }
                                        required
                                        autoComplete="new-password"
                                        placeholder="••••••••••••"
                                        className={`${inputClassName} ps-10`}
                                    />
                                </Field>

                                <label className="text-muted-foreground flex items-start justify-end gap-2 text-right text-xs leading-relaxed">
                                    <span>
                                        أوافق بالكامل على{' '}
                                        <span className="text-accent">
                                            شروط الاستخدام
                                        </span>{' '}
                                        و{' '}
                                        <span className="text-accent">
                                            سياسة الخصوصية
                                        </span>{' '}
                                        الخاصة بمنصة سويفت فيكس الرقمية.
                                    </span>
                                    <input
                                        type="checkbox"
                                        name="terms"
                                        checked={data.terms}
                                        onChange={(event) =>
                                            setData(
                                                'terms',
                                                event.target.checked,
                                            )
                                        }
                                        className="text-primary accent-primary focus:ring-primary mt-0.5 size-4 shrink-0 rounded-[2.5px] border-0"
                                    />
                                </label>
                                <InputError
                                    message={errors.terms}
                                    className="text-right"
                                />

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary-hover flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            <span>جاري إنشاء الحساب…</span>
                                        </>
                                    ) : (
                                        <>
                                            <span aria-hidden="true">←</span>
                                            <span>إنشاء الحساب والمتابعة</span>
                                        </>
                                    )}
                                </button>

                                <p className="text-muted-foreground flex items-center justify-center gap-1.5 pt-1 text-center text-xs">
                                    <span>
                                        بياناتك محمية ومشفرة وفق معايير الأمن
                                        السيبراني ولا نشاركها إطلاقاً.
                                    </span>
                                    <span
                                        className="text-success"
                                        aria-hidden="true"
                                    >
                                        🔒
                                    </span>
                                </p>
                            </form>

                            <div className="bg-surface mt-6 rounded-xl px-3 pt-5 pb-3 text-center text-sm">
                                <span className="text-muted-foreground">
                                    لديك حساب بالفعل؟{' '}
                                </span>
                                <Link
                                    href={login()}
                                    className="text-accent inline-flex items-center gap-1 font-medium hover:underline"
                                >
                                    <span aria-hidden="true">←</span>
                                    <span>تسجيل الدخول</span>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

function Field({
    id,
    label,
    error,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-1.5 text-right">
            <label htmlFor={id} className="text-foreground block text-xs">
                {label}
            </label>
            <div className="relative">{children}</div>
            <InputError message={error} className="text-right" />
        </div>
    );
}

function RoleOption({
    selected,
    label,
    onClick,
}: {
    selected: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-lg px-3 py-3 text-sm transition ${
                selected
                    ? 'text-foreground bg-white shadow-sm'
                    : 'text-muted-foreground hover:bg-white/60'
            }`}
        >
            {label}
        </button>
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
