<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DaController;

Route::get('da/', [DaController::class, 'index']);
Route::get('da/register', [DaController::class, 'register']);
