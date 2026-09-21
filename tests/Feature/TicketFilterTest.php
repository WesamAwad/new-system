<?php

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('tickets can be filtered by status and priority', function () {
    $customer = User::factory()->customer()->create();
    $category = Category::factory()->create();

    Ticket::factory()->for($customer, 'customer')->create([
        'category_id' => $category->id,
        'title' => 'Pending low',
        'status' => TicketStatus::Pending,
        'priority' => TicketPriority::Low,
    ]);

    Ticket::factory()->for($customer, 'customer')->create([
        'category_id' => $category->id,
        'title' => 'Progress high',
        'status' => TicketStatus::InProgress,
        'priority' => TicketPriority::High,
    ]);

    $this->actingAs($customer)
        ->get(route('tickets.index', [
            'status' => 'in_progress',
            'priority' => 'high',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tickets/index')
            ->has('tickets.data', 1)
            ->where('tickets.data.0.title', 'Progress high')
            ->where('filters.status', 'in_progress')
            ->where('filters.priority', 'high'));
});

test('the grouped active status filter matches assigned and in_progress tickets', function () {
    $customer = User::factory()->customer()->create();

    Ticket::factory()->for($customer, 'customer')->create([
        'title' => 'Assigned ticket',
        'status' => TicketStatus::Assigned,
    ]);

    Ticket::factory()->for($customer, 'customer')->create([
        'title' => 'In progress ticket',
        'status' => TicketStatus::InProgress,
    ]);

    Ticket::factory()->for($customer, 'customer')->create([
        'title' => 'Completed ticket',
        'status' => TicketStatus::Completed,
    ]);

    $this->actingAs($customer)
        ->get(route('tickets.index', ['status' => 'active']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('tickets.data', 2)
            ->where('filters.status', 'active'));
});

test('tickets search supports arabic text', function () {
    $customer = User::factory()->customer()->create();

    Ticket::factory()->for($customer, 'customer')->create([
        'title' => 'تسريب مياه',
        'description' => 'مشكلة في المطبخ',
        'address' => 'الرياض',
    ]);

    Ticket::factory()->for($customer, 'customer')->create([
        'title' => 'Broken light',
    ]);

    $this->actingAs($customer)
        ->get(route('tickets.index', ['search' => 'تسريب']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('tickets.data', 1)
            ->where('tickets.data.0.title', 'تسريب مياه')
            ->where('filters.search', 'تسريب'));
});

test('invalid filter values are rejected', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('tickets.index', ['status' => 'not-a-status']))
        ->assertSessionHasErrors('status');
});

test('empty search results keep filter state', function () {
    $customer = User::factory()->customer()->create();
    Ticket::factory()->for($customer, 'customer')->create([
        'title' => 'Visible ticket',
    ]);

    $this->actingAs($customer)
        ->get(route('tickets.index', ['search' => 'zzz-no-match']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('tickets.data', 0)
            ->where('tickets.total', 0)
            ->where('filters.search', 'zzz-no-match'));
});
