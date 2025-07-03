<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

// Redirect root to admin
Route::redirect('/', '/admin');

// Admin Authentication Routes
Route::prefix('admin')->name('admin.')->group(function () {
    // Guest routes (not authenticated)
    Route::middleware('guest')->group(function () {
        Route::get('login', [AdminController::class, 'showLogin'])->name('login');
        Route::post('login', [AdminController::class, 'login'])->name('login.post');
    });

    // Protected admin routes (authenticated + admin)
    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::get('dashboard', [AdminController::class, 'index'])->name('dashboard.alt');
        Route::get('users', [AdminController::class, 'users'])->name('users');
        Route::post('users/{user}/limit', [AdminController::class, 'updateLimit'])->name('users.update-limit');

        // Analysis management
        Route::get('analysis/{analysis}', [AdminController::class, 'showAnalysis'])->name('analysis.show');
        Route::delete('analysis/{analysis}', [AdminController::class, 'deleteAnalysis'])->name('analysis.delete');

        // User management
        Route::delete('users/{user}', [AdminController::class, 'deleteUser'])->name('users.delete');
        Route::get('users/{user}/analyses', [AdminController::class, 'getUserAnalyses'])->name('users.analyses');

        Route::post('logout', [AdminController::class, 'logout'])->name('logout');
    });
});

// Fallback login route for Laravel's default auth
Route::get('/login', [AdminController::class, 'showLogin'])->name('login');
