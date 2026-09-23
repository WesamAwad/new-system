import {
    index as ticketsIndex,
    update,
} from '@/actions/App/Http/Controllers/TicketController';
import { store as storeReview } from '@/actions/App/Http/Controllers/TicketReviewController';
import { store as storeUpdate } from '@/actions/App/Http/Controllers/TicketUpdateController';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import InputError from '@/components/input-error';
import { RatingStars } from '@/components/rating-stars';
import { PriorityLabel, StatusBadge } from '@/components/ticket-badges';
import DashboardLayout from '@/layouts/dashboard-layout';
import { workshopAvatarUrl } from '@/lib/avatar';
import {
    dangerButtonClassName,
    fieldClassName,
    labelClassName,
    primaryButtonClassName,
    secondaryButtonClassName,
} from '@/lib/ui';
import type { Ticket, TicketStatus } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

type TechnicianOption = {
    id: number;
    name: string;
    email?: string;
};

type Props = {
    ticket: Ticket;
    technicians: TechnicianOption[];
};

const steps: Array<{ key: TicketStatus; label: string }> = [
    { key: 'pending', label: 'تم الإرسال' },
    { key: 'assigned', label: 'قيد المراجعة / تم التكليف' },
    { key: 'in_progress', label: 'قيد الصيانة' },
    { key: 'completed', label: 'مكتملة' },
];

function stepIndex(status: TicketStatus): number {
    return steps.findIndex((step) => step.key === status);
}

export default function TicketsShow({ ticket, technicians }: Props) {
    const user = usePage().props.auth.user;
    const [showEditForm, setShowEditForm] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isTechnicianRole = user?.role === 'technician';
    const isAssignedTechnician =
        isTechnicianRole && ticket.assigned_to === user.id;
    const isStaffWithAccess = isAdmin || isAssignedTechnician;
    const isOwner = user?.role === 'customer' && ticket.user_id === user.id;
    const isStaff = isAdmin || isTechnicianRole;

    const isCancelled = ticket.status === 'cancelled';
    const isEditableWindow =
        ticket.status === 'pending' || ticket.status === 'assigned';
    const currentStep = stepIndex(ticket.status);

    const workshop = ticket.assignee?.workshop ?? null;

    const backLink = (
        <div className="mb-6">
            <Link
                href={ticketsIndex()}
                className="text-accent text-sm font-medium hover:underline"
            >
                ← رجوع لطلباتي
            </Link>
        </div>
    );

    const content = (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
                <section className="border-border/40 rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <span className="bg-muted text-foreground rounded-full px-3 py-1 font-mono text-xs font-semibold">
                            {ticket.ticket_number}
                        </span>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={ticket.status} />
                            <PriorityLabel priority={ticket.priority} />
                        </div>
                    </div>

                    {isCancelled ? (
                        <div
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
                            role="status"
                        >
                            تم إلغاء هذا الطلب.
                        </div>
                    ) : (
                        <ol className="flex items-start gap-2">
                            {steps.map((step, index) => {
                                const done = index < currentStep;
                                const active = index === currentStep;

                                return (
                                    <li
                                        key={step.key}
                                        className="flex flex-1 items-center gap-2"
                                    >
                                        <div className="flex flex-col items-center gap-1 text-center">
                                            <span
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                    done || active
                                                        ? 'bg-primary text-white'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {done ? '✓' : index + 1}
                                            </span>
                                            <span
                                                className={`max-w-20 text-[11px] leading-tight ${
                                                    active
                                                        ? 'text-foreground font-semibold'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <span
                                                className={`h-0.5 flex-1 ${done ? 'bg-primary' : 'bg-muted'}`}
                                            />
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </section>

                <section className="border-border/40 rounded-2xl border bg-white p-6 shadow-sm">
                    <h1 className="text-heading text-lg font-bold">
                        {ticket.title}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-sm whitespace-pre-wrap">
                        {ticket.description}
                    </p>
                    <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="text-muted-foreground">الخدمة</dt>
                            <dd className="text-foreground font-medium">
                                {ticket.category?.name ?? '—'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">العنوان</dt>
                            <dd className="text-foreground font-medium">
                                {ticket.address}
                            </dd>
                        </div>
                    </dl>
                </section>

                {isOwner && ticket.status === 'completed' && (
                    <section className="border-border/40 rounded-2xl border bg-white p-6 shadow-sm">
                        <h2 className="text-heading mb-4 text-base font-bold">
                            تقييم تجربتك
                        </h2>

                        {ticket.review ? (
                            <div>
                                <RatingStars rating={ticket.review.rating} />
                                <p className="text-muted-foreground mt-2 text-sm">
                                    {ticket.review.comment}
                                </p>
                                <p className="text-muted-foreground/70 mt-2 text-xs">
                                    {ticket.review.is_approved
                                        ? 'تقييمك ظاهر بصفحة الورشة.'
                                        : 'شكراً لتقييمك! بانتظار موافقة الورشة قبل الظهور.'}
                                </p>
                            </div>
                        ) : (
                            <Form
                                {...storeReview.form(ticket.id)}
                                resetOnSuccess
                                className="space-y-3"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <div>
                                            <label
                                                htmlFor="rating"
                                                className={labelClassName}
                                            >
                                                تقييمك
                                            </label>
                                            <select
                                                id="rating"
                                                name="rating"
                                                required
                                                defaultValue="5"
                                                className={fieldClassName}
                                            >
                                                <option value="5">
                                                    ممتاز (5 نجوم)
                                                </option>
                                                <option value="4">
                                                    جيد جداً (4 نجوم)
                                                </option>
                                                <option value="3">
                                                    جيد (3 نجوم)
                                                </option>
                                                <option value="2">
                                                    مقبول (نجمتان)
                                                </option>
                                                <option value="1">
                                                    ضعيف (نجمة واحدة)
                                                </option>
                                            </select>
                                            <InputError
                                                message={errors.rating}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="comment"
                                                className={labelClassName}
                                            >
                                                تعليقك
                                            </label>
                                            <textarea
                                                id="comment"
                                                name="comment"
                                                required
                                                rows={3}
                                                placeholder="شاركنا تجربتك مع هذه الورشة"
                                                className={fieldClassName}
                                            />
                                            <InputError
                                                message={errors.comment}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={primaryButtonClassName}
                                        >
                                            {processing
                                                ? 'جارِ الإرسال…'
                                                : 'إرسال التقييم'}
                                        </button>
                                    </>
                                )}
                            </Form>
                        )}
                    </section>
                )}

                <section className="border-border/40 rounded-2xl border bg-white p-6 shadow-sm">
                    <h2 className="text-muted-foreground mb-4 text-sm font-bold tracking-wide uppercase">
                        سجل التحديثات
                    </h2>
                    <div className="space-y-4">
                        {(ticket.updates ?? []).length === 0 && (
                            <p className="text-muted-foreground text-sm">
                                لا توجد تحديثات بعد.
                            </p>
                        )}
                        {(ticket.updates ?? []).map((updateItem) => (
                            <div
                                key={updateItem.id}
                                className="border-border/40 bg-muted rounded-xl border px-4 py-3"
                            >
                                <div className="text-muted-foreground mb-1 flex flex-wrap items-center gap-2 text-xs">
                                    <span className="text-foreground font-medium">
                                        {updateItem.user?.name ?? 'مستخدم'}
                                    </span>
                                    <span>
                                        {new Date(
                                            updateItem.created_at,
                                        ).toLocaleString('ar-EG')}
                                    </span>
                                    {updateItem.is_internal && (
                                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">
                                            ملاحظة داخلية
                                        </span>
                                    )}
                                </div>
                                <p className="text-foreground text-sm">
                                    {updateItem.message}
                                </p>
                            </div>
                        ))}
                    </div>

                    <Form
                        {...storeUpdate.form(ticket.id)}
                        className="border-border/40 mt-6 space-y-3 border-t pt-4"
                        resetOnSuccess
                    >
                        {({ errors, processing }) => (
                            <>
                                <label
                                    htmlFor="message"
                                    className={labelClassName}
                                >
                                    إضافة تحديث
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={3}
                                    className={fieldClassName}
                                />
                                <InputError message={errors.message} />
                                {isStaff && (
                                    <label className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            name="is_internal"
                                            value="1"
                                            className="border-border text-primary rounded"
                                        />
                                        ملاحظة داخلية (غير مرئية للعميل)
                                    </label>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={primaryButtonClassName}
                                >
                                    {processing
                                        ? 'جارِ الإرسال…'
                                        : 'إرسال التحديث'}
                                </button>
                            </>
                        )}
                    </Form>
                </section>
            </div>

            <aside className="space-y-6">
                {ticket.assignee && !isAssignedTechnician && (
                    <div className="border-border/40 rounded-2xl border bg-white p-5 shadow-sm">
                        <h2 className="text-heading mb-3 text-sm font-bold">
                            الورشة المسؤولة
                        </h2>
                        <div className="flex items-center gap-3">
                            <img
                                src={
                                    workshop?.logo ??
                                    workshopAvatarUrl(
                                        workshop?.name ?? ticket.assignee.name,
                                    )
                                }
                                alt={workshop?.name ?? ticket.assignee.name}
                                className="h-12 w-12 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0">
                                <p className="text-foreground truncate font-semibold">
                                    {workshop?.name ?? ticket.assignee.name}
                                </p>
                                {workshop && (
                                    <p className="text-muted-foreground truncate text-xs">
                                        {workshop.city} — {workshop.address}
                                    </p>
                                )}
                            </div>
                        </div>
                        {ticket.assignee.phone && (
                            <a
                                href={`tel:${ticket.assignee.phone}`}
                                className={`${primaryButtonClassName} mt-4 w-full`}
                            >
                                تواصل مع الفني
                            </a>
                        )}
                    </div>
                )}

                {isAdmin && (
                    <div className="border-border/40 rounded-2xl border bg-white p-5 shadow-sm">
                        <h3 className="text-heading mb-3 text-sm font-bold">
                            تعيين فني
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
                                        defaultValue={ticket.assigned_to ?? ''}
                                        className={fieldClassName}
                                    >
                                        <option value="">غير معيّن</option>
                                        {technicians.map((technician) => (
                                            <option
                                                key={technician.id}
                                                value={technician.id}
                                            >
                                                {technician.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.assigned_to} />
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`${primaryButtonClassName} w-full`}
                                    >
                                        {processing
                                            ? 'جارِ الحفظ…'
                                            : 'حفظ الفني'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </div>
                )}

                {isStaffWithAccess && (
                    <div className="border-border/40 rounded-2xl border bg-white p-5 shadow-sm">
                        <h3 className="text-heading mb-3 text-sm font-bold">
                            تحديث الحالة
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
                                        className={fieldClassName}
                                    >
                                        <option value="pending">
                                            بانتظار المراجعة
                                        </option>
                                        <option value="assigned">
                                            تم التكليف
                                        </option>
                                        <option value="in_progress">
                                            قيد الصيانة
                                        </option>
                                        <option value="completed">
                                            مكتملة
                                        </option>
                                        <option value="cancelled">ملغاة</option>
                                    </select>
                                    <InputError message={errors.status} />
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`${primaryButtonClassName} w-full`}
                                    >
                                        {processing
                                            ? 'جارِ الحفظ…'
                                            : 'حفظ الحالة'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </div>
                )}

                {isOwner && (
                    <div className="border-border/40 rounded-2xl border bg-white p-5 shadow-sm">
                        <h3 className="text-heading mb-3 text-sm font-bold">
                            إجراءات الطلب
                        </h3>

                        {isEditableWindow ? (
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEditForm((open) => !open)
                                    }
                                    className={`${secondaryButtonClassName} w-full`}
                                >
                                    {showEditForm
                                        ? 'إخفاء تعديل التفاصيل'
                                        : 'تعديل تفاصيل الطلب'}
                                </button>

                                {showEditForm && (
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
                                                    className={fieldClassName}
                                                />
                                                <InputError
                                                    message={errors.title}
                                                />
                                                <textarea
                                                    name="description"
                                                    defaultValue={
                                                        ticket.description
                                                    }
                                                    rows={4}
                                                    className={fieldClassName}
                                                />
                                                <InputError
                                                    message={errors.description}
                                                />
                                                <input
                                                    name="address"
                                                    defaultValue={
                                                        ticket.address
                                                    }
                                                    className={fieldClassName}
                                                />
                                                <InputError
                                                    message={errors.address}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className={`${primaryButtonClassName} w-full`}
                                                >
                                                    {processing
                                                        ? 'جارِ الحفظ…'
                                                        : 'حفظ التعديلات'}
                                                </button>
                                            </>
                                        )}
                                    </Form>
                                )}

                                <Form
                                    action={update.url(ticket.id)}
                                    method="patch"
                                >
                                    {({ processing }) => (
                                        <>
                                            <input
                                                type="hidden"
                                                name="status"
                                                value="cancelled"
                                            />
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className={`${dangerButtonClassName} w-full`}
                                                onClick={(event) => {
                                                    if (
                                                        !confirm(
                                                            'هل تريد بالتأكيد إلغاء هذا الطلب؟',
                                                        )
                                                    ) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                            >
                                                {processing
                                                    ? 'جارِ الإلغاء…'
                                                    : 'إلغاء الطلب'}
                                            </button>
                                        </>
                                    )}
                                </Form>
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                لم يعد بالإمكان تعديل أو إلغاء هذا الطلب بعد بدء
                                العمل عليه.
                            </p>
                        )}
                    </div>
                )}
            </aside>
        </div>
    );

    if (isTechnicianRole) {
        return (
            <DashboardLayout title={ticket.ticket_number}>
                <Head title={ticket.ticket_number} />
                {backLink}
                {content}
            </DashboardLayout>
        );
    }

    return (
        <>
            <Head title={ticket.ticket_number} />

            <div dir="rtl" className="bg-muted text-foreground min-h-screen">
                <Header />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                    {backLink}
                    {content}
                </main>

                <Footer />
            </div>
        </>
    );
}
