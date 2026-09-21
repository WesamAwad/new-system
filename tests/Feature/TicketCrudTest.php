<?php

use App\Enums\TicketStatus;
use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Workshop;
use Inertia\Testing\AssertableInertia as Assert;

test('customer can create read update and soft delete own pending ticket', function () {
    $customer = User::factory()->customer()->create();
    $category = Category::factory()->create();

    $create = $this->actingAs($customer)->post(route('tickets.store'), [
        'category_id' => $category->id,
        'title' => 'Broken faucet',
        'description' => 'Water keeps dripping.',
        'address' => 'Riyadh',
        'priority' => 'medium',
    ]);

    $ticket = Ticket::query()->where('title', 'Broken faucet')->first();

    expect($ticket)->not->toBeNull();
    $create->assertRedirect(route('tickets.show', $ticket));

    $this->actingAs($customer)
        ->get(route('tickets.show', $ticket))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tickets/show')
            ->where('ticket.title', 'Broken faucet'));

    $this->actingAs($customer)
        ->patch(route('tickets.update', $ticket), [
            'title' => 'Broken kitchen faucet',
            'description' => 'Water keeps dripping.',
            'address' => 'Riyadh',
            'priority' => 'high',
        ])
        ->assertRedirect(route('tickets.show', $ticket));

    expect($ticket->fresh()->title)->toBe('Broken kitchen faucet');

    $this->actingAs($customer)
        ->delete(route('tickets.destroy', $ticket))
        ->assertRedirect(route('tickets.index'));

    expect(Ticket::query()->whereKey($ticket->id)->exists())->toBeFalse()
        ->and(Ticket::withTrashed()->whereKey($ticket->id)->exists())->toBeTrue();
});

test('creating a ticket with a workshop pre-assigns its technician', function () {
    $customer = User::factory()->customer()->create();
    $category = Category::factory()->create();
    $workshop = Workshop::factory()->create();

    $create = $this->actingAs($customer)->post(route('tickets.store'), [
        'category_id' => $category->id,
        'title' => 'Cracked screen',
        'description' => 'Screen cracked after a drop.',
        'address' => 'Gaza',
        'priority' => 'medium',
        'workshop_id' => $workshop->id,
    ]);

    $ticket = Ticket::query()->where('title', 'Cracked screen')->first();
    $create->assertRedirect(route('tickets.show', $ticket));

    expect($ticket->assigned_to)->toBe($workshop->user_id)
        ->and($ticket->status)->toBe(TicketStatus::Assigned);
});

test('ticket creation page shows the preselected workshop', function () {
    $customer = User::factory()->customer()->create();
    $workshop = Workshop::factory()->create();

    $this->actingAs($customer)
        ->get(route('tickets.create', ['workshop_id' => $workshop->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tickets/create')
            ->where('preselectedWorkshop.id', $workshop->id)
            ->where('preselectedWorkshop.name', $workshop->name));
});

test('tickets index shows empty state props when customer has no tickets', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('tickets.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tickets/index')
            ->has('tickets.data', 0)
            ->where('tickets.total', 0)
            ->has('filters'));
});

test('tickets index paginates results', function () {
    $customer = User::factory()->customer()->create();
    Ticket::factory()->for($customer, 'customer')->count(16)->create();

    $this->actingAs($customer)
        ->get(route('tickets.index', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('tickets.current_page', 2)
            ->has('tickets.data', 1));
});

test('nonexistent ticket returns 404', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->get(route('tickets.show', 999999))
        ->assertNotFound();
});

test('soft deleted ticket cannot be viewed or updated', function () {
    $customer = User::factory()->customer()->create();
    $ticket = Ticket::factory()->for($customer, 'customer')->create();
    $ticket->delete();

    $this->actingAs($customer)
        ->get(route('tickets.show', $ticket->id))
        ->assertNotFound();

    $this->actingAs($customer)
        ->patch(route('tickets.update', $ticket->id), [
            'title' => 'Should fail',
        ])
        ->assertNotFound();
});

test('customer cannot delete non pending ticket', function () {
    $customer = User::factory()->customer()->create();
    $ticket = Ticket::factory()->for($customer, 'customer')->create([
        'status' => TicketStatus::InProgress,
    ]);

    $this->actingAs($customer)
        ->delete(route('tickets.destroy', $ticket))
        ->assertForbidden();

    expect(Ticket::query()->whereKey($ticket->id)->exists())->toBeTrue();
});

test('admin can update category and cannot delete category with tickets', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create(['name' => 'Old Name']);
    Ticket::factory()->create(['category_id' => $category->id]);

    $this->actingAs($admin)
        ->patch(route('categories.update', $category), [
            'name' => 'New Name',
            'base_price' => 99.5,
            'is_active' => 1,
        ])
        ->assertRedirect(route('categories.index'));

    expect($category->fresh()->name)->toBe('New Name');

    $this->actingAs($admin)
        ->from(route('categories.index'))
        ->delete(route('categories.destroy', $category))
        ->assertRedirect(route('categories.index'))
        ->assertSessionHas('error');

    expect(Category::query()->whereKey($category->id)->exists())->toBeTrue();
});

test('admin can delete category without tickets', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $this->actingAs($admin)
        ->delete(route('categories.destroy', $category))
        ->assertRedirect(route('categories.index'))
        ->assertSessionHas('success');

    expect(Category::query()->whereKey($category->id)->exists())->toBeFalse();
});
