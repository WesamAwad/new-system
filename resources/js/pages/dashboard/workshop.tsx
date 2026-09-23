import { update } from '@/actions/App/Http/Controllers/WorkshopProfileController';
import {
    destroy as destroyService,
    store as storeService,
    update as updateService,
} from '@/actions/App/Http/Controllers/WorkshopServiceController';
import InputError from '@/components/input-error';
import DashboardLayout from '@/layouts/dashboard-layout';
import {
    dangerButtonClassName,
    fieldClassName,
    labelClassName,
    primaryButtonClassName,
    secondaryButtonClassName,
} from '@/lib/ui';
import type { Category, Workshop, WorkshopServiceItem } from '@/types';
import { Form, Head } from '@inertiajs/react';

type Props = {
    workshop: Pick<
        Workshop,
        'name' | 'bio' | 'city' | 'address' | 'is_available'
    > | null;
    services: WorkshopServiceItem[];
    availableCategories: Array<Pick<Category, 'id' | 'name' | 'slug'>>;
};

export default function DashboardWorkshop({
    workshop,
    services,
    availableCategories,
}: Props) {
    return (
        <DashboardLayout title="ورشتي">
            <Head title="ورشتي" />

            {!workshop && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    لسا ما أنشأت ملف ورشتك — عبّي البيانات تحت لتظهر ورشتك بدليل
                    الورش المعتمدة.
                </div>
            )}

            <div className="border-border/40 max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
                <Form {...update.form()} className="space-y-4">
                    {({ errors, processing }) => (
                        <>
                            <div>
                                <label
                                    htmlFor="name"
                                    className={labelClassName}
                                >
                                    اسم الورشة
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    defaultValue={workshop?.name ?? ''}
                                    className={fieldClassName}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <label htmlFor="bio" className={labelClassName}>
                                    نبذة عن الورشة
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={4}
                                    defaultValue={workshop?.bio ?? ''}
                                    className={fieldClassName}
                                />
                                <InputError message={errors.bio} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="city"
                                        className={labelClassName}
                                    >
                                        المدينة
                                    </label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        required
                                        defaultValue={workshop?.city ?? ''}
                                        className={fieldClassName}
                                    />
                                    <InputError message={errors.city} />
                                </div>

                                <div>
                                    <label
                                        htmlFor="address"
                                        className={labelClassName}
                                    >
                                        العنوان التفصيلي
                                    </label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        required
                                        defaultValue={workshop?.address ?? ''}
                                        className={fieldClassName}
                                    />
                                    <InputError message={errors.address} />
                                </div>
                            </div>

                            <label className="text-foreground flex items-center gap-2 text-sm">
                                <input
                                    type="hidden"
                                    name="is_available"
                                    value="0"
                                />
                                <input
                                    type="checkbox"
                                    name="is_available"
                                    value="1"
                                    defaultChecked={
                                        workshop?.is_available ?? true
                                    }
                                    className="border-border text-primary rounded"
                                />
                                الورشة متاحة الآن لاستقبال طلبات جديدة
                            </label>
                            <InputError message={errors.is_available} />

                            <button
                                type="submit"
                                disabled={processing}
                                className={primaryButtonClassName}
                            >
                                {processing ? 'جارِ الحفظ…' : 'حفظ البيانات'}
                            </button>
                        </>
                    )}
                </Form>
            </div>

            <div className="border-border/40 mt-6 max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-heading mb-4 text-base font-bold">
                    الخدمات المقدمة والأسعار
                </h2>

                {!workshop ? (
                    <p className="text-muted-foreground text-sm">
                        احفظ بيانات ورشتك أولاً قبل إضافة الخدمات.
                    </p>
                ) : (
                    <>
                        {services.length === 0 && (
                            <p className="text-muted-foreground mb-4 text-sm">
                                لم تضف أي خدمة بعد.
                            </p>
                        )}

                        {services.length > 0 && (
                            <ul className="space-y-3">
                                {services.map((service) => (
                                    <li
                                        key={service.id}
                                        className="border-border/40 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
                                    >
                                        <span className="text-foreground font-medium">
                                            {service.category?.name}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <Form
                                                {...updateService.form(
                                                    service.id,
                                                )}
                                                className="flex items-center gap-2"
                                            >
                                                {({ processing }) => (
                                                    <>
                                                        <input
                                                            type="number"
                                                            name="starting_price"
                                                            step="0.01"
                                                            min="0"
                                                            defaultValue={Number(
                                                                service.starting_price,
                                                            )}
                                                            className={`${fieldClassName} w-28`}
                                                        />
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                            className={
                                                                secondaryButtonClassName
                                                            }
                                                        >
                                                            حفظ
                                                        </button>
                                                    </>
                                                )}
                                            </Form>

                                            <Form
                                                {...destroyService.form(
                                                    service.id,
                                                )}
                                            >
                                                {({ processing }) => (
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className={
                                                            dangerButtonClassName
                                                        }
                                                        onClick={(event) => {
                                                            if (
                                                                !confirm(
                                                                    'هل تريد حذف هذه الخدمة؟',
                                                                )
                                                            ) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        حذف
                                                    </button>
                                                )}
                                            </Form>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {availableCategories.length > 0 && (
                            <Form
                                {...storeService.form()}
                                className="border-border/40 mt-5 flex flex-wrap items-end gap-3 border-t pt-5"
                                resetOnSuccess
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <div className="min-w-40 flex-1">
                                            <label
                                                htmlFor="category_id"
                                                className={labelClassName}
                                            >
                                                خدمة جديدة
                                            </label>
                                            <select
                                                id="category_id"
                                                name="category_id"
                                                required
                                                defaultValue=""
                                                className={fieldClassName}
                                            >
                                                <option value="" disabled>
                                                    اختر الخدمة
                                                </option>
                                                {availableCategories.map(
                                                    (category) => (
                                                        <option
                                                            key={category.id}
                                                            value={category.id}
                                                        >
                                                            {category.name}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                            <InputError
                                                message={errors.category_id}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="starting_price"
                                                className={labelClassName}
                                            >
                                                السعر يبدأ من
                                            </label>
                                            <input
                                                id="starting_price"
                                                name="starting_price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                required
                                                className={`${fieldClassName} w-32`}
                                            />
                                            <InputError
                                                message={errors.starting_price}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={primaryButtonClassName}
                                        >
                                            {processing
                                                ? 'جارِ الإضافة…'
                                                : 'إضافة'}
                                        </button>
                                    </>
                                )}
                            </Form>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
