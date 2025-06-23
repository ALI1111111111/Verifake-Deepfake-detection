<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Http\Controllers\AdminController;

Route::get('admin/login', [AdminController::class, 'showLogin'])->name('admin.login');
Route::post('admin/login', [AdminController::class, 'login']);

Route::middleware('auth')->group(function () {
    Route::get('admin', [AdminController::class, 'index']);
    Route::post('admin/logout', [AdminController::class, 'logout'])->name('admin.logout');
});
