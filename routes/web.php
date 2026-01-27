<?php

use App\Http\Controllers\DaController;
use App\Http\Controllers\DcdController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', []);
})->name('home');

Route::redirect('/login', '/');
Route::redirect('/register', '/');
Route::redirect('/dashboard', '/');
Route::redirect('/forgot-password', '/');
Route::redirect('/user/confirm-password', '/');
Route::redirect('/email/verify/{id}/{hash}', '/');

Route::get('da/', [DaController::class, 'index'])->name('da.index');
Route::get('da/register', [DaController::class, 'register'])->name('da.register');
Route::post('da/register', [DaController::class, 'store'])->name('da.store');

Route::get('dcd/', [DcdController::class, 'index'])->name('dcd.index');
Route::get('dcd/register', [DcdController::class, 'register'])->name('dcd.register');
Route::post('dcd/register', [DcdController::class, 'store'])->name('dcd.store');

// Client routes
use App\Http\Controllers\ClientController;
Route::get('client/', [ClientController::class, 'index'])->name('client.index');
Route::get('client/register', [ClientController::class, 'register'])->name('client.register');
Route::post('client/register', [ClientController::class, 'store'])->name('client.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
