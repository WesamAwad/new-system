<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * @return array<string, mixed>
 */
function validRegistrationPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'خالد السبيعي',
        'email' => 'new.client@example.com',
        'phone' => '501234567',
        'city' => 'الرياض (متاح التوصيل الفوري)',
        'address' => 'النرجس',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
        'role' => UserRole::Customer->value,
        'terms' => true,
    ], $overrides);
}

test('register page is rendered for guests', function () {
    $this->get(route('register'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('auth/register'));
});

test('successful registration creates a hashed user and redirects', function () {
    $response = $this->post(route('register'), validRegistrationPayload());

    $response->assertRedirect(route('home'));
    $this->assertAuthenticated();

    $user = User::query()->where('email', 'new.client@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->name)->toBe('خالد السبيعي')
        ->and($user->phone)->toBe('501234567')
        ->and($user->city)->toBe('الرياض (متاح التوصيل الفوري)')
        ->and($user->address)->toBe('النرجس')
        ->and($user->role)->toBe(UserRole::Customer)
        ->and(Hash::check('Password1!', $user->password))->toBeTrue();
});

test('technicians can register with the technician role', function () {
    $response = $this->post(route('register'), validRegistrationPayload([
        'email' => 'new.tech@example.com',
        'role' => UserRole::Technician->value,
    ]));

    $response->assertRedirect(route('tickets.index'));

    $user = User::query()->where('email', 'new.tech@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->role)->toBe(UserRole::Technician);
});

test('client role alias maps to customer', function () {
    $this->post(route('register'), validRegistrationPayload([
        'email' => 'alias.client@example.com',
        'role' => 'client',
    ]))->assertRedirect(route('home'));

    expect(User::query()->where('email', 'alias.client@example.com')->first()?->role)
        ->toBe(UserRole::Customer);
});

test('duplicate email returns a validation error', function () {
    User::factory()->customer()->create([
        'email' => 'taken@example.com',
    ]);

    $response = $this->from(route('register'))->post(
        route('register'),
        validRegistrationPayload(['email' => 'taken@example.com']),
    );

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('password confirmation mismatch and short passwords fail validation', function () {
    $this->from(route('register'))
        ->post(route('register'), validRegistrationPayload([
            'email' => 'mismatch@example.com',
            'password_confirmation' => 'Different1!',
        ]))
        ->assertSessionHasErrors('password');

    $this->from(route('register'))
        ->post(route('register'), validRegistrationPayload([
            'email' => 'short@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]))
        ->assertSessionHasErrors('password');

    $this->assertGuest();
});

test('required fields are validated', function () {
    $response = $this->from(route('register'))->post(route('register'), [
        'name' => '',
        'email' => '',
        'phone' => '',
        'password' => '',
        'password_confirmation' => '',
        'role' => '',
        'terms' => false,
    ]);

    $response->assertSessionHasErrors(['name', 'email', 'phone', 'password', 'role', 'terms']);
    $this->assertGuest();
});
