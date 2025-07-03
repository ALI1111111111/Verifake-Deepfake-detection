<?php

namespace App\Http\Controllers;

use App\Models\Analysis;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
                return back()->withErrors(['email' => 'Unauthorized access. Admin privileges required.']);
            }

            return redirect()->route('admin.dashboard');
        }

        return back()->withErrors(['email' => 'Invalid credentials']);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login')->with('success', 'Successfully logged out.');
    }

    public function index()
    {
        return $this->dashboard();
    }

    public function dashboard()
    {
        // Dashboard statistics - SQLite compatible
        $stats = [
            'total_users' => User::count(),
            'total_analyses' => Analysis::count(),
            'today_analyses' => Analysis::whereDate('created_at', today())->count(),
            'active_users' => User::whereHas('analyses', function($query) {
                $query->where('created_at', '>=', now()->subDays(7));
            })->count(),
        ];

        // Service usage statistics
        $usage = Analysis::select('service')
            ->selectRaw('count(*) as count')
            ->groupBy('service')
            ->pluck('count', 'service')
            ->toArray();

        // Recent analyses with pagination
        $analyses = Analysis::with('user')
            ->latest()
            ->take(10)
            ->get();

        // Daily usage for chart (SQLite compatible)
        $dailyUsage = Analysis::selectRaw("date(created_at) as date, count(*) as count")
            ->where('created_at', '>=', now()->subDays(6))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return view('admin.dashboard', compact('analyses', 'usage', 'stats', 'dailyUsage'));
    }

    public function users()
    {
        $users = User::withCount('analyses')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        return view('admin.users', compact('users'));
    }

    public function updateLimit(Request $request, User $user)
    {
        $data = $request->validate([
            'api_limit' => 'required|integer|min:1|max:10000',
        ]);

        $user->update($data);

        return back()->with('success', 'User API limit updated successfully.');
    }

    public function analytics()
    {
        // Keep analytics simple for now - can be expanded later
        return redirect()->route('admin.dashboard')->with('info', 'Analytics data is available on the dashboard.');
    }

    public function settings()
    {
        // Keep settings simple for now - can be expanded later
        return redirect()->route('admin.dashboard')->with('info', 'Settings page is under development.');
    }

    public function showAnalysis(Analysis $analysis)
    {
        $analysis->load('user');

        return response()->json([
            'id' => $analysis->id,
            'service' => $analysis->service,
            'result' => $analysis->result,
            'file_url' => $analysis->file_path ? asset('storage/' . $analysis->file_path) : null,
            'created_at' => $analysis->created_at,
            'user' => [
                'id' => $analysis->user->id,
                'name' => $analysis->user->name,
                'email' => $analysis->user->email,
            ]
        ]);
    }

    public function deleteAnalysis(Analysis $analysis)
    {
        try {
            // Delete associated file if exists
            if ($analysis->file_path && \Storage::disk('public')->exists($analysis->file_path)) {
                \Storage::disk('public')->delete($analysis->file_path);
            }

            $analysis->delete();

            return response()->json(['success' => true, 'message' => 'Analysis deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error deleting analysis.']);
        }
    }

    public function deleteUser(User $user)
    {
        try {
            if ($user->is_admin) {
                return response()->json(['success' => false, 'message' => 'Cannot delete admin user.']);
            }

            // Delete user's analyses and associated files
            $analyses = $user->analyses;
            foreach ($analyses as $analysis) {
                if ($analysis->file_path && \Storage::disk('public')->exists($analysis->file_path)) {
                    \Storage::disk('public')->delete($analysis->file_path);
                }
            }

            $user->delete(); // This will cascade delete analyses due to foreign key constraints

            return response()->json(['success' => true, 'message' => 'User deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error deleting user.']);
        }
    }

    public function getUserAnalyses(User $user)
    {
        $analyses = $user->analyses()->latest()->get()->map(function($analysis) {
            return [
                'id' => $analysis->id,
                'service' => $analysis->service,
                'result' => $analysis->result,
                'file_path' => $analysis->file_path,
                'file_url' => $analysis->file_path ? asset('storage/' . $analysis->file_path) : null,
                'created_at' => $analysis->created_at,
            ];
        });

        return response()->json(['analyses' => $analyses]);
    }
}
