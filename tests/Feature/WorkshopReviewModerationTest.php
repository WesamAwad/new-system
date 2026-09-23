<?php

use App\Models\User;
use App\Models\Workshop;
use App\Models\WorkshopReview;
use Inertia\Testing\AssertableInertia as Assert;

test('technician sees all their reviews including unapproved ones', function () {
    $technician = User::factory()->technician()->create();
    $workshop = Workshop::factory()->for($technician)->create();

    WorkshopReview::factory()->for($workshop)->create(['is_approved' => true]);
    WorkshopReview::factory()->for($workshop)->unapproved()->create();

    $this->actingAs($technician)
        ->get(route('dashboard.reviews.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/reviews')
            ->has('reviews.data', 2));
});

test('a technician without a workshop sees an empty reviews list', function () {
    $technician = User::factory()->technician()->create();

    $this->actingAs($technician)
        ->get(route('dashboard.reviews.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/reviews')
            ->has('reviews.data', 0));
});

test('technician can approve a pending review', function () {
    $technician = User::factory()->technician()->create();
    $workshop = Workshop::factory()->for($technician)->create();
    $review = WorkshopReview::factory()->for($workshop)->unapproved()->create();

    $this->actingAs($technician)
        ->patch(route('dashboard.reviews.update', $review), ['is_approved' => '1'])
        ->assertRedirect(route('dashboard.reviews.index'))
        ->assertSessionHas('success');

    expect($review->fresh()->is_approved)->toBeTrue();
});

test('technician can unapprove a previously approved review', function () {
    $technician = User::factory()->technician()->create();
    $workshop = Workshop::factory()->for($technician)->create();
    $review = WorkshopReview::factory()->for($workshop)->create(['is_approved' => true]);

    $this->actingAs($technician)
        ->patch(route('dashboard.reviews.update', $review), ['is_approved' => '0'])
        ->assertRedirect(route('dashboard.reviews.index'));

    expect($review->fresh()->is_approved)->toBeFalse();
});

test('a technician cannot moderate another workshops review', function () {
    $technician = User::factory()->technician()->create();
    Workshop::factory()->for($technician)->create();

    $otherTechnician = User::factory()->technician()->create();
    $otherWorkshop = Workshop::factory()->for($otherTechnician)->create();
    $otherReview = WorkshopReview::factory()->for($otherWorkshop)->unapproved()->create();

    $this->actingAs($technician)
        ->patch(route('dashboard.reviews.update', $otherReview), ['is_approved' => '1'])
        ->assertForbidden();

    expect($otherReview->fresh()->is_approved)->toBeFalse();
});

test('customers and admins cannot access the reviews dashboard', function () {
    $customer = User::factory()->customer()->create();
    $admin = User::factory()->admin()->create();

    $this->actingAs($customer)->get(route('dashboard.reviews.index'))->assertForbidden();
    $this->actingAs($admin)->get(route('dashboard.reviews.index'))->assertForbidden();
});

test('guests are redirected to login for the reviews dashboard', function () {
    $this->get(route('dashboard.reviews.index'))->assertRedirect(route('login'));
});
