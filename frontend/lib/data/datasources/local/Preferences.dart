import 'dart:convert';

class Preferences {
  static var prefs;

  static String DeviceKey = "DeviceKey";
  static String CompanyCode = "CompanyCode";
  static String salesmanDetails = "SalesmanDetails";
  static String Password = "Password";
  static String isOtpVerified = "isOtpVerified";
  static String isWelcomeScreenDone = "isWelcomeScreenDone";
  static String distributorDetails = "distributorDetails";
  static String syncDate = "syncDate";
  static String syncDateTime = "syncDateTime";
  static String isRememberPassword = "isRememberPassword";
  static const String punchInDate = 'punchInDate';
  static const String visitedDistributors = 'visitedDistributors';

  Preferences() {
    //prefs = await SharedPreferences.getInstance();
  }

  static Future<String?> getSalesmanDetails() async {
    return await prefs.getString(salesmanDetails);
  }

  static setSalesmanDetails(String slmDetails) {
    prefs.setString(salesmanDetails, slmDetails);
  }

  static savePassword(String _password) {
    prefs.setString(Password, _password);
  }

  static String? getPassword() {
    return prefs.getString(Password);
  }

  static saveSyncString(String key, String value) {
    prefs.setString(key, value);
  }

  static String? getSyncString(String key) {
    return prefs.getString(key);
  }

  

  static saveOtpVerified(bool _isOtpVerified) {
    prefs.setBool(isOtpVerified, _isOtpVerified);
  }

  static Future<bool?> getIsOtpVerified() async {
    return await prefs.getBool(isOtpVerified);
  }

  static saveWelcomeScreenDone(bool _isWelcomeScreenDone) {
    prefs.setBool(isWelcomeScreenDone, _isWelcomeScreenDone);
  }

  static Future<bool?> getIsWelcomeScreenDone() async {
    return await prefs.getBool(isWelcomeScreenDone);
  }

  static saveRememberPassword(bool value) {
    prefs.setBool(isRememberPassword, value);
  }

  static Future<bool?> getIsRememberPassword() async {
    return await prefs.getBool(isRememberPassword);
  }

  static saveListOfStrings(String key,List<String> list)  {
     prefs.setStringList(key, list);
  }

 static List<String> getListOfStrings(String key)  {
    return prefs.getStringList(key) ?? [];
  }
}
