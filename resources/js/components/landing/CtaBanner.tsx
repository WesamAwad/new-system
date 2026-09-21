import { register } from '@/routes';
import { Link } from '@inertiajs/react';

export default function CtaBanner() {
    return (
        <section id="track" className="bg-brand-ink">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-12 text-center sm:px-6 lg:px-8">
                <h2 className="max-w-2xl text-2xl font-bold text-white sm:text-3xl">
                    جهازك معطل؟ فنيونا جاهزون للمساعدة الآن
                </h2>
                <Link
                    href={register()}
                    className="bg-primary hover:bg-primary-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition"
                >
                    <span aria-hidden="true">🔧</span>
                    اطلب صيانة الآن
                </Link>
            </div>
        </section>
    );
}
