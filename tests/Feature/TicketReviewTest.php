<?php

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Workshop;
use App\Models\WorkshopReview;

test('customer can review their own completed ticket', function () {
    $customer = User::factory()->customer()->create();
    $technician = User::factory()->technician()->create();
    $workshop = Workshop::factory()->for($technician)->create();
    $ticket = Ticket::factory()->for($customer, 'customer')->create([
        'assigned_to' => $technician->id,
        'status' => TicketStatus::Completed,
    ]);

    $this->actingAs($customer)
        ->post(route('tickets.review.store', $ticket), [
            'rating' => 5,
            'comment' => 'خدمة ممتازة وسريعة.',
        ])
        ->assertRedirect(route('tickets.show', $ticket))
        ->assertSessionHas('success');

    $review = WorkshopReview::query()->where('ticket_id', $ticket->id)->first();

    expect($review)->not->toBeNull()
        ->and($review->workshop_id)->toBe($workshop->id)
        ->and($review->user_id)->toBe($customer->id)
        ->and($review->client_name)->toBe($customer->name)
        ->and($review->rating)->toBe(5)
        ->and($review->is_approved)->toBeFalse();
});

test('customer cannot review a ticket that is not completed yet', function () {
    $customer = User::factory()->customer()->create();
    $ticket = Ticket::factory()->for($customer, 'customer')->create([
        'status' => TicketStatus::InProgress,
    ]);

    $this->actingAs($customer)
        ->post(route('tickets.review.store', $ticket), [
            'rating' => 5,
            'comment' => 'محاولة مبكرة.',
        ])
        ->assertForbidden();
});

test('customer cannot review someone elses ticket', function () {
    $owner = User::factory()->customer()->create();
    $other = User::factory()->customer()->create();
    $ticket = Ticket::factory()->for($owner, 'customer')->create([
        'status' => TicketStatus::Completed,
    ]);

    $this->actingAs($other)
        ->post(route('tickets.review.store', $ticket), [
            'rating' => 5,
            'comment' => 'مو تذكرتي.',
        ])
        ->assertForbidden();
});

test('a ticket cannot be reviewed twice', function () {
    $customer = User::factory()->customer()->create();
    $technician = User::factory()->technician()->create();
    Workshop::factory()->for($technician)->create();
    $ticket = Ticket::factory()->for($customer, 'customer')->create([
        'assigned_to' => $technician->id,
        'status' => TicketStatus::Completed,
    ]);

    $this->actingAs($customer)->post(route('tickets.review.store', $ticket), [
        'rating' => 5,
        'comment' => 'الأولى.',
    ]);

    $this->actingAs($customer)
        ->post(route('tickets.review.store', $ticket), [
            'rating' => 3,
            'comment' => 'محاولة ثانية.',
        ])
        ->assertForbidden();

    expect(WorkshopReview::query()->where('ticket_id', $ticket->id)->count())->toBe(1);
});

test('submitting a review validates rating and comment', function () {
    $customer = User::factory()->customer()->create();
    $technician = User::factory()->technician()->create();
    Workshop::factory()->for($technician)->create();
    $ticket = Ticket::factory()->for($customer, 'customer')->create([
        'assigned_to' => $technician->id,
        'status' => TicketStatus::Completed,
    ]);

    $this->actingAs($customer)
        ->post(route('tickets.review.store', $ticket), [
            'rating' => 9,
        ])
        ->assertSessionHasErrors(['rating', 'comment']);
});

test('approving a review recalculates the workshop rating and reviews count', function () {
    $technician = User::factory()->technician()->create();
    $workshop = Workshop::factory()->for($technician)->create([
        'rating' => 0,
        'reviews_count' => 0,
    ]);

    $approved = WorkshopReview::factory()->for($workshop)->create(['rating' => 5]);
    $pending = WorkshopReview::factory()->for($workshop)->unapproved()->create(['rating' => 3]);

    $workshop->recalculateRatingStats();
    expect($workshop->fresh()->reviews_count)->toBe(1)
        ->and((float) $workshop->fresh()->rating)->toBe(5.0);

    $this->actingAs($technician)
        ->patch(route('dashboard.reviews.update', $pending), ['is_approved' => '1']);

    expect($workshop->fresh()->reviews_count)->toBe(2)
        ->and((float) $workshop->fresh()->rating)->toBe(4.0);

    $this->actingAs($technician)
        ->patch(route('dashboard.reviews.update', $approved), ['is_approved' => '0']);

    expect($workshop->fresh()->reviews_count)->toBe(1)
        ->and((float) $workshop->fresh()->rating)->toBe(3.0);
});
