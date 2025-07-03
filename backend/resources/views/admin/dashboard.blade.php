@extends('admin.layout')

@section('title', 'Admin Dashboard')
@section('page-title', 'Dashboard')

@section('content')
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Total Users -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                    <i class="fas fa-users text-blue-600 text-xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Total Users</p>
                    <p class="text-2xl font-bold text-gray-900">{{ number_format($stats['total_users']) }}</p>
                </div>
            </div>
        </div>

        <!-- Total Analyses -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg">
                    <i class="fas fa-chart-line text-green-600 text-xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Total Analyses</p>
                    <p class="text-2xl font-bold text-gray-900">{{ number_format($stats['total_analyses']) }}</p>
                </div>
            </div>
        </div>

        <!-- Today's Analyses -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-2 bg-yellow-100 rounded-lg">
                    <i class="fas fa-calendar-day text-yellow-600 text-xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Today's Analyses</p>
                    <p class="text-2xl font-bold text-gray-900">{{ number_format($stats['today_analyses']) }}</p>
                </div>
            </div>
        </div>

        <!-- Active Users -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-2 bg-purple-100 rounded-lg">
                    <i class="fas fa-user-check text-purple-600 text-xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Active Users (7d)</p>
                    <p class="text-2xl font-bold text-gray-900">{{ number_format($stats['active_users']) }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Daily Usage Chart -->
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Daily Usage (Last 7 Days)</h3>
            <div class="h-64">
                <canvas id="dailyChart"></canvas>
            </div>
        </div>

        <!-- Service Usage -->
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Service Usage</h3>
            <div class="space-y-3">
                @if(count($usage) > 0)
                    @foreach($usage as $service => $count)
                        @php
                            $total = array_sum($usage);
                            $percentage = $total > 0 ? ($count / $total) * 100 : 0;
                            $colors = [
                                'deepfake' => ['bg' => 'bg-red-500', 'text' => 'text-red-600'],
                                'face' => ['bg' => 'bg-blue-500', 'text' => 'text-blue-600'],
                                'wad' => ['bg' => 'bg-yellow-500', 'text' => 'text-yellow-600'],
                                'offensive' => ['bg' => 'bg-purple-500', 'text' => 'text-purple-600'],
                                'properties' => ['bg' => 'bg-green-500', 'text' => 'text-green-600'],
                                'celebrity' => ['bg' => 'bg-pink-500', 'text' => 'text-pink-600']
                            ];
                            $color = $colors[$service] ?? ['bg' => 'bg-gray-500', 'text' => 'text-gray-600'];
                        @endphp
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-3 h-3 {{ $color['bg'] }} rounded-full"></div>
                                <span class="text-sm font-medium text-gray-700 capitalize">{{ str_replace('_', ' ', $service) }}</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-16 bg-gray-200 rounded-full h-2">
                                    <div class="{{ $color['bg'] }} h-2 rounded-full" style="width: {{ $percentage }}%"></div>
                                </div>
                                <span class="text-sm {{ $color['text'] }} w-8 text-right font-medium">{{ $count }}</span>
                            </div>
                        </div>
                    @endforeach
                @else
                    <p class="text-gray-500 text-center py-8">No analysis data available yet.</p>
                @endif
            </div>
        </div>
    </div>

    <!-- Recent Analyses -->
    <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Recent Analyses</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($analyses as $analysis)
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{{ $analysis->id }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ $analysis->user->name }}</div>
                                <div class="text-sm text-gray-500">{{ $analysis->user->email }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                    @if($analysis->service === 'deepfake') bg-red-100 text-red-800
                                    @elseif($analysis->service === 'face') bg-blue-100 text-blue-800
                                    @elseif($analysis->service === 'wad') bg-yellow-100 text-yellow-800
                                    @elseif($analysis->service === 'offensive') bg-purple-100 text-purple-800
                                    @elseif($analysis->service === 'properties') bg-green-100 text-green-800
                                    @elseif($analysis->service === 'celebrity') bg-pink-100 text-pink-800
                                    @else bg-gray-100 text-gray-800 @endif">
                                    {{ ucfirst($analysis->service) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($analysis->file_path)
                                    <img src="{{ asset('storage/' . $analysis->file_path) }}"
                                         alt="Preview"
                                         class="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity"
                                         loading="lazy"
                                         onclick="showAnalysisDetail({{ $analysis->id }})" />
                                @else
                                    <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                        <i class="fas fa-image text-gray-400 text-sm"></i>
                                    </div>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                @if($analysis->service === 'deepfake')
                                    @php $score = $analysis->result['type']['deepfake'] ?? null; @endphp
                                    @if($score !== null)
                                        <span class="font-medium {{ $score > 0.5 ? 'text-red-600' : 'text-green-600' }}">
                                            {{ $score > 0.5 ? 'Likely Fake' : 'Likely Real' }}
                                        </span>
                                        <div class="text-xs text-gray-500">{{ number_format($score * 100, 1) }}%</div>
                                    @else
                                        <span class="text-gray-500">Processing...</span>
                                    @endif
                                @elseif($analysis->service === 'face')
                                    @php $faces = $analysis->result['faces'] ?? []; @endphp
                                    <span class="font-medium text-blue-600">
                                        {{ count($faces) }} face(s)
                                    </span>
                                    @if(count($faces) > 0)
                                        <div class="text-xs text-gray-500">Click to view</div>
                                    @endif
                                @elseif($analysis->service === 'wad')
                                    @php
                                        $weapons = $analysis->result['weapon'] ?? 0;
                                        $alcohol = $analysis->result['alcohol'] ?? 0;
                                        $drugs = $analysis->result['drugs'] ?? 0;
                                    @endphp
                                    @if($weapons > 0.5 || $alcohol > 0.5 || $drugs > 0.5)
                                        <span class="font-medium text-red-600">Detected</span>
                                        <div class="text-xs text-gray-500">
                                            @if($weapons > 0.5) W:{{ number_format($weapons * 100, 0) }}% @endif
                                            @if($alcohol > 0.5) A:{{ number_format($alcohol * 100, 0) }}% @endif
                                            @if($drugs > 0.5) D:{{ number_format($drugs * 100, 0) }}% @endif
                                        </div>
                                    @else
                                        <span class="font-medium text-green-600">Clean</span>
                                    @endif
                                @elseif($analysis->service === 'offensive')
                                    @php $prob = $analysis->result['prob'] ?? 0; @endphp
                                    <span class="font-medium {{ $prob > 0.5 ? 'text-red-600' : 'text-green-600' }}">
                                        {{ $prob > 0.5 ? 'Offensive' : 'Safe' }}
                                    </span>
                                    <div class="text-xs text-gray-500">{{ number_format($prob * 100, 1) }}%</div>
                                @elseif($analysis->service === 'celebrity')
                                    @php $celebs = $analysis->result['faces'] ?? []; @endphp
                                    @if(count($celebs) > 0)
                                        <span class="font-medium text-purple-600">Found {{ count($celebs) }}</span>
                                        <div class="text-xs text-gray-500">Click to view</div>
                                    @else
                                        <span class="font-medium text-gray-600">No matches</span>
                                    @endif
                                @elseif($analysis->service === 'properties')
                                    <span class="font-medium text-green-600">Analyzed</span>
                                    <div class="text-xs text-gray-500">Click to view</div>
                                @else
                                    <span class="text-gray-500">View details</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $analysis->created_at->format('M j, H:i') }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex items-center space-x-2">
                                    <button onclick="showAnalysisDetail({{ $analysis->id }})"
                                            class="text-blue-600 hover:text-blue-800 text-xs font-medium">
                                        <i class="fas fa-eye mr-1"></i>View
                                    </button>
                                    <button onclick="deleteAnalysis({{ $analysis->id }})"
                                            class="text-red-600 hover:text-red-800 text-xs font-medium ml-2">
                                        <i class="fas fa-trash mr-1"></i>Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                                No analyses found
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- Analysis Detail Modal -->
    <div id="analysisModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-lg font-semibold text-gray-900">Analysis Details</h3>
                    <button onclick="closeAnalysisModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div id="analysisContent" class="p-6">
                    <!-- Content will be loaded here -->
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
// Simple responsive chart
const ctx = document.getElementById('dailyChart').getContext('2d');
const dailyData = @json($dailyUsage);

// Prepare chart data
const labels = [];
const data = [];

// Generate last 7 days
for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

    const dayData = dailyData.find(d => d.date === dateStr);
    data.push(dayData ? dayData.count : 0);
}

new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Analyses',
            data: data,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// Analysis Modal Functions
function showAnalysisDetail(analysisId) {
    document.getElementById('analysisModal').classList.remove('hidden');
    document.getElementById('analysisContent').innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i></div>';

    fetch(`/admin/analysis/${analysisId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('analysisContent').innerHTML = generateAnalysisDetailHTML(data);
        })
        .catch(error => {
            document.getElementById('analysisContent').innerHTML = '<div class="text-center py-4 text-red-600">Error loading analysis details</div>';
        });
}

function closeAnalysisModal() {
    document.getElementById('analysisModal').classList.add('hidden');
}

function deleteAnalysis(analysisId) {
    if (confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
        fetch(`/admin/analysis/${analysisId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                alert('Error deleting analysis');
            }
        })
        .catch(error => {
            alert('Error deleting analysis');
        });
    }
}

function generateAnalysisDetailHTML(analysis) {
    let html = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h4 class="text-md font-semibold mb-3">Image</h4>
                <div class="relative">
                    <img src="${analysis.file_url}" alt="Analysis Image" class="w-full rounded-lg shadow-sm border" id="analysisImage">
                    <canvas id="overlayCanvas" class="absolute top-0 left-0 w-full h-full pointer-events-none"></canvas>
                </div>
            </div>
            <div>
                <h4 class="text-md font-semibold mb-3">Details</h4>
                <div class="space-y-3">
                    <div><span class="font-medium">ID:</span> #${analysis.id}</div>
                    <div><span class="font-medium">Service:</span> <span class="capitalize">${analysis.service}</span></div>
                    <div><span class="font-medium">User:</span> ${analysis.user.name} (${analysis.user.email})</div>
                    <div><span class="font-medium">Date:</span> ${new Date(analysis.created_at).toLocaleString()}</div>
                </div>

                <h4 class="text-md font-semibold mt-6 mb-3">Results</h4>
                <div id="resultDetails">
                    ${generateServiceSpecificResults(analysis)}
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        if (analysis.service === 'face' || analysis.service === 'celebrity') {
            drawFaceOverlays(analysis);
        }
    }, 100);

    return html;
}

function generateServiceSpecificResults(analysis) {
    const result = analysis.result;

    switch(analysis.service) {
        case 'deepfake':
            const score = result.type?.deepfake || 0;
            return `
                <div class="bg-${score > 0.5 ? 'red' : 'green'}-50 p-4 rounded-lg">
                    <div class="text-lg font-semibold text-${score > 0.5 ? 'red' : 'green'}-800">
                        ${score > 0.5 ? 'Likely Deepfake' : 'Likely Authentic'}
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                        Confidence: ${(score * 100).toFixed(1)}%
                    </div>
                </div>
            `;

        case 'face':
            const faces = result.faces || [];
            return `
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-lg font-semibold text-blue-800">
                        ${faces.length} Face(s) Detected
                    </div>
                    ${faces.map((face, index) => `
                        <div class="mt-2 text-sm">
                            <strong>Face ${index + 1}:</strong>
                            ${face.attributes ? `
                                Age: ~${Math.round((face.attributes.age?.min || 0 + face.attributes.age?.max || 0) / 2)} years,
                                Gender: ${face.attributes.gender?.value || 'Unknown'}
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;

        case 'wad':
            const weapons = result.weapon || 0;
            const alcohol = result.alcohol || 0;
            const drugs = result.drugs || 0;
            return `
                <div class="space-y-2">
                    <div class="flex justify-between p-2 bg-gray-50 rounded">
                        <span>Weapons:</span>
                        <span class="font-semibold ${weapons > 0.5 ? 'text-red-600' : 'text-green-600'}">
                            ${(weapons * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div class="flex justify-between p-2 bg-gray-50 rounded">
                        <span>Alcohol:</span>
                        <span class="font-semibold ${alcohol > 0.5 ? 'text-red-600' : 'text-green-600'}">
                            ${(alcohol * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div class="flex justify-between p-2 bg-gray-50 rounded">
                        <span>Drugs:</span>
                        <span class="font-semibold ${drugs > 0.5 ? 'text-red-600' : 'text-green-600'}">
                            ${(drugs * 100).toFixed(1)}%
                        </span>
                    </div>
                </div>
            `;

        case 'offensive':
            const prob = result.prob || 0;
            return `
                <div class="bg-${prob > 0.5 ? 'red' : 'green'}-50 p-4 rounded-lg">
                    <div class="text-lg font-semibold text-${prob > 0.5 ? 'red' : 'green'}-800">
                        ${prob > 0.5 ? 'Offensive Content Detected' : 'Content is Safe'}
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                        Probability: ${(prob * 100).toFixed(1)}%
                    </div>
                </div>
            `;

        case 'celebrity':
            const celebs = result.faces || [];
            return `
                <div class="bg-purple-50 p-4 rounded-lg">
                    <div class="text-lg font-semibold text-purple-800">
                        ${celebs.length > 0 ? `${celebs.length} Celebrity Match(es)` : 'No Celebrities Detected'}
                    </div>
                    ${celebs.map((celeb, index) => `
                        <div class="mt-2 text-sm">
                            <strong>${celeb.celebrity || `Person ${index + 1}`}:</strong>
                            ${celeb.prob ? `${(celeb.prob * 100).toFixed(1)}% confidence` : ''}
                        </div>
                    `).join('')}
                </div>
            `;

        default:
            return '<div class="text-gray-500">Raw result data available</div>';
    }
}

function drawFaceOverlays(analysis) {
    const img = document.getElementById('analysisImage');
    const canvas = document.getElementById('overlayCanvas');

    if (!img || !canvas || !analysis.result.faces) return;

    const ctx = canvas.getContext('2d');

    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;

        const faces = analysis.result.faces;
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;

        faces.forEach((face, index) => {
            if (face.region) {
                const x = (face.region.left / 100) * img.width;
                const y = (face.region.top / 100) * img.height;
                const w = ((face.region.right - face.region.left) / 100) * img.width;
                const h = ((face.region.bottom - face.region.top) / 100) * img.height;

                ctx.strokeRect(x, y, w, h);

                // Add label
                ctx.fillStyle = '#3B82F6';
                ctx.font = '12px Arial';
                ctx.fillRect(x, y - 20, 60, 20);
                ctx.fillStyle = 'white';
                ctx.fillText(`Face ${index + 1}`, x + 5, y - 7);
            }
        });
    };

    if (img.complete) {
        img.onload();
    }
}

// Close modal when clicking outside
document.getElementById('analysisModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeAnalysisModal();
    }
});
</script>
@endpush
