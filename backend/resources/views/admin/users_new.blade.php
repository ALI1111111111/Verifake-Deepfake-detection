@extends('admin.layout')

@section('title', 'User Management')
@section('page-title', 'User Management')

@section('content')
    <!-- Users Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                    <i class="fas fa-users text-blue-600 text-xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Total Users</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $users->total() }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg">
                    <i class="fas fa-user-check text-green-600 text-xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Admin Users</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $users->where('is_admin', true)->count() }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-2 bg-purple-100 rounded-lg">
                    <i class="fas fa-chart-line text-purple-600 text-xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Active This Week</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $users->where('analyses_count', '>', 0)->count() }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">All Users</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Analyses</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Daily Limit</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Today's Usage</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($users as $user)
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ $user->id }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                        <i class="fas fa-user text-gray-600 text-xs"></i>
                                    </div>
                                    <div class="text-sm font-medium text-gray-900">{{ $user->name }}</div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $user->email }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($user->is_admin)
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                        Admin
                                    </span>
                                @else
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                        User
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span class="font-medium">{{ $user->analyses_count ?? 0 }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ $user->daily_limit ?? 10 }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span class="font-medium {{ ($user->api_calls_today ?? 0) >= ($user->daily_limit ?? 10) ? 'text-red-600' : 'text-green-600' }}">
                                    {{ $user->api_calls_today ?? 0 }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $user->created_at->format('M j, Y') }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex flex-col space-y-2">
                                    <form method="POST" action="{{ route('admin.users.update-limit', $user) }}" class="flex items-center space-x-2">
                                        @csrf
                                        <input type="number"
                                               name="daily_limit"
                                               value="{{ $user->daily_limit ?? 10 }}"
                                               min="1"
                                               max="1000"
                                               class="w-16 px-2 py-1 text-sm border border-gray-300 rounded">
                                        <button type="submit" class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Update
                                        </button>
                                    </form>
                                    <div class="flex items-center space-x-2">
                                        <button onclick="viewUserAnalyses({{ $user->id }}, '{{ $user->name }}')"
                                                class="text-green-600 hover:text-green-800 text-xs font-medium">
                                            <i class="fas fa-chart-line mr-1"></i>View Analyses
                                        </button>
                                        @if(!$user->is_admin)
                                            <button onclick="deleteUser({{ $user->id }}, '{{ $user->name }}', {{ $user->analyses_count ?? 0 }})"
                                                    class="text-red-600 hover:text-red-800 text-xs font-medium">
                                                <i class="fas fa-trash mr-1"></i>Delete
                                            </button>
                                        @endif
                                    </div>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="9" class="px-6 py-4 text-center text-gray-500">
                                No users found
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($users->hasPages())
            <div class="px-6 py-4 border-t border-gray-200">
                {{ $users->links() }}
            </div>
        @endif
    </div>

    <!-- User Analyses Modal -->
    <div id="userAnalysesModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg max-w-6xl w-full max-h-screen overflow-y-auto">
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-lg font-semibold text-gray-900" id="userAnalysesTitle">User Analyses</h3>
                    <button onclick="closeUserAnalysesModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div id="userAnalysesContent" class="p-6">
                    <!-- Content will be loaded here -->
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
function viewUserAnalyses(userId, userName) {
    document.getElementById('userAnalysesModal').classList.remove('hidden');
    document.getElementById('userAnalysesTitle').textContent = `${userName}'s Analyses`;
    document.getElementById('userAnalysesContent').innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i></div>';
    document.getElementById('userAnalysesContent').dataset.userId = userId;

    fetch(`/admin/users/${userId}/analyses`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('userAnalysesContent').innerHTML = generateUserAnalysesHTML(data);
        })
        .catch(error => {
            document.getElementById('userAnalysesContent').innerHTML = '<div class="text-center py-4 text-red-600">Error loading user analyses</div>';
        });
}

function closeUserAnalysesModal() {
    document.getElementById('userAnalysesModal').classList.add('hidden');
}

function deleteUser(userId, userName, analysesCount) {
    let message = `Are you sure you want to delete user "${userName}"?`;
    if (analysesCount > 0) {
        message += `\n\nThis user has ${analysesCount} analysis(es) that will also be permanently deleted.`;
    }
    message += '\n\nThis action cannot be undone.';

    if (confirm(message)) {
        fetch(`/admin/users/${userId}`, {
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
                alert(data.message || 'Error deleting user');
            }
        })
        .catch(error => {
            alert('Error deleting user');
        });
    }
}

function deleteUserAnalysis(analysisId) {
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
                // Reload the modal content
                const userId = document.getElementById('userAnalysesContent').dataset.userId;
                const userName = document.getElementById('userAnalysesTitle').textContent.replace("'s Analyses", "");
                viewUserAnalyses(userId, userName);
            } else {
                alert('Error deleting analysis');
            }
        })
        .catch(error => {
            alert('Error deleting analysis');
        });
    }
}

function generateUserAnalysesHTML(data) {
    const analyses = data.analyses;

    if (analyses.length === 0) {
        return '<div class="text-center py-8 text-gray-500">No analyses found for this user.</div>';
    }

    return `
        <div class="mb-4 text-sm text-gray-600">
            Total: ${analyses.length} analysis(es)
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${analyses.map(analysis => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #${analysis.id}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                    ${getServiceColor(analysis.service)}">
                                    ${analysis.service.charAt(0).toUpperCase() + analysis.service.slice(1)}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                ${analysis.file_path ?
                                    `<img src="${analysis.file_url}" alt="Preview" class="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-200">` :
                                    `<div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                        <i class="fas fa-image text-gray-400 text-sm"></i>
                                    </div>`
                                }
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${generateResultSummary(analysis)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${new Date(analysis.created_at).toLocaleDateString()}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="deleteUserAnalysis(${analysis.id})"
                                        class="text-red-600 hover:text-red-800 text-xs font-medium">
                                    <i class="fas fa-trash mr-1"></i>Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getServiceColor(service) {
    const colors = {
        'deepfake': 'bg-red-100 text-red-800',
        'face': 'bg-blue-100 text-blue-800',
        'wad': 'bg-yellow-100 text-yellow-800',
        'offensive': 'bg-purple-100 text-purple-800',
        'properties': 'bg-green-100 text-green-800',
        'celebrity': 'bg-pink-100 text-pink-800'
    };
    return colors[service] || 'bg-gray-100 text-gray-800';
}

function generateResultSummary(analysis) {
    const result = analysis.result;

    switch(analysis.service) {
        case 'deepfake':
            const score = result.type?.deepfake || 0;
            return `<span class="font-medium ${score > 0.5 ? 'text-red-600' : 'text-green-600'}">
                ${score > 0.5 ? 'Likely Fake' : 'Likely Real'} (${(score * 100).toFixed(1)}%)
            </span>`;

        case 'face':
            const faces = result.faces || [];
            return `<span class="font-medium text-blue-600">${faces.length} face(s)</span>`;

        case 'wad':
            const weapons = result.weapon || 0;
            const alcohol = result.alcohol || 0;
            const drugs = result.drugs || 0;
            const maxScore = Math.max(weapons, alcohol, drugs);
            return `<span class="font-medium ${maxScore > 0.5 ? 'text-red-600' : 'text-green-600'}">
                ${maxScore > 0.5 ? 'Detected' : 'Clean'}
            </span>`;

        case 'offensive':
            const prob = result.prob || 0;
            return `<span class="font-medium ${prob > 0.5 ? 'text-red-600' : 'text-green-600'}">
                ${prob > 0.5 ? 'Offensive' : 'Safe'} (${(prob * 100).toFixed(1)}%)
            </span>`;

        case 'celebrity':
            const celebs = result.faces || [];
            return `<span class="font-medium text-purple-600">
                ${celebs.length > 0 ? `Found ${celebs.length}` : 'No matches'}
            </span>`;

        default:
            return '<span class="text-gray-500">Analyzed</span>';
    }
}

// Close modal when clicking outside
document.getElementById('userAnalysesModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeUserAnalysesModal();
    }
});
</script>
@endpush
