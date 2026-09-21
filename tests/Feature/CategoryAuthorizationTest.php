<?php

use App\Models\Category;
use App\Models\User;

test('admins can create categories', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('categories.store'), [
        'name' => 'Roofing',
        'description' => 'Roof repair services',
        'base_price' => 150,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('categories.index'));
    $this->assertDatabaseHas('categories', [
        'name' => 'Roofing',
        'slug' => 'roofing',
    ]);
});

test('customers cannot create categories', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->post(route('categories.store'), [
            'name' => 'Roofing',
            'base_price' => 150,
        ])
        ->assertForbidden();
});

test('customers cannot update categories', function () {
    $customer = User::factory()->customer()->create();
    $category = Category::factory()->create();

    $this->actingAs($customer)
        ->patch(route('categories.update', $category), [
            'name' => 'Changed',
        ])
        ->assertForbidden();
});

test('customers cannot delete categories', function () {
    $customer = User::factory()->customer()->create();
    $category = Category::factory()->create();

    $this->actingAs($customer)
        ->delete(route('categories.destroy', $category))
        ->assertForbidden();
});
