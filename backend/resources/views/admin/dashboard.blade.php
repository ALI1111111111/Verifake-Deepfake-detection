<!doctype html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@^3.4/dist/tailwind.min.css" rel="stylesheet">
    <link href="{{ asset('css/admin-dashboard.css') }}" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div class="admin-container">
        <div class="admin-card">
            <div class="admin-header">Admin Dashboard</div>
            <nav class="admin-nav">
                <a href="{{ url('admin/users') }}">Users</a>
                <form method="POST" action="{{ route('admin.logout') }}" style="display:inline;">
                    @csrf
                    <button type="submit">Logout</button>
                </form>
            </nav>
            <div class="mb-6">
                <div class="admin-section-title">API Usage</div>
                <ul class="admin-list">
                    <li>Deepfake: <b>{{ $usage['deepfake'] }}</b></li>
                    <li>Face: <b>{{ $usage['face'] }}</b></li>
                    <li>WAD: <b>{{ $usage['wad'] }}</b></li>
                    <li>Offensive: <b>{{ $usage['offensive'] }}</b></li>
                    <li>Properties: <b>{{ $usage['properties'] }}</b></li>
                    <li>Celebrity: <b>{{ $usage['celebrity'] }}</b></li>
                </ul>
            </div>
            <div class="admin-table-wrapper">
            <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Service</th>
                    <th>Preview</th>
                    <th>Result</th>
                    <th>Created</th>
                </tr>
            </thead>
            <tbody>
                @foreach($analyses as $analysis)
                <tr>
                    <td>{{ $analysis->id }}</td>
                    <td>{{ $analysis->user->email }}</td>
                    <td>{{ ucfirst($analysis->service) }}</td>
                    <td>
                        @if ($analysis->file_path)
                            <img src="{{ asset('storage/'.$analysis->file_path) }}" alt="Preview" loading="lazy" />
                        @else
                            <span style="color:#bbb;">No image</span>
                        @endif




                    </td>
                    <td>
                        @if ($analysis->service === 'deepfake')
                            @php $score = $analysis->result['type']['deepfake'] ?? null; @endphp
                            {{ $score === null ? '-' : ($score > 0.5 ? 'Likely Fake' : 'Likely Real') }}
                        @elseif ($analysis->service === 'face')
                            @php $c = isset($analysis->result['faces']) ? count($analysis->result['faces']) : 0; @endphp
                            {{ $c === 0 ? 'No face' : $c . ' face(s)' }}
                        @elseif ($analysis->service === 'wad')
                            @php $w = $analysis->result; @endphp
                            Weapon {{ $w['weapon'] ?? 0 }}, Alcohol {{ $w['alcohol'] ?? 0 }}, Drugs {{ $w['drugs'] ?? 0 }}
                        @elseif ($analysis->service === 'offensive')
                            @php $off = $analysis->result['offensive']['prob'] ?? null; @endphp
                            {{ $off === null ? '-' : round($off * 100) . '% offensive' }}
                        @elseif ($analysis->service === 'properties')
                            {{ $analysis->result['width'] ?? '?'}}x{{ $analysis->result['height'] ?? '?' }}
                        @elseif ($analysis->service === 'celebrity')
                            @php $names = collect($analysis->result['celebrities'] ?? [])->pluck('name')->join(', '); @endphp
                            {{ $names ?: 'None' }}
                        @else
                            -
                        @endif
                    </td>
                    <td>{{ $analysis->created_at }}</td>
                </tr>
                @endforeach
            </tbody>
            </table>
            </div>
            <div class="admin-pagination">
                {{ $analyses->links() }}
            </div>
        </div>
    </div>
</body>
</html>
