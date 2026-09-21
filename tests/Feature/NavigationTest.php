<?php

use App\Models\User;
use App\Models\Workshop;
use Inertia\Testing\AssertableInertia as Assert;

test('home page renders for guests with auth links available via shared props', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('auth.user', null));
});

test('authenticated users can open primary navigation destinations', function () {
    $customer = User::factory()->customer()->create();

    $this->actingAs($customer)->get(route('home'))->assertOk();
    $this->actingAs($customer)->get(route('tickets.index'))->assertOk();
    $this->actingAs($customer)->get(route('tickets.create'))->assertOk();
    $this->actingAs($customer)->get(route('categories.index'))->assertOk();
});

test('guests can reach the workshops directory and profile pages', function () {
    $workshop = Workshop::factory()->create();

    $this->get(route('workshops.index'))->assertOk();
    $this->get(route('workshops.show', $workshop))->assertOk();
});

test('login and register routes remain reachable for guests', function () {
    $this->get(route('login'))->assertOk();
    $this->get(route('register'))->assertOk();
});
