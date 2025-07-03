@extends('admin.layout')

@section('title', 'Analytics')
@section('page-title', 'Analytics & Reports')

@section('content')
    <!-- Page Header -->
    <div class="mb-8">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
                <p class="mt-1 text-sm text-gray-600">Detailed insights and analytics for your platform</p>
            </div>
            <div class="flex items-center space-x-3">
                <select class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>All Time</option>
                </select>
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    <i class="fas fa-download mr-2"></i>
                    Export Report
                </button>
            </div>
        </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- User Growth -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">User Growth</h3>
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-user-plus text-blue-600 text-xl"></i>
                </div>
            </div>
            <canvas id="userGrowthChart" height="200"></canvas>
        </div>

        <!-- Service Popularity -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Service Popularity</h3>
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-chart-pie text-green-600 text-xl"></i>
                </div>
            </div>
            <canvas id="servicePopularityChart" height="200"></canvas>
        </div>

        <!-- Hourly Usage -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Usage by Hour</h3>
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-clock text-purple-600 text-xl"></i>
                </div>
            </div>
            <canvas id="hourlyUsageChart" height="200"></canvas>
        </div>
    </div>

    <!-- Detailed Analytics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Users -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Top Active Users</h3>
            </div>
            <div class="p-6">
                <!-- Placeholder for top users data -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                1
                            </div>
                            <div>
                                <div class="text-sm font-medium text-gray-900">user@example.com</div>
                                <div class="text-xs text-gray-500">Last active: 2 hours ago</div>
                            </div>
                        </div>
                        <div class="text-sm font-medium text-gray-900">42 analyses</div>
                    </div>
                    <!-- Add more top users here -->
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div class="p-6">
                <div class="space-y-4">
                    <div class="flex items-start">
                        <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                        <div class="flex-1">
                            <div class="text-sm text-gray-900">New user registration</div>
                            <div class="text-xs text-gray-500">2 minutes ago</div>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <div class="flex-1">
                            <div class="text-sm text-gray-900">Deepfake analysis completed</div>
                            <div class="text-xs text-gray-500">5 minutes ago</div>
                        </div>
                    </div>
                    <!-- Add more activities here -->
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
    const userGrowthData = @json($analytics['user_growth'] ?? []);

    new Chart(userGrowthCtx, {
        type: 'line',
        data: {
            labels: userGrowthData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'New Users',
                data: userGrowthData.map(d => d.count),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Service Popularity Chart
    const servicePopularityCtx = document.getElementById('servicePopularityChart').getContext('2d');
    const servicePopularityData = @json($analytics['service_popularity'] ?? []);

    new Chart(servicePopularityCtx, {
        type: 'doughnut',
        data: {
            labels: servicePopularityData.map(d => d.service.charAt(0).toUpperCase() + d.service.slice(1)),
            datasets: [{
                data: servicePopularityData.map(d => d.count),
                backgroundColor: [
                    '#EF4444', '#3B82F6', '#F59E0B',
                    '#8B5CF6', '#10B981', '#EC4899'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });

    // Hourly Usage Chart
    const hourlyUsageCtx = document.getElementById('hourlyUsageChart').getContext('2d');
    const hourlyUsageData = @json($analytics['hourly_usage'] ?? []);

    // Prepare 24-hour data
    const hourlyLabels = [];
    const hourlyCounts = [];

    for (let i = 0; i < 24; i++) {
        hourlyLabels.push(i + ':00');
        const hourData = hourlyUsageData.find(d => d.hour === i);
        hourlyCounts.push(hourData ? hourData.count : 0);
    }

    new Chart(hourlyUsageCtx, {
        type: 'bar',
        data: {
            labels: hourlyLabels,
            datasets: [{
                label: 'Analyses',
                data: hourlyCounts,
                backgroundColor: 'rgba(139, 92, 246, 0.8)',
                borderColor: 'rgb(139, 92, 246)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });
</script>
@endpush
