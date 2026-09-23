<?php

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('technician sees a status breakdown of their assigned tickets', function () {
    $technician = User::factory()->technician()->create();
    $otherTechnician = User::factory()->technician()->create();

    Ticket::factory()->assignedTo($technician)->create();
    Ticket::factory()->assignedTo($technician)->create();
    Ticket::factory()->assignedTo($technician)->create(['status' => TicketStatus::Completed]);

    // Belongs to someone else, must not be counted.
    Ticket::factory()->assignedTo($otherTechnician)->create();

    $this->actingAs($technician)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/index')
            ->where('stats.assigned', 2)
            ->where('stats.completed', 1)
            ->where('stats.pending', 0));
});

test('customers cannot access the technician dashboard', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('dashboard'))
        ->assertForbidden();
});

test('admins cannot access the technician dashboard yet', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertForbidden();
});

test('guests are redirected to login for the dashboard', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});
