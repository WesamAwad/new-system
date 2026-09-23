<?php

namespace App\Http\Requests;

use App\Models\WorkshopService;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkshopServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var WorkshopService $workshopService */
        $workshopService = $this->route('workshopService');

        return $this->user()?->can('update', $workshopService) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'starting_price' => ['required', 'numeric', 'min:0', 'max:99999.99'],
        ];
    }
}
