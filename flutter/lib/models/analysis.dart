class Analysis {
  final int id;
  final String service;
  final String filePath;
  final Map<String, dynamic> result;
  final DateTime createdAt;

  Analysis({
    required this.id,
    required this.service,
    required this.filePath,
    required this.result,
    required this.createdAt,
  });

  factory Analysis.fromJson(Map<String, dynamic> json) {
    return Analysis(
      id: json['id'],
      service: json['service'],
      filePath: json['file_path'] ?? json['file_url'] ?? '',
      result: json['result'] ?? {},
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  String get fileUrl {
    if (filePath.isEmpty) return '';
    // Construct the full URL to the file
    const baseUrl = 'http://127.0.0.1:8001/'; // Fixed port to match API
    return '$baseUrl/storage/$filePath';
  }

  String get formattedResult {
    return getResultText();
  }

  String get formattedDate {
    return '${createdAt.day.toString().padLeft(2, '0')}/'
        '${createdAt.month.toString().padLeft(2, '0')}/'
        '${createdAt.year} '
        '${createdAt.hour.toString().padLeft(2, '0')}:'
        '${createdAt.minute.toString().padLeft(2, '0')}';
  }

  String getResultText() {
    switch (service) {
      case 'deepfake':
        final score = result['type']?['deepfake'] ?? result['score'];
        if (score == null) return '-';
        return score > 0.5 ? 'Likely Fake' : 'Likely Real';

      case 'face':
        final count = result['faces']?.length ?? 0;
        return count == 0 ? 'No face' : '$count face(s)';

      case 'wad':
        final weapon = result['weapon'] ?? 0;
        final alcohol = result['alcohol'] ?? 0;
        final drugs = result['drugs'] ?? 0;
        return 'Weapon: $weapon, Alcohol: $alcohol, Drugs: $drugs';

      case 'offensive':
        final prob = result['offensive']?['prob'];
        if (prob == null) return '-';
        return '${(prob * 100).round()}% offensive';

      case 'properties':
        final width = result['width'];
        final height = result['height'];
        return '${width}x$height';

      case 'celebrity':
        final celebrities = result['celebrities'] as List?;
        if (celebrities == null || celebrities.isEmpty) return 'None';
        return celebrities.map((c) => c['name']).join(', ');

      default:
        return '-';
    }
  }

  bool get isDeepfakeLikely {
    if (service != 'deepfake') return false;
    final score = result['type']?['deepfake'] ?? result['score'];
    return score != null && score > 0.5;
  }
}
