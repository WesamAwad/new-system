<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Inertia\Testing\AssertableInertia as Assert;

test('forgot password page renders', function () {
    $this->get(route('password.request'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('auth/forgot-password'));
});

test('password reset link can be requested', function () {
    Notification::fake();

    $user = User::factory()->customer()->create([
        'email' => 'reset.me@example.com',
    ]);

    $this->from(route('password.request'))
        ->post(route('password.email'), [
            'email' => $user->email,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    Notification::assertSentTo($user, ResetPassword::class);
});

test('password can be reset with valid token', function () {
    Notification::fake();

    $user = User::factory()->customer()->create([
        'email' => 'reset.token@example.com',
        'password' => 'OldPassword1!',
    ]);

    $this->post(route('password.email'), [
        'email' => $user->email,
    ]);

    Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use ($user) {
        $response = $this->get(route('password.reset', [
            'token' => $notification->token,
            'email' => $user->email,
        ]));

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('auth/reset-password')
                ->where('email', $user->email));

        $this->post(route('password.store'), [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'NewPassword1!',
            'password_confirmation' => 'NewPassword1!',
        ])->assertRedirect(route('login'));

        expect(Password::broker()->getRepository()->exists($user, $notification->token))->toBeFalse();

        $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'NewPassword1!',
        ])->assertRedirect(route('home'));

        return true;
    });
});
