class Analysis {
  Analysis({required this.id, required this.service, required this.fileUrl, required this.result});

  final int id;
  final String service;
  final String fileUrl;
  final Map<String, dynamic> result;

  factory Analysis.fromJson(Map<String, dynamic> json) {
    return Analysis(
      id: json['id'] as int,
      service: json['service'] as String,
      fileUrl: json['file_url'] ?? json['file_path'] ?? '',
      result: Map<String, dynamic>.from(json['result'] as Map),
    );
  }
}
