<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketReviewController;
use App\Http\Controllers\TicketUpdateController;
use App\Http\Controllers\WorkshopController;
use App\Http\Controllers\WorkshopProfileController;
use App\Http\Controllers\WorkshopReviewController;
use App\Http\Controllers\WorkshopServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/workshops', [WorkshopController::class, 'index'])->name('workshops.index');
Route::get('/workshops/{workshop}', [WorkshopController::class, 'show'])->name('workshops.show');

Route::get('/about', fn () => Inertia::render('about'))->name('about');
Route::get('/contact', fn () => Inertia::render('contact'))->name('contact');

Route::middleware('guest')->group(function (): void {
    Route::get('/register', fn () => Inertia::render('auth/register'))->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::get('/login', fn () => Inertia::render('auth/login'))->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:login');

    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->middleware('throttle:password-reset')
        ->name('password.email');

    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function (): void {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('role:technician')
        ->name('dashboard');

    Route::get('/dashboard/workshop', [WorkshopProfileController::class, 'edit'])
        ->middleware('role:technician')
        ->name('dashboard.workshop.edit');
    Route::patch('/dashboard/workshop', [WorkshopProfileController::class, 'update'])
        ->middleware('role:technician')
        ->name('dashboard.workshop.update');

    Route::post('/dashboard/workshop/services', [WorkshopServiceController::class, 'store'])
        ->middleware('role:technician')
        ->name('dashboard.workshop.services.store');
    Route::patch('/dashboard/workshop/services/{workshopService}', [WorkshopServiceController::class, 'update'])
        ->middleware('role:technician')
        ->name('dashboard.workshop.services.update');
    Route::delete('/dashboard/workshop/services/{workshopService}', [WorkshopServiceController::class, 'destroy'])
        ->middleware('role:technician')
        ->name('dashboard.workshop.services.destroy');

    Route::get('/dashboard/reviews', [WorkshopReviewController::class, 'index'])
        ->middleware('role:technician')
        ->name('dashboard.reviews.index');
    Route::patch('/dashboard/reviews/{workshopReview}', [WorkshopReviewController::class, 'update'])
        ->middleware('role:technician')
        ->name('dashboard.reviews.update');

    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::get('/tickets/create', [TicketController::class, 'create'])->name('tickets.create');
    Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');
    Route::get('/tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
    Route::patch('/tickets/{ticket}', [TicketController::class, 'update'])->name('tickets.update');
    Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy'])->name('tickets.destroy');

    Route::post('/tickets/{ticket}/updates', [TicketUpdateController::class, 'store'])
        ->name('tickets.updates.store');

    Route::post('/tickets/{ticket}/review', [TicketReviewController::class, 'store'])
        ->name('tickets.review.store');

    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])
        ->middleware('role:admin')
        ->name('categories.store');
    Route::patch('/categories/{category}', [CategoryController::class, 'update'])
        ->middleware('role:admin')
        ->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
        ->middleware('role:admin')
        ->name('categories.destroy');
});
