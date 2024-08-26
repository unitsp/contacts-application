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
    Route::get('/contact-books', [ContactBookController::class, 'index']);
    Route::post('/contact-books', [ContactBookController::class, 'store']);
    Route::get('/contact-books/{id}', [ContactBookController::class, 'show']);
    Route::put('/contact-books/{id}', [ContactBookController::class, 'update']);
    Route::delete('/contact-books/{id}', [ContactBookController::class, 'destroy']);
    Route::post('/contact-books/{id}/share', [ContactBookController::class, 'share']);

    // Contacts Routes
    Route::post('/contact-books/{contactBookId}/contacts', [ContactController::class, 'store']);
    Route::get('/contact-books/{contactBookId}/contacts/{id}', [ContactController::class, 'show']);
    Route::put('/contact-books/{contactBookId}/contacts/{id}', [ContactController::class, 'update']);
    Route::delete('/contact-books/{contactBookId}/contacts/{id}', [ContactController::class, 'destroy']);
});
