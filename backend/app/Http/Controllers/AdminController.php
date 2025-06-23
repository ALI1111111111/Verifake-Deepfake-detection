<?php

namespace App\Http\Controllers;

use App\Models\Analysis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function showLogin()
    {
        return view('admin.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            if (!Auth::user()->is_admin) {
                Auth::logout();
                return back()->withErrors(['email' => 'Not authorized']);
            }
            return redirect()->intended('/admin');
        }

        return back()->withErrors(['email' => 'Invalid credentials']);
    }

    public function index()
    {
        abort_unless(Auth::check() && Auth::user()->is_admin, 403);
        $analyses = Analysis::with('user')->latest()->paginate(10);
        return view('admin.dashboard', compact('analyses'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/admin/login');
    }
}
