<?php

namespace App\Actions;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\TicketUpdate;
use App\Models\User;
use App\Models\Workshop;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateTicketAction
{
    /**
     * @param  array{workshop_id: int, category_id: int, title: string, description: string, address: string, priority: string}  $data
     */
    public function handle(User $user, array $data): Ticket
    {
        return DB::transaction(function () use ($user, $data): Ticket {
            $workshop = Workshop::query()->findOrFail($data['workshop_id']);

            $ticket = Ticket::query()->create([
                'ticket_number' => $this->generateTicketNumber(),
                'user_id' => $user->id,
                'category_id' => $data['category_id'],
                'assigned_to' => $workshop->user_id,
                'title' => $data['title'],
                'description' => $data['description'],
                'address' => $data['address'],
                'priority' => $data['priority'],
                'status' => TicketStatus::Assigned,
            ]);

            TicketUpdate::query()->create([
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'message' => 'Ticket created.',
                'status_from' => null,
                'status_to' => TicketStatus::Assigned->value,
                'is_internal' => false,
            ]);

            return $ticket;
        });
    }

    protected function generateTicketNumber(): string
    {
        do {
            $number = 'SWIFT-'.Str::upper(Str::random(6));
        } while (Ticket::query()->where('ticket_number', $number)->exists());

        return $number;
    }
}
