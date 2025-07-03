@extends('admin.layout')

@section('title', 'Settings')
@section('page-title', 'System Settings')

@section('content')
    <!-- Page Header -->
    <div class="mb-8">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">System Settings</h2>
                <p class="mt-1 text-sm text-gray-600">Manage system configuration and preferences</p>
            </div>
        </div>
    </div>

    <!-- Settings Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- General Settings -->
        <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">General Settings</h3>
                </div>
                <div class="p-6">
                    <form class="space-y-6">
                        <!-- Site Name -->
                        <div>
                            <label for="site_name" class="block text-sm font-medium text-gray-700">Site Name</label>
                            <input type="text"
                                   id="site_name"
                                   name="site_name"
                                   value="VeriFake Admin"
                                   class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </div>

                        <!-- Default User Limit -->
                        <div>
                            <label for="default_limit" class="block text-sm font-medium text-gray-700">Default User Daily Limit</label>
                            <input type="number"
                                   id="default_limit"
                                   name="default_limit"
                                   value="10"
                                   min="1"
                                   max="1000"
                                   class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <p class="mt-1 text-sm text-gray-500">Default daily analysis limit for new users</p>
                        </div>

                        <!-- Email Notifications -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Email Notifications</label>
                            <div class="mt-2 space-y-2">
                                <label class="flex items-center">
                                    <input type="checkbox" checked class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                    <span class="ml-2 text-sm text-gray-700">New user registrations</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" checked class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                    <span class="ml-2 text-sm text-gray-700">High usage alerts</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                    <span class="ml-2 text-sm text-gray-700">System errors</span>
                                </label>
                            </div>
                        </div>

                        <!-- Save Button -->
                        <div class="pt-4">
                            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                                Save Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- API Configuration -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">API Configuration</h3>
                </div>
                <div class="p-6">
                    <form class="space-y-6">
                        <!-- Sightengine API -->
                        <div>
                            <label for="sightengine_user" class="block text-sm font-medium text-gray-700">Sightengine User ID</label>
                            <input type="text"
                                   id="sightengine_user"
                                   name="sightengine_user"
                                   value="********"
                                   class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </div>

                        <div>
                            <label for="sightengine_secret" class="block text-sm font-medium text-gray-700">Sightengine Secret</label>
                            <input type="password"
                                   id="sightengine_secret"
                                   name="sightengine_secret"
                                   value="********"
                                   class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </div>

                        <!-- API Rate Limits -->
                        <div>
                            <label for="api_rate_limit" class="block text-sm font-medium text-gray-700">API Rate Limit (per minute)</label>
                            <input type="number"
                                   id="api_rate_limit"
                                   name="api_rate_limit"
                                   value="60"
                                   min="1"
                                   class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </div>

                        <!-- Save Button -->
                        <div class="pt-4">
                            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg">
                                Update API Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- System Status & Info -->
        <div class="space-y-6">

            <!-- System Status -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">System Status</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        <!-- Database -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">Database</span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <i class="fas fa-circle mr-1 text-green-400"></i>
                                Online
                            </span>
                        </div>

                        <!-- API Service -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">API Service</span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <i class="fas fa-circle mr-1 text-green-400"></i>
                                Running
                            </span>
                        </div>

                        <!-- Sightengine -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">Sightengine API</span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <i class="fas fa-circle mr-1 text-green-400"></i>
                                Connected
                            </span>
                        </div>

                        <!-- Storage -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">File Storage</span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <i class="fas fa-circle mr-1 text-yellow-400"></i>
                                75% Used
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-3">
                        <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200">
                            <i class="fas fa-download mr-2 text-gray-400"></i>
                            Export User Data
                        </button>
                        <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200">
                            <i class="fas fa-broom mr-2 text-gray-400"></i>
                            Clear Cache
                        </button>
                        <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200">
                            <i class="fas fa-database mr-2 text-gray-400"></i>
                            Backup Database
                        </button>
                        <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200">
                            <i class="fas fa-exclamation-triangle mr-2 text-red-400"></i>
                            System Maintenance
                        </button>
                    </div>
                </div>
            </div>

            <!-- System Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">System Information</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Version</span>
                            <span class="font-medium">v1.0.0</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Laravel</span>
                            <span class="font-medium">11.x</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">PHP</span>
                            <span class="font-medium">{{ PHP_VERSION }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Server</span>
                            <span class="font-medium">{{ php_uname('s') }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Uptime</span>
                            <span class="font-medium">24d 12h 34m</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
