<?php

namespace App\Http\Controllers;

use App\Actions\CreateTicketAction;
use App\Enums\TicketStatus;
use App\Enums\UserRole;
use App\Http\Requests\IndexTicketRequest;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Models\Ticket;
use App\Models\TicketUpdate;
use App\Models\User;
use App\Models\Workshop;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(IndexTicketRequest $request): Response
    {
        $this->authorize('viewAny', Ticket::class);

        $user = $request->user();
        $filters = $request->filters();

        $tickets = Ticket::query()
            ->with(['category:id,name,slug', 'customer:id,name,email', 'assignee:id,name,email'])
            ->when($user->isCustomer(), fn ($query) => $query->where('user_id', $user->id))
            ->when($user->isTechnician(), fn ($query) => $query->where(function ($query) use ($user): void {
                $query->where('assigned_to', $user->id)
                    ->orWhereNull('assigned_to');
            }))
            ->when($filters['search'], function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('ticket_number', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'], function ($query, string $status): void {
                if ($status === 'active') {
                    $query->whereIn('status', [TicketStatus::Assigned->value, TicketStatus::InProgress->value]);
                } else {
                    $query->where('status', $status);
                }
            })
            ->when($filters['priority'], fn ($query, string $priority) => $query->where('priority', $priority))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
            'filters' => $filters,
        ]);
    }

    public function create(Request $request): RedirectResponse|Response
    {
        $this->authorize('create', Ticket::class);

        $workshop = Workshop::query()
            ->with('services.category:id,name,slug')
            ->find($request->integer('workshop_id'));

        if ($workshop === null) {
            return redirect()
                ->route('workshops.index')
                ->with('error', 'الرجاء اختيار ورشة أولاً لإرسال طلب صيانة.');
        }

        return Inertia::render('tickets/create', [
            'workshop' => $workshop,
        ]);
    }

    public function show(Request $request, Ticket $ticket): Response
    {
        $this->authorize('view', $ticket);

        $ticket->load([
            'category:id,name,slug',
            'customer:id,name,email,phone',
            'assignee:id,name,email,phone',
            'assignee.workshop:id,user_id,name,logo,city,address',
            'review',
            'updates' => fn ($query) => $query->with('user:id,name,role')->latest(),
        ]);

        $user = $request->user();

        if (! $user->isAdmin() && ! $user->isTechnician()) {
            $ticket->setRelation(
                'updates',
                $ticket->updates->where('is_internal', false)->values(),
            );
        }

        return Inertia::render('tickets/show', [
            'ticket' => $ticket,
            'technicians' => $user->isAdmin()
                ? User::query()
                    ->where('role', UserRole::Technician)
                    ->orderBy('name')
                    ->get(['id', 'name', 'email'])
                : [],
        ]);
    }

    public function store(StoreTicketRequest $request, CreateTicketAction $createTicket): RedirectResponse
    {
        $ticket = $createTicket->handle($request->user(), $request->validated());

        return redirect()
            ->route('tickets.show', $ticket)
            ->with('success', 'Ticket created successfully.');
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $ticket, $validated): void {
            $previousStatus = $ticket->status;
            $nextStatus = isset($validated['status'])
                ? $this->normalizeStatus($validated['status'])
                : null;

            if (
                array_key_exists('assigned_to', $validated)
                && $validated['assigned_to'] !== null
                && ($nextStatus === null || $nextStatus === TicketStatus::Pending)
                && $ticket->status === TicketStatus::Pending
            ) {
                $validated['status'] = TicketStatus::Assigned;
                $nextStatus = TicketStatus::Assigned;
            }

            if ($nextStatus === TicketStatus::Completed && $ticket->completed_at === null) {
                $validated['completed_at'] = now();
            }

            $ticket->update($validated);
            $ticket->refresh();

            if ($nextStatus !== null && $previousStatus !== $ticket->status) {
                TicketUpdate::query()->create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $request->user()->id,
                    'message' => 'Status updated.',
                    'status_from' => $previousStatus->value,
                    'status_to' => $ticket->status->value,
                    'is_internal' => false,
                ]);
            }
        });

        return redirect()
            ->route('tickets.show', $ticket)
            ->with('success', 'Ticket updated successfully.');
    }

    public function destroy(Ticket $ticket): RedirectResponse
    {
        $this->authorize('delete', $ticket);

        $ticket->delete();

        return redirect()
            ->route('tickets.index')
            ->with('success', 'Ticket deleted successfully.');
    }

    private function normalizeStatus(TicketStatus|string $status): TicketStatus
    {
        return $status instanceof TicketStatus
            ? $status
            : TicketStatus::from($status);
    }
}
