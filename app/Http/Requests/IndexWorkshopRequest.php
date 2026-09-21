<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexWorkshopRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', Rule::exists('categories', 'slug')],
            'min_rating' => ['nullable', 'numeric', 'between:0,5'],
        ];
    }

    /**
     * @return array{search: string|null, city: string|null, category: string|null, min_rating: string|null}
     */
    public function filters(): array
    {
        return [
            'search' => $this->validated('search'),
            'city' => $this->validated('city'),
            'category' => $this->validated('category'),
            'min_rating' => $this->validated('min_rating'),
        ];
    }
}
