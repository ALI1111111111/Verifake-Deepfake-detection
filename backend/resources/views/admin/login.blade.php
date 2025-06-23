<!doctype html>
<html>
<head>
    <title>Admin Login</title>
    @vite('resources/css/app.css')
</head>
<body class="p-4">
@if($errors->any())
<div class="text-red-600 mb-4">{{ $errors->first() }}</div>
@endif
<form method="POST" action="{{ url('admin/login') }}" class="space-y-3">
    @csrf
    <input type="email" name="email" placeholder="Email" class="border p-2 w-full">
    <input type="password" name="password" placeholder="Password" class="border p-2 w-full">
    <button class="bg-blue-500 text-white p-2">Login</button>
</form>
</body>
</html>
