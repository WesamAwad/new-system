<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketUpdateRequest;
use App\Models\Ticket;
use App\Models\TicketUpdate;
use Illuminate\Http\RedirectResponse;

class TicketUpdateController extends Controller
{
    public function store(StoreTicketUpdateRequest $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validated();

        TicketUpdate::query()->create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
            'status_from' => $ticket->status->value,
            'status_to' => $ticket->status->value,
            'is_internal' => $request->user()->isCustomer()
                ? false
                : (bool) ($validated['is_internal'] ?? false),
        ]);

        return redirect()
            ->route('tickets.show', $ticket)
            ->with('success', 'Update added successfully.');
    }
}
