<?php

use App\Models\Category;
use App\Models\User;
use App\Models\Workshop;
use App\Models\WorkshopService;
use Inertia\Testing\AssertableInertia as Assert;

test('workshop edit page lists services and excludes already-added categories from the picker', function () {
    $technician = User::factory()->technician()->create();
    $workshop = Workshop::factory()->for($technician)->create();
    $category = Category::factory()->create();
    $otherCategory = Category::factory()->create();
    WorkshopService::factory()->for($workshop)->create(['category_id' => $category->id]);

    $this->actingAs($technician)
        ->get(route('dashboard.workshop.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/workshop')
            ->has('services', 1)
            ->where('services.0.category.id', $category->id)
            ->has('availableCategories', 1)
            ->where('availableCategories.0.id', $otherCategory->id));
});

test('technician can add a service to their own workshop', function () {
    $technician = User::factory()->technician()->create();
    $workshop = Workshop::factory()->for($technician)->create();
    $category = Category::factory()->create();

    $this->actingAs($technician)
        ->post(route('dashboard.workshop.services.store'), [
            'category_id' => $category->id,
            'starting_price' => 120,
        ])
        ->assertRedirect(route('dashboard.workshop.edit'))
        ->assertSessionHas('success');

    expect(
        $workshop->services()->where('category_id', $category->id)->exists(),
    )->toBeTrue();
});

test('a technician without a workshop cannot add a service', function () {
    $technician = User::factory()->technician()->create();
    $category = Category::factory()->create();

    $this->actingAs($technician)
        ->post(route('dashboard.workshop.services.store'), [
            'category_id' => $category->id,
            'starting_price' => 120,
        ])
        ->assertForbidden();
});

test('a workshop cannot offer the same category twice', function () {
    $technician = User::factory()->technician()->create();
    $workshop = Workshop::factory()->for($technician)->create();
    $category = Category::factory()->create();
    WorkshopService::factory()->for($workshop)->create(['category_id' => $category->id]);

    $this->actingAs($technician)
        ->post(route('dashboard.workshop.services.store'), [
            'category_id' => $category->id,
            'starting_price' => 200,
        ])
        ->assertInvalid(['category_id']);
});

test('technician can update the price of their own service', function () {
    $technician = User::factory()->technician()->create();
    $workshop = Workshop::factory()->for($technician)->create();
    $service = WorkshopService::factory()->for($workshop)->create(['starting_price' => 100]);

    $this->actingAs($technician)
        ->patch(route('dashboard.workshop.services.update', $service), [
            'starting_price' => 175.5,
        ])
        ->assertRedirect(route('dashboard.workshop.edit'));

    expect((float) $service->fresh()->starting_price)->toBe(175.5);
});

test('technician can delete their own service', function () {
    $technician = User::factory()->technician()->create();
    $workshop = Workshop::factory()->for($technician)->create();
    $service = WorkshopService::factory()->for($workshop)->create();

    $this->actingAs($technician)
        ->delete(route('dashboard.workshop.services.destroy', $service))
        ->assertRedirect(route('dashboard.workshop.edit'));

    expect(WorkshopService::query()->whereKey($service->id)->exists())->toBeFalse();
});

test('a technician cannot update or delete another workshops service', function () {
    $technician = User::factory()->technician()->create();
    Workshop::factory()->for($technician)->create();

    $otherTechnician = User::factory()->technician()->create();
    $otherWorkshop = Workshop::factory()->for($otherTechnician)->create();
    $otherService = WorkshopService::factory()->for($otherWorkshop)->create();

    $this->actingAs($technician)
        ->patch(route('dashboard.workshop.services.update', $otherService), [
            'starting_price' => 50,
        ])
        ->assertForbidden();

    $this->actingAs($technician)
        ->delete(route('dashboard.workshop.services.destroy', $otherService))
        ->assertForbidden();
});

test('adding a service validates required fields', function () {
    $technician = User::factory()->technician()->create();
    Workshop::factory()->for($technician)->create();

    $this->actingAs($technician)
        ->post(route('dashboard.workshop.services.store'), [])
        ->assertSessionHasErrors(['category_id', 'starting_price']);
});
