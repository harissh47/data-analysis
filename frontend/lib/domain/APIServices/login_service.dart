import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../core/constants/gblConstants.dart';
import '../../data/models/mdlUser.dart';
import '../../data/models/mdlloginUser.dart';

class LoginService {
  Future<Map<String, dynamic>> login(LoginModel user) async {
    final response = await http.post(
      Uri.parse(GblConstants.loginUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(user.toJson()),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed to login: ${response.body}");
    }
  }
}
