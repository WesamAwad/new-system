<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $technician = $request->user();

        $stats = collect(TicketStatus::cases())->mapWithKeys(fn (TicketStatus $status) => [
            $status->value => Ticket::query()
                ->where('assigned_to', $technician->id)
                ->where('status', $status)
                ->count(),
        ]);

        return Inertia::render('dashboard/index', [
            'stats' => $stats,
        ]);
    }
}
