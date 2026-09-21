<?php

namespace App\Models;

use Database\Factories\WorkshopReviewFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $workshop_id
 * @property string $client_name
 * @property int $rating
 * @property string $comment
 * @property bool $is_approved
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['workshop_id', 'client_name', 'rating', 'comment', 'is_approved'])]
class WorkshopReview extends Model
{
    /** @use HasFactory<WorkshopReviewFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_approved' => 'boolean',
        ];
    }

    public function workshop(): BelongsTo
    {
        return $this->belongsTo(Workshop::class);
    }

    /**
     * @param  Builder<WorkshopReview>  $query
     * @return Builder<WorkshopReview>
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('is_approved', true);
    }
}
