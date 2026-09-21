<?php

namespace App\Models;

use Database\Factories\WorkshopFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string|null $logo
 * @property string|null $bio
 * @property string $city
 * @property string $address
 * @property string $rating
 * @property int $reviews_count
 * @property bool $is_featured
 * @property bool $is_available
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'name', 'logo', 'bio', 'city', 'address', 'rating', 'reviews_count', 'is_featured', 'is_available'])]
class Workshop extends Model
{
    /** @use HasFactory<WorkshopFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rating' => 'decimal:1',
            'is_featured' => 'boolean',
            'is_available' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(WorkshopService::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(WorkshopReview::class);
    }

    /**
     * @param  Builder<Workshop>  $query
     * @return Builder<Workshop>
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }
}
