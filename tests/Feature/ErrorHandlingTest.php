<?php

use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;

test('guests are redirected to login for protected pages', function () {
    $this->get(route('tickets.index'))->assertRedirect(route('login'));
    $this->get(route('categories.index'))->assertRedirect(route('login'));
});

test('forbidden actions return 403', function () {
    $customer = User::factory()->customer()->create();
    $category = Category::factory()->create();

    $this->actingAs($customer)
        ->post(route('categories.store'), [
            'name' => 'Hack',
            'base_price' => 10,
        ])
        ->assertForbidden();
});

test('validation errors return to form with 422 session errors', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)
        ->from(route('tickets.create'))
        ->post(route('tickets.store'), [])
        ->assertRedirect(route('tickets.create'))
        ->assertSessionHasErrors(['category_id', 'title', 'description', 'address', 'priority']);
});

test('duplicate category slug is rejected', function () {
    $admin = User::factory()->admin()->create();
    Category::factory()->create(['slug' => 'plumbing']);

    $this->actingAs($admin)
        ->from(route('categories.index'))
        ->post(route('categories.store'), [
            'name' => 'Plumbing',
            'slug' => 'plumbing',
            'base_price' => 20,
            'is_active' => 1,
        ])
        ->assertRedirect(route('categories.index'))
        ->assertSessionHasErrors('slug');
});

test('login is rate limited after too many attempts', function () {
    $user = User::factory()->customer()->create([
        'email' => 'throttle@example.com',
        'password' => 'Password1!',
    ]);

    RateLimiter::clear(strtolower($user->email).'|127.0.0.1');

    foreach (range(1, 5) as $attempt) {
        $this->from(route('login'))->post(route('login'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertSessionHasErrors('email');
    }

    $this->from(route('login'))->post(route('login'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertStatus(429);
});

test('missing ticket returns not found instead of server error', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/tickets/not-an-id')
        ->assertNotFound();
});
