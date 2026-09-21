<?php

namespace App\Http\Requests;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Enums\UserRole;
use App\Models\Ticket;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Ticket $ticket */
        $ticket = $this->route('ticket');
        $user = $this->user();

        if ($user === null || ! $user->can('update', $ticket)) {
            return false;
        }

        if ($user->isCustomer() && ! $this->isStillEditable($ticket)) {
            return false;
        }

        return true;
    }

    private function isStillEditable(Ticket $ticket): bool
    {
        return in_array($ticket->status, [TicketStatus::Pending, TicketStatus::Assigned], true);
    }

    protected function prepareForValidation(): void
    {
        if ($this->exists('assigned_to') && $this->input('assigned_to') === '') {
            $this->merge(['assigned_to' => null]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $user = $this->user();

        $rules = [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string', 'max:5000'],
            'address' => ['sometimes', 'required', 'string', 'max:255'],
            'priority' => ['sometimes', 'required', Rule::enum(TicketPriority::class)],
            'category_id' => ['sometimes', 'required', 'integer', Rule::exists('categories', 'id')->where('is_active', true)],
        ];

        if ($user?->isAdmin() || $user?->isTechnician()) {
            $rules['status'] = ['sometimes', 'required', Rule::enum(TicketStatus::class)];
            $rules['estimated_cost'] = ['sometimes', 'nullable', 'numeric', 'min:0'];
            $rules['scheduled_at'] = ['sometimes', 'nullable', 'date'];
        }

        if ($user?->isAdmin()) {
            $rules['assigned_to'] = [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('users', 'id')->where('role', UserRole::Technician->value),
            ];
        }

        if ($user?->isCustomer()) {
            $rules['status'] = ['sometimes', Rule::in([TicketStatus::Cancelled->value])];
        }

        return $rules;
    }
}
