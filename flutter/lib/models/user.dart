class User {
  User({required this.id, required this.name, required this.email});

  final int id;
  String name;
  String email;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
      email: json['email'] as String,
    );
  }
}
