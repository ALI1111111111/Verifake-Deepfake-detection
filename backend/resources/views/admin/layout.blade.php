<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin Dashboard') - VeriFake</title>

    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="bg-gray-100" x-data="{ sidebarOpen: false }">

    <!-- Mobile Menu Overlay -->
    <div x-show="sidebarOpen"
         x-cloak
         @click="sidebarOpen = false"
         class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"></div>

    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0"
         :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">

        <!-- Logo -->
        <div class="flex items-center h-16 px-6 bg-blue-600">
            <div class="flex items-center space-x-3">
                <i class="fas fa-shield-alt text-white text-xl"></i>
                <span class="text-xl font-bold text-white">VeriFake Admin</span>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="mt-6">
            <a href="{{ route('admin.dashboard') }}"
               class="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 {{ request()->routeIs('admin.dashboard*') ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : '' }}">
                <i class="fas fa-tachometer-alt mr-3"></i>
                Dashboard
            </a>

            <a href="{{ route('admin.users') }}"
               class="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 {{ request()->routeIs('admin.users*') ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : '' }}">
                <i class="fas fa-users mr-3"></i>
                Users
            </a>

            <div class="mt-8 px-6">
                <form method="POST" action="{{ route('admin.logout') }}">
                    @csrf
                    <button type="submit" class="flex items-center w-full px-0 py-2 text-gray-500 hover:text-red-600">
                        <i class="fas fa-sign-out-alt mr-3"></i>
                        Logout
                    </button>
                </form>
            </div>
        </nav>
    </div>

    <!-- Main Content -->
    <div class="md:ml-64">
        <!-- Top Header -->
        <header class="bg-white shadow-sm">
            <div class="flex items-center justify-between h-16 px-4">
                <!-- Mobile Menu Button -->
                <button @click="sidebarOpen = true" class="text-gray-500 hover:text-gray-700 md:hidden">
                    <i class="fas fa-bars text-xl"></i>
                </button>

                <!-- Page Title -->
                <h1 class="text-xl font-semibold text-gray-900">@yield('page-title', 'Dashboard')</h1>

                <!-- User Info -->
                <div class="flex items-center space-x-3">
                    <span class="text-sm text-gray-600">{{ Auth::user()->name }}</span>
                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-white text-sm"></i>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content Area -->
        <main class="p-4 md:p-6">
            <!-- Flash Messages -->
            @if(session('success'))
                <div class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    <i class="fas fa-check-circle mr-2"></i>{{ session('success') }}
                </div>
            @endif

            @if(session('error'))
                <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <i class="fas fa-exclamation-circle mr-2"></i>{{ session('error') }}
                </div>
            @endif

            @if($errors->any())
                <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <ul class="list-disc list-inside">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @yield('content')
        </main>
    </div>

    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    @stack('scripts')
</body>
</html>
