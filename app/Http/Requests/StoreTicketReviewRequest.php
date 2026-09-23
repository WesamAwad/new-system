<?php

namespace App\Http\Requests;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use Illuminate\Foundation\Http\FormRequest;

class StoreTicketReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Ticket $ticket */
        $ticket = $this->route('ticket');
        $user = $this->user();

        return $user !== null
            && $ticket->user_id === $user->id
            && $ticket->status === TicketStatus::Completed
            && $ticket->assigned_to !== null
            && $ticket->review === null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['required', 'string', 'max:2000'],
        ];
    }
}
