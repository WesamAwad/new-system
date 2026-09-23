<?php

namespace App\Http\Requests;

use App\Models\WorkshopReview;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkshopReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var WorkshopReview $workshopReview */
        $workshopReview = $this->route('workshopReview');

        return $this->user()?->can('update', $workshopReview) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'is_approved' => ['required', 'boolean'],
        ];
    }
}
