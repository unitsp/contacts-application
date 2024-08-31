<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactBookController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PusherAuthController;

// API Versioning Prefix
Route::prefix('v1')->group(function () {

    // Auth Routes
    Route::post('auth/register', RegisterController::class)->name('auth.register');
    Route::post('auth/login', LoginController::class)->name('auth.login');

    // Routes that require Sanctum Authentication
    Route::middleware('auth:sanctum')->group(function () {

        // Retrieve Authenticated User
        Route::get('/user', function (Request $request) {
            return $request->user();
        })->name('user.show');

        // Contact Books Routes
        Route::apiResource('contact-books', ContactBookController::class)->names([
            'index' => 'contact-books.index',
            'store' => 'contact-books.store',
            'show' => 'contact-books.show',
            'update' => 'contact-books.update',
            'destroy' => 'contact-books.destroy',
        ]);

        // Additional ContactBook Routes
        Route::post('/contact-books/{contact_book}/share', [ContactBookController::class, 'share'])
            ->name('contact-books.share');

        // Contacts Routes within Contact Books
        Route::prefix('contact-books/{contact_book}')->group(function () {
            Route::apiResource('contacts', ContactController::class)->names([
                'index' => 'contacts.index',
                'store' => 'contacts.store',
                'show' => 'contacts.show',
                'update' => 'contacts.update',
                'destroy' => 'contacts.destroy',
            ]);
        });

        // Pusher Authentication Route
        Route::post('/pusher/auth', PusherAuthController::class)->name('pusher.auth');
    });
});
