<?php

namespace App\Http\Requests;

use App\Models\Ticket;
use Illuminate\Foundation\Http\FormRequest;

class StoreTicketUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Ticket $ticket */
        $ticket = $this->route('ticket');

        return $this->user()?->can('addUpdate', $ticket) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $user = $this->user();

        return [
            'message' => ['required', 'string', 'max:5000'],
            'is_internal' => [
                $user?->isAdmin() || $user?->isTechnician() ? 'sometimes' : 'prohibited',
                'boolean',
            ],
        ];
    }
}
