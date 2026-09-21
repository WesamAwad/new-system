<?php

use App\Models\User;
use App\Models\Workshop;
use Inertia\Testing\AssertableInertia as Assert;

test('home landing page renders for guests with services and metrics', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('auth.user', null)
            ->has('services', 4)
            ->has('metrics', 3)
            ->has('featuredWorkshops')
            ->where('services.0.title', 'تبديل الشاشات المكسورة'));
});

test('home landing page only lists featured workshops', function () {
    Workshop::factory()->featured()->count(2)->create();
    Workshop::factory()->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('featuredWorkshops', 2));
});

test('home landing page renders for authenticated users', function () {
    $user = User::factory()->customer()->create();

    $this->actingAs($user)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('auth.user.id', $user->id)
            ->has('services')
            ->has('metrics'));
});

test('auth pages still render after landing page changes', function () {
    $this->get(route('login'))->assertOk();
    $this->get(route('register'))->assertOk();
});
