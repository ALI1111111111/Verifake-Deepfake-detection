<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DetectionController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
<<<<<<< HEAD
    Route::get('/user', [AuthController::class, 'me']);
=======
>>>>>>> main
    Route::get('/analyses', [DetectionController::class, 'index']);
    Route::post('/detect', [DetectionController::class, 'analyze']);
});

