<?php

use App\Enums\UserRole;
use App\Models\User;

test('login page is rendered for guests', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('auth/login'));
});

test('clients can authenticate with the seeded test account', function () {
    $this->seed();

    $response = $this->post(route('login'), [
        'email' => 'test@swiftfix.com',
        'password' => 'password',
        'remember' => true,
    ]);

    $response->assertRedirect(route('home'));
    $this->assertAuthenticated();

    expect(auth()->user()?->email)->toBe('test@swiftfix.com')
        ->and(auth()->user()?->role)->toBe(UserRole::Customer);
});

test('technicians are redirected to the dashboard after login', function () {
    $technician = User::factory()->technician()->create([
        'email' => 'tech.login@example.com',
        'password' => 'Password1!',
    ]);

    $response = $this->post(route('login'), [
        'email' => $technician->email,
        'password' => 'Password1!',
    ]);

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($technician);
});

test('admins are redirected to categories after login', function () {
    $admin = User::factory()->admin()->create([
        'email' => 'admin.login@example.com',
        'password' => 'Password1!',
    ]);

    $response = $this->post(route('login'), [
        'email' => $admin->email,
        'password' => 'Password1!',
    ]);

    $response->assertRedirect(route('categories.index'));
    $this->assertAuthenticatedAs($admin);
});

test('login requires a valid email and password', function () {
    $response = $this->from(route('login'))->post(route('login'), [
        'email' => '',
        'password' => '',
    ]);

    $response->assertSessionHasErrors(['email', 'password']);
    $this->assertGuest();
});

test('login fails with invalid credentials', function () {
    $user = User::factory()->customer()->create([
        'email' => 'wrong-pass@example.com',
        'password' => 'Password1!',
    ]);

    $response = $this->from(route('login'))->post(route('login'), [
        'email' => $user->email,
        'password' => 'not-the-password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});
