<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', []);
})->name('home');

Route::redirect('/login', '/');
Route::redirect('/register', '/');
Route::redirect('/dashboard', '/');
Route::redirect('/forgot-password', '/');
Route::redirect('/user/confirm-password', '/');
Route::redirect('/email/verify/{id}/{hash}', '/');


use App\Http\Controllers\DaController;

Route::get('da/', [DaController::class, 'index'])->name('da.index');
Route::get('da/register', [DaController::class, 'register'])->name('da.register');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
