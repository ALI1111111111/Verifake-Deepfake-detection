<!doctype html>
<html>
<head>
    <title>Users</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@^3.4/dist/tailwind.min.css" rel="stylesheet">
    <link href="{{ asset('css/admin-dashboard.css') }}" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div class="admin-container">
        <div class="admin-card">
            <div class="admin-header">Users</div>
            <nav class="admin-nav">
                <a href="/admin">Dashboard</a>
            </nav>
            <div class="admin-table-wrapper">
            <table class="admin-table mb-4">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Analyses</th>
                    <th>Limit</th>
                    <th>Usage</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                <tr>
                    <td>{{ $user->id }}</td>
                    <td>{{ $user->email }}</td>
                    <td>{{ $user->analyses_count }}</td>
                    <td>{{ $user->api_limit }}</td>
                    <td>{{ $user->api_usage }}</td>
                    <td>
                        <form method="POST" action="{{ url('admin/users/'.$user->id.'/limit') }}" class="admin-form-inline">
                            @csrf
                            <input type="number" name="api_limit" value="{{ $user->api_limit }}" min="0" />
                            <button>Save</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
            </table>
            </div>
            <div class="admin-pagination">
                {{ $users->links() }}
            </div>
        </div>
    </div>
</body>
</html>
