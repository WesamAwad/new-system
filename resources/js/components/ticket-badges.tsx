import type { TicketPriority, TicketStatus } from '@/types';

const statusStyles: Record<TicketStatus, string> = {
    pending: 'bg-amber-50 text-amber-800 ring-amber-200',
    assigned: 'bg-sky-50 text-sky-800 ring-sky-200',
    in_progress: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
    completed: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    cancelled: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const priorityStyles: Record<TicketPriority, string> = {
    low: 'text-slate-600',
    medium: 'text-sky-700',
    high: 'text-orange-700',
    emergency: 'text-red-700 font-semibold',
};

export function StatusBadge({ status }: { status: TicketStatus }) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
        >
            {status.replace('_', ' ')}
        </span>
    );
}

export function PriorityLabel({ priority }: { priority: TicketPriority }) {
    return (
        <span className={`text-sm capitalize ${priorityStyles[priority]}`}>
            {priority}
        </span>
    );
}
