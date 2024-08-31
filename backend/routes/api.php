<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactBookController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;


Route::post('register', RegisterController::class);
Route::post('login', LoginController::class);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    // Contact Books Routes
    Route::apiResource('contact-books', ContactBookController::class);

    // Additional ContactBook Routes
    Route::post('/contact-books/{contact_book}/share', [ContactBookController::class, 'share']);

    // Contacts Routes
    Route::prefix('contact-books/{contact_book}')->group(function () {
        Route::apiResource('contacts', ContactController::class);
    });
});

