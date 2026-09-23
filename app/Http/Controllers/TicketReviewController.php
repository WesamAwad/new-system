<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketReviewRequest;
use App\Models\Ticket;
use App\Models\Workshop;
use Illuminate\Http\RedirectResponse;

class TicketReviewController extends Controller
{
    public function store(StoreTicketReviewRequest $request, Ticket $ticket): RedirectResponse
    {
        $workshop = Workshop::query()->where('user_id', $ticket->assigned_to)->firstOrFail();

        $workshop->reviews()->create([
            'user_id' => $request->user()->id,
            'ticket_id' => $ticket->id,
            'client_name' => $request->user()->name,
            'rating' => $request->validated('rating'),
            'comment' => $request->validated('comment'),
            'is_approved' => false,
        ]);

        return redirect()
            ->route('tickets.show', $ticket)
            ->with('success', 'شكراً لتقييمك! سيظهر بعد موافقة الورشة.');
    }
}
