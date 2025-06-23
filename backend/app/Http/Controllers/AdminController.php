<?php

namespace App\Http\Controllers;

use App\Models\Analysis;
use App\Models\User;
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
        $usage = [
            'deepfake' => Analysis::where('service', 'deepfake')->count(),
            'nudity' => Analysis::where('service', 'nudity')->count(),
            'face' => Analysis::where('service', 'face')->count(),
        ];
        return view('admin.dashboard', compact('analyses', 'usage'));
    }

    public function users()
    {
        abort_unless(Auth::check() && Auth::user()->is_admin, 403);
        $users = User::withCount('analyses')->paginate(10);
        return view('admin.users', compact('users'));
    }

    public function updateLimit(Request $request, User $user)
    {
        abort_unless(Auth::check() && Auth::user()->is_admin, 403);
        $data = $request->validate([
            'api_limit' => 'required|integer|min:1',
        ]);
        $user->update($data);
        return back();
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/admin/login');
    }
}
