import 'package:shared_preferences/shared_preferences.dart';

import '../../domain/APIServices/tenant_register_service.dart';
import '../models/mdlTenantRegister.dart';

class TenantRepository {
  final TenantService service;

  TenantRepository(this.service);

  Future<Map<String, dynamic>> registerTenant(TenantRegisterModel tenant) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) {
      throw Exception('Authentication token missing');
    }

    return await service.registerTenant(tenant, token); // ✅ pass token here
  }
}
