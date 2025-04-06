class UserModel {
  final String name;
  final String email;
  final String phone;
  final String role;
  final String password;

  UserModel({
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    required this.password,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'password': password,
    };
  }
}
