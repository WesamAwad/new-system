<?php

use App\Enums\UserRole;
use App\Models\User;

test('guests can register as customers', function () {
    $response = $this->post(route('register'), [
        'name' => 'New Customer',
        'email' => 'new.customer@example.com',
        'phone' => '0501234567',
        'city' => 'Riyadh',
        'address' => 'Olaya',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
        'role' => 'customer',
        'terms' => true,
    ]);

    $response->assertRedirect(route('home'));
    $this->assertAuthenticated();

    $user = User::query()->where('email', 'new.customer@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->role)->toBe(UserRole::Customer);
});

test('users can authenticate with valid credentials', function () {
    $user = User::factory()->customer()->create([
        'email' => 'login@example.com',
        'password' => 'Password1!',
    ]);

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'Password1!',
    ]);

    $response->assertRedirect(route('home'));
    $this->assertAuthenticatedAs($user);
});

test('users cannot authenticate with invalid credentials', function () {
    $user = User::factory()->customer()->create([
        'email' => 'login-fail@example.com',
        'password' => 'Password1!',
    ]);

    $response = $this->from(route('home'))->post(route('login'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('authenticated users can logout', function () {
    $user = User::factory()->customer()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('home'));
    $this->assertGuest();
});

test('guests cannot access protected ticket routes', function () {
    $this->get(route('tickets.index'))->assertRedirect(route('login'));
});
