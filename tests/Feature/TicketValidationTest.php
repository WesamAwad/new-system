<?php

use App\Models\Category;
use App\Models\User;
use App\Models\Workshop;
use App\Models\WorkshopService;

test('ticket creation requires required fields', function () {
    $customer = User::factory()->customer()->create();

    $response = $this->actingAs($customer)->from(route('home'))->post(route('tickets.store'), []);

    $response->assertSessionHasErrors(['workshop_id', 'category_id', 'title', 'description', 'address', 'priority']);
});

test('ticket creation requires a workshop_id', function () {
    $customer = User::factory()->customer()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($customer)->from(route('home'))->post(route('tickets.store'), [
        'category_id' => $category->id,
        'title' => 'Broken AC',
        'description' => 'Unit not cooling.',
        'address' => 'Jeddah',
        'priority' => 'medium',
    ]);

    $response->assertSessionHasErrors('workshop_id');
});

test('ticket creation rejects invalid priority values', function () {
    $customer = User::factory()->customer()->create();
    $workshop = Workshop::factory()->create();
    $category = Category::factory()->create();
    WorkshopService::factory()->for($workshop)->create(['category_id' => $category->id]);

    $response = $this->actingAs($customer)->from(route('home'))->post(route('tickets.store'), [
        'workshop_id' => $workshop->id,
        'category_id' => $category->id,
        'title' => 'Broken AC',
        'description' => 'Unit not cooling.',
        'address' => 'Jeddah',
        'priority' => 'urgent',
    ]);

    $response->assertSessionHasErrors('priority');
});

test('ticket creation accepts arabic text', function () {
    $customer = User::factory()->customer()->create();
    $workshop = Workshop::factory()->create();
    $category = Category::factory()->create();
    WorkshopService::factory()->for($workshop)->create(['category_id' => $category->id]);

    $response = $this->actingAs($customer)->post(route('tickets.store'), [
        'workshop_id' => $workshop->id,
        'category_id' => $category->id,
        'title' => 'تسريب مياه في المطبخ',
        'description' => 'يوجد تسريب شديد تحت الحوض منذ الصباح.',
        'address' => 'الرياض، حي النرجس',
        'priority' => 'high',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('tickets', [
        'title' => 'تسريب مياه في المطبخ',
        'user_id' => $customer->id,
    ]);
});
