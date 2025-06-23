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
            'service' => 'nullable|string',
        ]);

        $user = $request->user();
        if ($user->api_usage >= $user->api_limit) {
            return response()->json(['message' => 'API limit reached'], 429);
        }

        $service = $request->get('service', 'deepfake');
        $models = match ($service) {

            'face' => 'face-attributes',
            'wad' => 'wad',
            'offensive' => 'offensive',
            default => 'deepfake',
        };


        $path = $request->file('file')->store('analyses', 'public');

        $response = Http::attach('media', Storage::disk('public')->get($path), basename($path))
            ->post('https://api.sightengine.com/1.0/check.json', [
                'models' => $models,

                'api_user' => config('services.sightengine.user'),
                'api_secret' => config('services.sightengine.secret'),
            ]);


        if (!$response->successful()) {
            Storage::disk('public')->delete($path);
            return response()->json(['message' => 'Analysis failed'], 502);
        }

        $result = $response->json();

        $analysis = Analysis::create([
            'user_id' => $user->id,
            'file_path' => $path,
            'result' => $result,

            'service' => $service,
        ]);

        $user->increment('api_usage');

        return $analysis;
    }
}
