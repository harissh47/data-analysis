class GblConstants {
  // Base URL
  static const String baseUrl = "http://127.0.0.1:5000";

  // Auth Endpoints
  static const String registerUrl = "$baseUrl/auth/register";
  static const String loginUrl = "$baseUrl/auth/login";
  static const String tenantRegisterUrl = "$baseUrl/tenant/register";
  static const String createServiceUrl = "$baseUrl/service/create";
  static const String createApartmentUrl = "$baseUrl/apartment/create";

}
