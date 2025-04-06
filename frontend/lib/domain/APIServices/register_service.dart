import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../core/constants/gblConstants.dart';
import '../../data/models/mdlUser.dart';


class RegisterService {

  Future<String> register(UserModel user) async {
    final response = await http.post(
      Uri.parse(GblConstants.registerUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(user.toJson()),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data["message"];
    } else {
      throw Exception("Failed to register: ${response.body}");
    }
  }
}

