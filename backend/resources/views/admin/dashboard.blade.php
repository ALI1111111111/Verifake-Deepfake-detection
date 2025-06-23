<!doctype html>
<html>
<head>
    <title>Admin Dashboard</title>
    @vite('resources/css/app.css')
</head>
<body class="p-4">
    <h1 class="text-2xl mb-4">Admin Dashboard</h1>
    <nav class="mb-4 space-x-4">
        <a href="{{ url('admin/users') }}" class="text-blue-600 underline">Users</a>
        <form method="POST" action="{{ route('admin.logout') }}" class="inline">
            @csrf
            <button class="bg-gray-700 text-white px-2 py-1">Logout</button>
        </form>
    </nav>
    <div class="mb-6">
        <h2 class="text-lg mb-2">API Usage</h2>
        <ul class="list-disc pl-6">
            <li>Deepfake: {{ $usage['deepfake'] }}</li>
            <li>Nudity: {{ $usage['nudity'] }}</li>
            <li>Face: {{ $usage['face'] }}</li>
        </ul>
    </div>
    <table class="min-w-full border text-sm">
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
                    @php $score = $analysis->result['score'] ?? null; @endphp
                    {{ $score === null ? '-' : ($score > 0.5 ? 'Likely Fake' : 'Likely Real') }}
                </td>
                <td class="border px-2 py-1">{{ $analysis->created_at }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    {{ $analyses->links() }}
</body>
</html>
