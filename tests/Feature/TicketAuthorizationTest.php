<?php

use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Workshop;
use App\Models\WorkshopService;

test('customers can create tickets for themselves', function () {
    $customer = User::factory()->customer()->create();
    $workshop = Workshop::factory()->create();
    $category = Category::factory()->create();
    WorkshopService::factory()->for($workshop)->create(['category_id' => $category->id]);

    $response = $this->actingAs($customer)->post(route('tickets.store'), [
        'workshop_id' => $workshop->id,
        'category_id' => $category->id,
        'title' => 'Leaking pipe',
        'description' => 'Kitchen sink is leaking heavily.',
        'address' => 'Riyadh, Olaya',
        'priority' => 'high',
    ]);

    $ticket = Ticket::query()->where('title', 'Leaking pipe')->first();

    expect($ticket)->not->toBeNull()
        ->and($ticket->user_id)->toBe($customer->id);

    $response->assertRedirect(route('tickets.show', $ticket));
});

test('customers cannot update another customers ticket', function () {
    $owner = User::factory()->customer()->create();
    $other = User::factory()->customer()->create();
    $ticket = Ticket::factory()->for($owner, 'customer')->create();

    $response = $this->actingAs($other)->patch(route('tickets.update', $ticket), [
        'title' => 'Hacked title',
    ]);

    $response->assertForbidden();
    expect($ticket->fresh()->title)->not->toBe('Hacked title');
});

test('customers cannot delete another customers ticket', function () {
    $owner = User::factory()->customer()->create();
    $other = User::factory()->customer()->create();
    $ticket = Ticket::factory()->for($owner, 'customer')->create();

    $this->actingAs($other)
        ->delete(route('tickets.destroy', $ticket))
        ->assertForbidden();

    expect(Ticket::query()->whereKey($ticket->id)->exists())->toBeTrue();
});

test('technicians can update assigned tickets', function () {
    $technician = User::factory()->technician()->create();
    $ticket = Ticket::factory()->assignedTo($technician)->create();

    $response = $this->actingAs($technician)->patch(route('tickets.update', $ticket), [
        'status' => 'in_progress',
    ]);

    $response->assertRedirect(route('tickets.show', $ticket));
    expect($ticket->fresh()->status->value)->toBe('in_progress');
});

test('technicians cannot update tickets assigned to someone else', function () {
    $technician = User::factory()->technician()->create();
    $otherTechnician = User::factory()->technician()->create();
    $ticket = Ticket::factory()->assignedTo($otherTechnician)->create();

    $this->actingAs($technician)
        ->patch(route('tickets.update', $ticket), [
            'status' => 'in_progress',
        ])
        ->assertForbidden();
});

test('admins can assign technicians to tickets', function () {
    $admin = User::factory()->admin()->create();
    $technician = User::factory()->technician()->create();
    $ticket = Ticket::factory()->create();

    $response = $this->actingAs($admin)->patch(route('tickets.update', $ticket), [
        'assigned_to' => $technician->id,
    ]);

    $response->assertRedirect(route('tickets.show', $ticket));

    $ticket->refresh();

    expect($ticket->assigned_to)->toBe($technician->id)
        ->and($ticket->status->value)->toBe('assigned');
});
