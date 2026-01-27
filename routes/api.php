<?php

use App\Http\Controllers\DaController;
use App\Http\Controllers\DcdController;
use App\Http\Controllers\LocationController;
use Illuminate\Support\Facades\Route;

Route::get('da/', [DaController::class, 'index']);
Route::get('da/register', [DaController::class, 'register']);

Route::get('dcd/', [DcdController::class, 'index']);
Route::get('dcd/register', [DcdController::class, 'register']);

// Location API routes
Route::get('locations/countries', [LocationController::class, 'countries']);
Route::get('locations/counties', [LocationController::class, 'counties']);
Route::get('locations/subcounties', [LocationController::class, 'subcounties']);
Route::get('locations/wards', [LocationController::class, 'wards']);
