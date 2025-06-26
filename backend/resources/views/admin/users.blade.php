<!doctype html>
<html>
<head>
    <title>Users</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@^3.4/dist/tailwind.min.css" rel="stylesheet">
            @vite(['resources/css/app.css', 'resources/js/app.js'])

</head>
<body class="bg-gray-50 p-6">
    <div class="container mx-auto">
        <h1 class="text-2xl mb-4 font-semibold">Users</h1>
        <nav class="mb-4 space-x-4">
            <a href="/admin" class="text-blue-600 underline">Dashboard</a>
        </nav>
        <table class="min-w-full border text-sm mb-4 bg-white rounded shadow">
        <thead>
            <tr>
                <th class="border px-2 py-1">ID</th>
                <th class="border px-2 py-1">Email</th>
                <th class="border px-2 py-1">Analyses</th>
                <th class="border px-2 py-1">Limit</th>
                <th class="border px-2 py-1">Usage</th>
                <th class="border px-2 py-1">Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
            <tr>
                <td class="border px-2 py-1">{{ $user->id }}</td>
                <td class="border px-2 py-1">{{ $user->email }}</td>
                <td class="border px-2 py-1">{{ $user->analyses_count }}</td>
                <td class="border px-2 py-1">{{ $user->api_limit }}</td>
                <td class="border px-2 py-1">{{ $user->api_usage }}</td>
                <td class="border px-2 py-1">
                    <form method="POST" action="{{ url('admin/users/'.$user->id.'/limit') }}" class="flex items-center space-x-1">
                        @csrf
                        <input type="number" name="api_limit" value="{{ $user->api_limit }}" class="border p-1 w-20" />
                        <button class="bg-blue-500 text-white px-2">Save</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
        <div class="mt-4">
            {{ $users->links() }}
        </div>
    </div>
</body>
</html>
