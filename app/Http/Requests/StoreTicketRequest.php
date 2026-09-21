<?php

namespace App\Http\Requests;

use App\Enums\TicketPriority;
use App\Models\Ticket;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Ticket::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'workshop_id' => ['required', 'integer', Rule::exists('workshops', 'id')],
            'category_id' => [
                'required',
                'integer',
                Rule::exists('workshop_services', 'category_id')->where('workshop_id', $this->input('workshop_id')),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'address' => ['required', 'string', 'max:255'],
            'priority' => ['required', Rule::enum(TicketPriority::class)],
        ];
    }
}
