import { cn } from '@/lib/utils';

type InputErrorProps = {
    message?: string;
    className?: string;
};

export default function InputError({ message, className }: InputErrorProps) {
    if (!message) {
        return null;
    }

    return (
        <p className={cn('mt-1 text-sm text-red-600', className)} role="alert">
            {message}
        </p>
    );
}
