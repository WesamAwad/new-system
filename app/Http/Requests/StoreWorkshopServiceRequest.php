<?php

namespace App\Http\Requests;

use App\Models\WorkshopService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWorkshopServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', WorkshopService::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $workshopId = $this->user()->workshop->id;

        return [
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')->where('is_active', true),
                Rule::unique('workshop_services')->where('workshop_id', $workshopId),
            ],
            'starting_price' => ['required', 'numeric', 'min:0', 'max:99999.99'],
        ];
    }
}
