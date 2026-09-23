import DashboardLayout from '@/layouts/dashboard-layout';
import type { TicketStatus } from '@/types';
import { Head } from '@inertiajs/react';

type Stats = Record<TicketStatus, number>;

type Props = {
    stats: Stats;
};

const cards: Array<{ key: TicketStatus; label: string }> = [
    { key: 'pending', label: 'قيد الإرسال' },
    { key: 'assigned', label: 'تم التكليف' },
    { key: 'in_progress', label: 'قيد الصيانة' },
    { key: 'completed', label: 'مكتملة' },
    { key: 'cancelled', label: 'ملغاة' },
];

export default function DashboardIndex({ stats }: Props) {
    return (
        <DashboardLayout title="الرئيسية">
            <Head title="لوحة التحكم" />

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {cards.map((card) => (
                    <div
                        key={card.key}
                        className="border-border/40 rounded-2xl border bg-white p-5 shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm">
                            {card.label}
                        </p>
                        <p className="text-heading mt-2 text-2xl font-bold">
                            {stats[card.key]}
                        </p>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
