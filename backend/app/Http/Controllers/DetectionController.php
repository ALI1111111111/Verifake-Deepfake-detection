<?php

namespace App\Http\Controllers;

use App\Models\Analysis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class DetectionController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->analyses()->latest()->get();
    }

    public function analyze(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
        ]);

        $path = $request->file('file')->store('analyses', 'public');

        $response = Http::attach('media', Storage::disk('public')->get($path), basename($path))
            ->post('https://api.sightengine.com/1.0/check.json', [
                'models' => 'deepfake',
                'api_user' => config('services.sightengine.user'),
                'api_secret' => config('services.sightengine.secret'),
            ]);

        $analysis = Analysis::create([
            'user_id' => $request->user()->id,
            'file_path' => $path,
            'result' => $response->json(),
        ]);

        return $analysis;
    }
}
