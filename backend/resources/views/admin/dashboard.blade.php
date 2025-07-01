<!doctype html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@^3.4/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 p-6">
    <div class="container mx-auto">
        <h1 class="text-2xl mb-4 font-semibold">Admin Dashboard</h1>
        <nav class="mb-4 space-x-4">
            <a href="{{ url('admin/users') }}" class="text-blue-600 underline">Users</a>
            <form method="POST" action="{{ route('admin.logout') }}" class="inline">
                @csrf
                <button class="bg-gray-700 text-white px-2 py-1 rounded">Logout</button>
            </form>
        </nav>
        <div class="mb-6">
            <h2 class="text-lg mb-2 font-medium">API Usage</h2>
            <ul class="list-disc pl-6">
                <li>Deepfake: {{ $usage['deepfake'] }}</li>
                <li>Face: {{ $usage['face'] }}</li>
                <li>WAD: {{ $usage['wad'] }}</li>
                <li>Offensive: {{ $usage['offensive'] }}</li>
                <li>Properties: {{ $usage['properties'] }}</li>
                <li>Celebrity: {{ $usage['celebrity'] }}</li>
            </ul>
        </div>
        <table class="min-w-full border text-sm bg-white rounded shadow">
        <thead>
            <tr>
                <th class="border px-2 py-1">ID</th>
                <th class="border px-2 py-1">User</th>
                <th class="border px-2 py-1">Service</th>
                <th class="border px-2 py-1">Preview</th>
                <th class="border px-2 py-1">Result</th>
                <th class="border px-2 py-1">Created</th>
            </tr>
        </thead>
        <tbody>
            @foreach($analyses as $analysis)
            <tr>
                <td class="border px-2 py-1">{{ $analysis->id }}</td>
                <td class="border px-2 py-1">{{ $analysis->user->email }}</td>
                <td class="border px-2 py-1">{{ $analysis->service }}</td>
                <td class="border px-2 py-1"><img src="{{ asset('storage/'.$analysis->file_path) }}" class="h-12" /></td>
                <td class="border px-2 py-1">
                    @if ($analysis->service === 'deepfake')
                        @php $score = $analysis->result['score'] ?? null; @endphp
                        {{ $score === null ? '-' : ($score > 0.5 ? 'Likely Fake' : 'Likely Real') }}
                    @elseif ($analysis->service === 'face')
                        @php $c = isset($analysis->result['faces']) ? count($analysis->result['faces']) : 0; @endphp
                        {{ $c === 0 ? 'No face' : $c . ' face(s)' }}
                    @elseif ($analysis->service === 'wad')
                        @php $w = $analysis->result; @endphp
                        Weapon {{ $w['weapon'] ?? 0 }}, Alcohol {{ $w['alcohol'] ?? 0 }}, Drugs {{ $w['drugs'] ?? 0 }}
                @elseif ($analysis->service === 'offensive')
                    @php $off = $analysis->result['offensive']['prob'] ?? null; @endphp
                    {{ $off === null ? '-' : round($off * 100) . '% offensive' }}
                @elseif ($analysis->service === 'properties')
                    {{ $analysis->result['width'] ?? '?'}}x{{ $analysis->result['height'] ?? '?' }}
                @elseif ($analysis->service === 'celebrity')
                    @php $names = collect($analysis->result['celebrities'] ?? [])->pluck('name')->join(', '); @endphp
                    {{ $names ?: 'None' }}
                @else
                    -
                @endif
                </td>
                <td class="border px-2 py-1">{{ $analysis->created_at }}</td>
            </tr>
            @endforeach
        </tbody>
        </table>
        <div class="mt-4">
            {{ $analyses->links() }}
        </div>
    </div>
</body>
</html>
