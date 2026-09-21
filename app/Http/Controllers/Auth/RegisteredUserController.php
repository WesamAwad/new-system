<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class RegisteredUserController extends Controller
{
    public function store(RegisterRequest $request): RedirectResponse
    {
        $validated = $request->safe()->only([
            'name',
            'email',
            'phone',
            'city',
            'address',
            'password',
            'role',
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'city' => $validated['city'] ?? null,
            'address' => $validated['address'] ?? null,
            'password' => $validated['password'],
            'role' => UserRole::from($validated['role']),
        ]);

        event(new Registered($user));

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->intended($this->homePathFor($user));
    }

    private function homePathFor(User $user): string
    {
        return match ($user->role) {
            UserRole::Admin => route('categories.index'),
            UserRole::Technician => route('tickets.index'),
            UserRole::Customer => route('home'),
        };
    }
}
