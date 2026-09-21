<?php

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;

test('registration ignores privilege escalation via role parameter', function () {
    $response = $this->post(route('register'), [
        'name' => 'Attacker',
        'email' => 'attacker@example.com',
        'phone' => '0501112233',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
        'role' => 'admin',
        'terms' => true,
    ]);

    $response->assertSessionHasErrors('role');
    expect(User::query()->where('email', 'attacker@example.com')->exists())->toBeFalse();
});

test('registration creates customer accounts when role is customer', function () {
    $this->post(route('register'), [
        'name' => 'Normal User',
        'email' => 'normal@example.com',
        'phone' => '0509988776',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
        'role' => 'customer',
        'terms' => true,
    ])->assertRedirect(route('home'));

    $user = User::query()->where('email', 'normal@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->role)->toBe(UserRole::Customer);
});

test('idor customer cannot view another customers ticket', function () {
    $owner = User::factory()->customer()->create();
    $intruder = User::factory()->customer()->create();
    $ticket = Ticket::factory()->for($owner, 'customer')->create();

    $this->actingAs($intruder)
        ->get(route('tickets.show', $ticket))
        ->assertForbidden();
});

test('idor customer cannot post updates on another customers ticket', function () {
    $owner = User::factory()->customer()->create();
    $intruder = User::factory()->customer()->create();
    $ticket = Ticket::factory()->for($owner, 'customer')->create();

    $this->actingAs($intruder)
        ->post(route('tickets.updates.store', $ticket), [
            'message' => 'Injected update',
        ])
        ->assertForbidden();
});

test('technician cannot create tickets', function () {
    $technician = User::factory()->technician()->create();
    $category = Category::factory()->create();

    $this->actingAs($technician)
        ->post(route('tickets.store'), [
            'category_id' => $category->id,
            'title' => 'Should fail',
            'description' => 'Technicians cannot open tickets.',
            'address' => 'Riyadh',
            'priority' => 'low',
        ])
        ->assertForbidden();
});

test('mass assignment cannot set avatar through registration payload', function () {
    $this->post(route('register'), [
        'name' => 'Avatar Probe',
        'email' => 'avatar@example.com',
        'phone' => '0505556677',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
        'role' => 'customer',
        'terms' => true,
        'avatar' => 'https://evil.test/x.js',
    ])->assertRedirect(route('home'));

    $user = User::query()->where('email', 'avatar@example.com')->first();

    expect($user->avatar)->toBeNull();
});

test('customers cannot assign tickets to technicians', function () {
    $customer = User::factory()->customer()->create();
    $technician = User::factory()->technician()->create();
    $ticket = Ticket::factory()->for($customer, 'customer')->create();

    $this->actingAs($customer)
        ->patch(route('tickets.update', $ticket), [
            'assigned_to' => $technician->id,
            'title' => $ticket->title,
            'description' => $ticket->description,
            'address' => $ticket->address,
            'priority' => $ticket->priority->value,
        ]);

    expect($ticket->fresh()->assigned_to)->toBeNull();
});

test('env example documents mysql without secrets and gitignore protects env', function () {
    $gitignore = file_get_contents(base_path('.gitignore'));
    $example = file_get_contents(base_path('.env.example'));

    expect($gitignore)->toContain('.env')
        ->and($example)->toContain('DB_CONNECTION=mysql')
        ->and($example)->not->toMatch('/APP_KEY=base64:.+/');
});
