<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;


Route::redirect('/', '/admin/login');
Route::get('/login', [AdminController::class, 'showLogin'])->name('login');
Route::get('/login', [AdminController::class, 'showLogin'])->name('admin.login');




Route::get('admin/login', [AdminController::class, 'showLogin'])->name('admin.login');
Route::post('admin/login', [AdminController::class, 'login']);

Route::middleware('auth')->group(function () {
    Route::get('admin', [AdminController::class, 'index']);
    Route::get('admin/users', [AdminController::class, 'users']);
    Route::post('admin/users/{user}/limit', [AdminController::class, 'updateLimit']);
    Route::post('admin/logout', [AdminController::class, 'logout'])->name('admin.logout');
});
