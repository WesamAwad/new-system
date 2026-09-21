<?php

namespace App\Models;

use Database\Factories\WorkshopServiceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $workshop_id
 * @property int $category_id
 * @property string $starting_price
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['workshop_id', 'category_id', 'starting_price'])]
class WorkshopService extends Model
{
    /** @use HasFactory<WorkshopServiceFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starting_price' => 'decimal:2',
        ];
    }

    public function workshop(): BelongsTo
    {
        return $this->belongsTo(Workshop::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
