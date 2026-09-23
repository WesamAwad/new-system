<?php

use App\Models\User;
use App\Models\Workshop;
use Inertia\Testing\AssertableInertia as Assert;

test('technician without a workshop sees an empty profile form', function () {
    $technician = User::factory()->technician()->create();

    $this->actingAs($technician)
        ->get(route('dashboard.workshop.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/workshop')
            ->where('workshop', null));
});

test('technician can create their workshop profile', function () {
    $technician = User::factory()->technician()->create();

    $this->actingAs($technician)
        ->patch(route('dashboard.workshop.update'), [
            'name' => 'ورشة الاختبار',
            'bio' => 'وصف تجريبي',
            'city' => 'غزة',
            'address' => 'شارع تجريبي',
            'is_available' => '1',
        ])
        ->assertRedirect(route('dashboard.workshop.edit'))
        ->assertSessionHas('success');

    $workshop = Workshop::query()->where('user_id', $technician->id)->first();

    expect($workshop)->not->toBeNull()
        ->and($workshop->name)->toBe('ورشة الاختبار')
        ->and($workshop->city)->toBe('غزة')
        ->and($workshop->is_available)->toBeTrue();
});

test('technician can view and update their existing workshop profile', function () {
    $technician = User::factory()->technician()->create();
    $workshop = Workshop::factory()->for($technician)->create([
        'name' => 'الاسم القديم',
        'is_available' => true,
    ]);

    $this->actingAs($technician)
        ->get(route('dashboard.workshop.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/workshop')
            ->where('workshop.name', 'الاسم القديم'));

    $this->actingAs($technician)
        ->patch(route('dashboard.workshop.update'), [
            'name' => 'الاسم الجديد',
            'bio' => $workshop->bio,
            'city' => $workshop->city,
            'address' => $workshop->address,
            'is_available' => '0',
        ])
        ->assertRedirect(route('dashboard.workshop.edit'));

    expect($workshop->fresh()->name)->toBe('الاسم الجديد')
        ->and($workshop->fresh()->is_available)->toBeFalse();
});

test('updating a workshop profile requires the required fields', function () {
    $technician = User::factory()->technician()->create();

    $this->actingAs($technician)
        ->patch(route('dashboard.workshop.update'), [])
        ->assertSessionHasErrors(['name', 'city', 'address', 'is_available']);
});

test('customers and admins cannot access the workshop profile screen', function () {
    $customer = User::factory()->customer()->create();
    $admin = User::factory()->admin()->create();

    $this->actingAs($customer)->get(route('dashboard.workshop.edit'))->assertForbidden();
    $this->actingAs($admin)->get(route('dashboard.workshop.edit'))->assertForbidden();
});

test('guests are redirected to login for the workshop profile screen', function () {
    $this->get(route('dashboard.workshop.edit'))->assertRedirect(route('login'));
});
