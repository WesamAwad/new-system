import { store } from '@/actions/App/Http/Controllers/TicketController';
import { show as showWorkshop } from '@/actions/App/Http/Controllers/WorkshopController';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import InputError from '@/components/input-error';
import { RatingStars } from '@/components/rating-stars';
import { workshopAvatarUrl } from '@/lib/avatar';
import {
    fieldClassName,
    labelClassName,
    primaryButtonClassName,
} from '@/lib/ui';
import type { Workshop } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Props = {
    workshop: Workshop;
};

const priorities: Array<{ value: string; label: string }> = [
    { value: 'low', label: 'منخفضة' },
    { value: 'medium', label: 'متوسطة' },
    { value: 'high', label: 'عالية' },
    { value: 'emergency', label: 'طارئة' },
];

export default function TicketsCreate({ workshop }: Props) {
    const { auth, flash } = usePage().props;
    const services = workshop.services ?? [];

    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        services[0]?.category_id ?? null,
    );

    const selectedService =
        services.find(
            (service) => service.category_id === selectedCategoryId,
        ) ?? null;

    return (
        <>
            <Head title="طلب صيانة جديد" />

            <div dir="rtl" className="bg-muted text-foreground min-h-screen">
                <Header />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={showWorkshop(workshop.id)}
                            className="text-accent text-sm font-medium hover:underline"
                        >
                            ← رجوع لصفحة الورشة
                        </Link>
                    </div>

                    {flash.success && (
                        <div
                            className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                            role="status"
                        >
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div
                            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                            role="alert"
                        >
                            {flash.error}
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <section className="border-border/40 rounded-2xl border bg-white p-6 shadow-sm">
                                <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold">
                                    طلب موجه مباشرة
                                </span>

                                <div className="mt-3 flex items-center gap-4">
                                    <img
                                        src={
                                            workshop.logo ??
                                            workshopAvatarUrl(workshop.name)
                                        }
                                        alt={workshop.name}
                                        className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                                    />
                                    <div className="min-w-0">
                                        <h1 className="text-heading truncate text-lg font-bold">
                                            {workshop.name}
                                        </h1>
                                        <p className="text-muted-foreground mt-0.5 text-sm">
                                            {workshop.city} — {workshop.address}
                                        </p>
                                        <div className="mt-1">
                                            <RatingStars
                                                rating={workshop.rating}
                                                reviewsCount={
                                                    workshop.reviews_count
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="border-border/40 rounded-2xl border bg-white p-6 shadow-sm">
                                <h2 className="text-heading mb-4 text-lg font-bold">
                                    تفاصيل طلب الصيانة
                                </h2>

                                {services.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">
                                        هذه الورشة لم تضف خدماتها بعد، الرجاء
                                        اختيار ورشة أخرى.
                                    </p>
                                ) : (
                                    <Form
                                        {...store.form()}
                                        className="space-y-4"
                                    >
                                        {({ errors, processing }) => (
                                            <>
                                                <input
                                                    type="hidden"
                                                    name="workshop_id"
                                                    value={workshop.id}
                                                />

                                                <div>
                                                    <label
                                                        htmlFor="category_id"
                                                        className={
                                                            labelClassName
                                                        }
                                                    >
                                                        الخدمة المطلوبة
                                                    </label>
                                                    <select
                                                        id="category_id"
                                                        name="category_id"
                                                        required
                                                        className={
                                                            fieldClassName
                                                        }
                                                        defaultValue={
                                                            selectedCategoryId ??
                                                            ''
                                                        }
                                                        onChange={(event) =>
                                                            setSelectedCategoryId(
                                                                Number(
                                                                    event.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        {services.map(
                                                            (service) => (
                                                                <option
                                                                    key={
                                                                        service.id
                                                                    }
                                                                    value={
                                                                        service.category_id
                                                                    }
                                                                >
                                                                    {
                                                                        service
                                                                            .category
                                                                            ?.name
                                                                    }{' '}
                                                                    — يبدأ من{' '}
                                                                    {Number(
                                                                        service.starting_price,
                                                                    ).toFixed(
                                                                        0,
                                                                    )}{' '}
                                                                    ₪
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    <InputError
                                                        message={
                                                            errors.category_id
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="title"
                                                        className={
                                                            labelClassName
                                                        }
                                                    >
                                                        عنوان الطلب
                                                    </label>
                                                    <input
                                                        id="title"
                                                        name="title"
                                                        type="text"
                                                        required
                                                        maxLength={255}
                                                        placeholder="مثال: الشاشة مكسورة ولا تستجيب للمس"
                                                        className={
                                                            fieldClassName
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.title}
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="description"
                                                        className={
                                                            labelClassName
                                                        }
                                                    >
                                                        تفاصيل المشكلة
                                                    </label>
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        required
                                                        rows={5}
                                                        placeholder="اشرح المشكلة بالتفصيل ليتمكن الفني من التحضير المسبق"
                                                        className={
                                                            fieldClassName
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.description
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <label
                                                            htmlFor="address"
                                                            className={
                                                                labelClassName
                                                            }
                                                        >
                                                            العنوان
                                                        </label>
                                                        <input
                                                            id="address"
                                                            name="address"
                                                            type="text"
                                                            required
                                                            defaultValue={
                                                                auth.user
                                                                    ?.address ??
                                                                ''
                                                            }
                                                            className={
                                                                fieldClassName
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.address
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor="phone"
                                                            className={
                                                                labelClassName
                                                            }
                                                        >
                                                            رقم التواصل
                                                        </label>
                                                        <input
                                                            id="phone"
                                                            type="text"
                                                            readOnly
                                                            value={
                                                                auth.user
                                                                    ?.phone ??
                                                                'غير مسجل في ملفك الشخصي'
                                                            }
                                                            className={`${fieldClassName} bg-muted text-muted-foreground cursor-not-allowed`}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="priority"
                                                        className={
                                                            labelClassName
                                                        }
                                                    >
                                                        أولوية الطلب
                                                    </label>
                                                    <select
                                                        id="priority"
                                                        name="priority"
                                                        required
                                                        defaultValue="medium"
                                                        className={
                                                            fieldClassName
                                                        }
                                                    >
                                                        {priorities.map(
                                                            (priority) => (
                                                                <option
                                                                    key={
                                                                        priority.value
                                                                    }
                                                                    value={
                                                                        priority.value
                                                                    }
                                                                >
                                                                    {
                                                                        priority.label
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    <InputError
                                                        message={
                                                            errors.priority
                                                        }
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className={`${primaryButtonClassName} w-full sm:w-auto`}
                                                >
                                                    {processing
                                                        ? 'جارِ الإرسال…'
                                                        : 'إرسال طلب الصيانة'}
                                                </button>
                                            </>
                                        )}
                                    </Form>
                                )}
                            </section>
                        </div>

                        <aside className="lg:col-span-1">
                            <div className="border-border/40 sticky top-24 rounded-2xl border bg-white p-6 shadow-sm">
                                <h2 className="text-heading text-sm font-bold">
                                    ملخص الطلب
                                </h2>

                                <dl className="mt-4 space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-muted-foreground">
                                            الورشة
                                        </dt>
                                        <dd className="text-foreground font-medium">
                                            {workshop.name}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-muted-foreground">
                                            الخدمة
                                        </dt>
                                        <dd className="text-foreground font-medium">
                                            {selectedService?.category?.name ??
                                                '—'}
                                        </dd>
                                    </div>
                                    <div className="border-border/40 flex items-center justify-between border-t pt-3">
                                        <dt className="text-muted-foreground">
                                            السعر التقديري
                                        </dt>
                                        <dd className="text-primary text-base font-bold">
                                            {selectedService
                                                ? `يبدأ من ${Number(
                                                      selectedService.starting_price,
                                                  ).toFixed(0)} ₪`
                                                : '—'}
                                        </dd>
                                    </div>
                                </dl>

                                <p className="text-muted-foreground mt-4 text-xs">
                                    السعر النهائي يُحدد بعد معاينة الفني للجهاز،
                                    وسيتم التواصل معك لتأكيد التفاصيل.
                                </p>
                            </div>
                        </aside>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
