<?php

use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('login page renders inertia component', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->has('auth.user')
            ->where('auth.user', null)
            ->has('flash.success')
            ->has('flash.error'));
});

test('tickets index shares paginated tickets and auth role', function () {
    $customer = User::factory()->customer()->create();
    Ticket::factory()->for($customer, 'customer')->count(2)->create();

    $this->actingAs($customer)
        ->get(route('tickets.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tickets/index')
            ->where('auth.user.role', 'customer')
            ->has('tickets.data', 2)
            ->has('tickets.current_page')
            ->has('filters')
            ->has('flash'));
});

test('ticket create page receives active categories', function () {
    $customer = User::factory()->customer()->create();
    Category::factory()->create(['name' => 'Active Cat']);
    Category::factory()->inactive()->create(['name' => 'Inactive Cat']);

    $this->actingAs($customer)
        ->get(route('tickets.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tickets/create')
            ->has('categories', 1)
            ->where('categories.0.name', 'Active Cat'));
});

test('ticket show page includes nested relations without internal notes for customers', function () {
    $customer = User::factory()->customer()->create();
    $ticket = Ticket::factory()->for($customer, 'customer')->create();

    $ticket->updates()->create([
        'user_id' => $customer->id,
        'message' => 'Public note',
        'is_internal' => false,
    ]);

    $ticket->updates()->create([
        'user_id' => $customer->id,
        'message' => 'Secret note',
        'is_internal' => true,
    ]);

    $this->actingAs($customer)
        ->get(route('tickets.show', $ticket))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tickets/show')
            ->where('ticket.id', $ticket->id)
            ->has('ticket.category')
            ->has('ticket.customer')
            ->has('ticket.updates', 1)
            ->where('ticket.updates.0.message', 'Public note')
            ->has('technicians', 0));
});

test('admin ticket show page includes technicians for assignment', function () {
    $admin = User::factory()->admin()->create();
    $technician = User::factory()->technician()->create(['name' => 'Tech One']);
    $ticket = Ticket::factory()->create();

    $this->actingAs($admin)
        ->get(route('tickets.show', $ticket))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tickets/show')
            ->has('technicians', 1)
            ->where('technicians.0.id', $technician->id));
});
