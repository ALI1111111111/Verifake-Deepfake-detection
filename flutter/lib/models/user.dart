class User {
  User({
    required this.id,
    required this.name,
    required this.email,
    this.apiUsage = 0,
    this.apiLimit = 100,
    this.isAdmin = false,
  });

  final int id;
  String name;
  String email;
  final int apiUsage;
  final int apiLimit;
  final bool isAdmin;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
      email: json['email'] as String,
      apiUsage: json['api_usage'] as int? ?? 0,
      apiLimit: json['api_limit'] as int? ?? 100,
      isAdmin: json['is_admin'] as bool? ?? false,
    );
  }
}
