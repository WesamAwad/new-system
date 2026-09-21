<?php

use App\Models\Category;
use App\Models\Workshop;
use App\Models\WorkshopReview;
use App\Models\WorkshopService;
use Inertia\Testing\AssertableInertia as Assert;

test('guests can browse the workshops directory', function () {
    Workshop::factory()->count(3)->create();

    $this->get(route('workshops.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('workshops/index')
            ->has('workshops.data', 3)
            ->has('filters')
            ->has('categories'));
});

test('workshops directory filters by city, category, and minimum rating', function () {
    $category = Category::factory()->create(['slug' => 'screen-repair']);

    $matching = Workshop::factory()->create(['city' => 'Gaza', 'rating' => 4.8]);
    WorkshopService::factory()->for($matching)->create(['category_id' => $category->id]);

    $otherCity = Workshop::factory()->create(['city' => 'Rafah', 'rating' => 4.8]);
    WorkshopService::factory()->for($otherCity)->create(['category_id' => $category->id]);

    $lowRating = Workshop::factory()->create(['city' => 'Gaza', 'rating' => 3.0]);
    WorkshopService::factory()->for($lowRating)->create(['category_id' => $category->id]);

    $this->get(route('workshops.index', [
        'city' => 'Gaza',
        'category' => 'screen-repair',
        'min_rating' => 4,
    ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('workshops/index')
            ->has('workshops.data', 1)
            ->where('workshops.data.0.id', $matching->id));
});

test('workshop profile page exposes services and only approved reviews', function () {
    $workshop = Workshop::factory()->create();
    $category = Category::factory()->create();
    WorkshopService::factory()->for($workshop)->create(['category_id' => $category->id]);

    $approved = WorkshopReview::factory()->for($workshop)->create(['is_approved' => true]);
    WorkshopReview::factory()->for($workshop)->unapproved()->create();

    $this->get(route('workshops.show', $workshop))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('workshops/show')
            ->where('workshop.id', $workshop->id)
            ->has('workshop.services', 1)
            ->has('workshop.reviews', 1)
            ->where('workshop.reviews.0.id', $approved->id));
});

test('nonexistent workshop returns 404', function () {
    $this->get(route('workshops.show', 999999))->assertNotFound();
});
