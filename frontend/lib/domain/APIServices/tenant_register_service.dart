import 'dart:convert';
import 'package:frontend/data/models/mdlTenantRegister.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/constants/gblConstants.dart';


  class TenantService {

  Future<Map<String, dynamic>> registerTenant(TenantRegisterModel tenant, String token) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    final response = await http.post(
      Uri.parse(GblConstants.tenantRegisterUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(tenant.toJson()),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed: ${response.body}");
    }
  }
}

