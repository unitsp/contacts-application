<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactBookController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;

// API Versioning Prefix
Route::prefix('v1')->group(function () {

    // Auth Routes
    Route::post('register', RegisterController::class)->name('auth.register');
    Route::post('login', LoginController::class)->name('auth.login');

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

        Route::prefix('contact-books/{contact_book}')->middleware(['hasBook'])->group(function () {
            Route::apiResource('contacts', ContactController::class)->names([
                'index' => 'contacts.index',
                'store' => 'contacts.store',
                'show' => 'contacts.show',
                'update' => 'contacts.update',
                'destroy' => 'contacts.destroy',
            ]);
        });

        Route::get('contacts/{contact}/history', [ContactController::class, 'history'])
            ->name('contacts.history');

    });
});
