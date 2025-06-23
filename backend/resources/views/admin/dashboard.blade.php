<!doctype html>
<html>
<head>
    <title>Admin Dashboard</title>
    @vite('resources/css/app.css')
</head>
<body class="p-4">
    <h1 class="text-2xl mb-4">Admin Dashboard</h1>
    <form method="POST" action="{{ route('admin.logout') }}">
        @csrf
        <button class="bg-gray-700 text-white p-2 mb-4">Logout</button>
    </form>
    <table class="min-w-full border text-sm">
        <thead>
            <tr>
                <th class="border px-2 py-1">ID</th>
                <th class="border px-2 py-1">User</th>
 <th class="border px-2 py-1">Score</th>



                <th class="border px-2 py-1">Created</th>
            </tr>
        </thead>
        <tbody>
            @foreach($analyses as $analysis)
            <tr>
                <td class="border px-2 py-1">{{ $analysis->id }}</td>
                <td class="border px-2 py-1">{{ $analysis->user->email }}</td>

                <td class="border px-2 py-1">{{ $analysis->result['score'] ?? '-' }}</td>



                <td class="border px-2 py-1">{{ $analysis->created_at }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    {{ $analyses->links() }}
</body>
</html>
