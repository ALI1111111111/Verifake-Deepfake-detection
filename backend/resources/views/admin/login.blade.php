<!doctype html>
<html>
<head>
    <title>Admin Login</title>
 <link href="https://cdn.jsdelivr.net/npm/tailwindcss@^3.4/dist/tailwind.min.css" rel="stylesheet">

</head>
<body class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white p-6 rounded shadow w-full max-w-sm">
        <h1 class="text-xl font-semibold mb-4 text-center">Admin Login</h1>
        @if($errors->any())
            <div class="text-red-600 mb-4">{{ $errors->first() }}</div>
        @endif
        <form method="POST" action="{{ url('admin/login') }}" class="space-y-3">
            @csrf
            <input type="email" name="email" placeholder="Email" class="border p-2 w-full rounded">
            <input type="password" name="password" placeholder="Password" class="border p-2 w-full rounded">
            <button class="bg-blue-600 text-white p-2 rounded w-full">Login</button>
        </form>
    </div>

</body>
</html>
