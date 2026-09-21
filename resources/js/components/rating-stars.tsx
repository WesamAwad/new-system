type Props = {
    rating: string | number;
    reviewsCount?: number;
};

export function RatingStars({ rating, reviewsCount }: Props) {
    const value = Number(rating);
    const stars = '★★★★★'.slice(0, Math.round(value)).padEnd(5, '☆');

    return (
        <span className="inline-flex items-center gap-1.5 text-sm">
            <span
                dir="ltr"
                className="tracking-tight text-amber-500"
                aria-hidden="true"
            >
                {stars}
            </span>
            <span className="text-foreground font-semibold">
                {value.toFixed(1)}
            </span>
            {typeof reviewsCount === 'number' && (
                <span className="text-muted-foreground">
                    ({reviewsCount} تقييم)
                </span>
            )}
        </span>
    );
}
