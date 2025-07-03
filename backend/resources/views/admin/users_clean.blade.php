@extends('admin.layout')

@section('title', 'User Management')
@section('page-title', 'User Management')

@section('content')
    <!-- Users Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-users text-blue-600 text-xl"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-600">Total Users</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $users->total() }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-user-check text-green-600 text-xl"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-600">Active Users</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $users->where('analyses_count', '>', 0)->count() }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-crown text-purple-600 text-xl"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-600">Admin Users</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $users->where('is_admin', true)->count() }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-clock text-yellow-600 text-xl"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-600">New Today</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $users->where('created_at', '>=', today())->count() }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Users List</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analyses</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Limit</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Today's Usage</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($users as $user)
                        <tr class="hover:bg-gray-50 transition-colors duration-150">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                                        <span class="text-white font-medium text-sm">
                                            {{ strtoupper(substr($user->name ?? $user->email, 0, 2)) }}
                                        </span>
                                    </div>
                                    <div>
                                        <div class="flex items-center">
                                            <div class="text-sm font-medium text-gray-900">{{ $user->name ?? 'N/A' }}</div>
                                            @if($user->is_admin)
                                                <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                    <i class="fas fa-crown mr-1"></i>
                                                    Admin
                                                </span>
                                            @endif
                                        </div>
                                        <div class="text-sm text-gray-500">{{ $user->email }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($user->analyses_count > 0)
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <i class="fas fa-circle mr-1 text-green-400"></i>
                                        Active
                                    </span>
                                @else
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        <i class="fas fa-circle mr-1 text-gray-400"></i>
                                        Inactive
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="text-sm font-medium text-gray-900">{{ $user->analyses_count }}</div>
                                    @if($user->analyses_count > 0)
                                        <div class="ml-2 text-xs text-gray-500">
                                            <i class="fas fa-chart-line"></i>
                                        </div>
                                    @endif
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm text-gray-900">{{ $user->api_limit ?? 1000 }}</span>
                                    <button onclick="editLimit({{ $user->id }}, {{ $user->api_limit ?? 1000 }})"
                                            class="text-blue-600 hover:text-blue-700 text-xs">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm {{ ($user->api_usage ?? 0) >= ($user->api_limit ?? 1000) ? 'text-red-600' : 'text-green-600' }} font-medium">
                                    {{ $user->api_usage ?? 0 }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $user->created_at->format('M j, Y') }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex items-center space-x-2">
                                    <button onclick="viewUserAnalyses({{ $user->id }}, '{{ addslashes($user->name) }}')"
                                            class="text-green-600 hover:text-green-700 text-xs font-medium"
                                            title="View Analyses">
                                        <i class="fas fa-chart-line mr-1"></i>View
                                    </button>
                                    @if(!$user->is_admin)
                                        <button onclick="deleteUser({{ $user->id }}, '{{ addslashes($user->name) }}', {{ $user->analyses_count }})"
                                                class="text-red-600 hover:text-red-700 text-xs font-medium"
                                                title="Delete User">
                                            <i class="fas fa-trash mr-1"></i>Delete
                                        </button>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
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

    <!-- Edit Limit Modal -->
    <div id="editLimitModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 hidden">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg max-w-md w-full">
                <form id="editLimitForm" method="POST">
                    @csrf
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <i class="fas fa-edit text-blue-600"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900">Edit API Limit</h3>
                        </div>
                        <div class="mb-4">
                            <label for="api_limit" class="block text-sm font-medium text-gray-700 mb-2">API Limit per Day</label>
                            <input type="number"
                                   name="api_limit"
                                   id="api_limit"
                                   min="1"
                                   max="10000"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                            <p class="mt-1 text-sm text-gray-500">Maximum number of API calls this user can make per day.</p>
                        </div>
                    </div>
                    <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onclick="closeEditModal()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                            Update Limit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- User Analyses Modal -->
    <div id="userAnalysesModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 hidden">
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
    function editLimit(userId, currentLimit) {
        const modal = document.getElementById('editLimitModal');
        const form = document.getElementById('editLimitForm');
        const input = document.getElementById('api_limit');

        form.action = `/admin/users/${userId}/limit`;
        input.value = currentLimit;
        modal.classList.remove('hidden');
    }

    function closeEditModal() {
        document.getElementById('editLimitModal').classList.add('hidden');
    }

    function viewUserAnalyses(userId, userName) {
        const modal = document.getElementById('userAnalysesModal');
        const title = document.getElementById('userAnalysesTitle');
        const content = document.getElementById('userAnalysesContent');

        title.textContent = `Analyses for ${userName}`;
        content.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i></div>';
        modal.classList.remove('hidden');

        fetch(`/admin/users/${userId}/analyses`)
            .then(response => response.json())
            .then(data => {
                content.innerHTML = generateUserAnalysesHTML(data.analyses);
            })
            .catch(error => {
                content.innerHTML = '<div class="text-center py-8 text-red-600">Error loading analyses</div>';
            });
    }

    function closeUserAnalysesModal() {
        document.getElementById('userAnalysesModal').classList.add('hidden');
    }

    function deleteUser(userId, userName, analysesCount) {
        let message = `Are you sure you want to delete user "${userName}"?`;
        if (analysesCount > 0) {
            message += `\n\nWarning: This user has ${analysesCount} analysis(es) that will also be deleted. This action cannot be undone.`;
        }

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
        if (confirm('Are you sure you want to delete this analysis?')) {
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
                    // Remove the analysis row from the modal
                    document.getElementById(`analysis-row-${analysisId}`).remove();

                    // Update the count if no analyses left
                    const tbody = document.querySelector('#userAnalysesContent tbody');
                    if (tbody && tbody.children.length === 0) {
                        document.getElementById('userAnalysesContent').innerHTML = '<div class="text-center py-8 text-gray-500">No analyses found for this user</div>';
                    }
                } else {
                    alert('Error deleting analysis');
                }
            })
            .catch(error => {
                alert('Error deleting analysis');
            });
        }
    }

    function generateUserAnalysesHTML(analyses) {
        if (analyses.length === 0) {
            return '<div class="text-center py-8 text-gray-500">No analyses found for this user</div>';
        }

        let html = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
        `;

        analyses.forEach(analysis => {
            html += `
                <tr id="analysis-row-${analysis.id}" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #${analysis.id}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            ${analysis.service}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${analysis.file_url ?
                            `<img src="${analysis.file_url}" alt="Preview" class="w-12 h-12 object-cover rounded-lg border">` :
                            `<div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"><i class="fas fa-image text-gray-400"></i></div>`
                        }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${generateAnalysisResultSummary(analysis)}
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
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        return html;
    }

    function generateAnalysisResultSummary(analysis) {
        const result = analysis.result;

        switch(analysis.service) {
            case 'deepfake':
                const score = result.type?.deepfake || 0;
                return `<span class="font-medium ${score > 0.5 ? 'text-red-600' : 'text-green-600'}">${score > 0.5 ? 'Likely Fake' : 'Likely Real'}</span>`;

            case 'face':
                const faces = result.faces || [];
                return `<span class="font-medium text-blue-600">${faces.length} face(s)</span>`;

            case 'wad':
                const weapons = result.weapon || 0;
                const alcohol = result.alcohol || 0;
                const drugs = result.drugs || 0;
                if (weapons > 0.5 || alcohol > 0.5 || drugs > 0.5) {
                    return `<span class="font-medium text-red-600">Detected</span>`;
                } else {
                    return `<span class="font-medium text-green-600">Clean</span>`;
                }

            case 'offensive':
                const prob = result.prob || 0;
                return `<span class="font-medium ${prob > 0.5 ? 'text-red-600' : 'text-green-600'}">${prob > 0.5 ? 'Offensive' : 'Safe'}</span>`;

            case 'celebrity':
                const celebs = result.faces || [];
                return `<span class="font-medium text-purple-600">${celebs.length > 0 ? `Found ${celebs.length}` : 'No matches'}</span>`;

            default:
                return '<span class="text-gray-500">Processed</span>';
        }
    }

    // Close modals when clicking outside
    document.getElementById('editLimitModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditModal();
        }
    });

    document.getElementById('userAnalysesModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeUserAnalysesModal();
        }
    });
</script>
@endpush
