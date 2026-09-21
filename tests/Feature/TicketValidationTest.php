<?php

use App\Models\Category;
use App\Models\User;

test('ticket creation requires required fields', function () {
    $customer = User::factory()->customer()->create();

    $response = $this->actingAs($customer)->from(route('home'))->post(route('tickets.store'), []);

    $response->assertSessionHasErrors(['category_id', 'title', 'description', 'address', 'priority']);
});

test('ticket creation rejects inactive categories', function () {
    $customer = User::factory()->customer()->create();
    $category = Category::factory()->inactive()->create();

    $response = $this->actingAs($customer)->from(route('home'))->post(route('tickets.store'), [
        'category_id' => $category->id,
        'title' => 'Broken AC',
        'description' => 'Unit not cooling.',
        'address' => 'Jeddah',
        'priority' => 'medium',
    ]);

    $response->assertSessionHasErrors('category_id');
});

test('ticket creation rejects invalid priority values', function () {
    $customer = User::factory()->customer()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($customer)->from(route('home'))->post(route('tickets.store'), [
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
    $category = Category::factory()->create();

    $response = $this->actingAs($customer)->post(route('tickets.store'), [
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
