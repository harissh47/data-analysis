// import 'dart:convert';
// import 'package:dms_lite/core/constants/gblConstants.dart';
// import 'package:http/http.dart' as http;
// import '../errors/errExceptions.dart';
// import '../utils/utlLogger.dart';

// class ApiService {
//   //static String baseUrl="https://d620-202-144-77-234.ngrok-free.app";

//  // ApiService({required this.baseUrl});

//   static Future<dynamic> getRequest(String endpoint) async {
//     final response = await http.get(Uri.parse('${gblConstants.BASE_URL}$endpoint'));

//     if (response.statusCode == 200) {
//       return jsonDecode(response.body);
//     } else {
//       throw Exception('Failed to load data: ${response.statusCode}');
//     }
//   }

//   static Future<dynamic>  postRequest(String endpoint, String encodeData,) async {
//     utlLogger.log("BaseURL", '${gblConstants.BASE_URL}$endpoint');
//     utlLogger.log("ApiService", "encodeData : ${encodeData}");
//     final response = await http.post(
//       Uri.parse('${gblConstants.BASE_URL}$endpoint'),
//       headers: {'Content-Type': 'application/json'},
//       body: encodeData,
//     );
//     utlLogger.log("ApiService", "Url : ${response.request?.url}");
//     utlLogger.log("ApiService", "StatusCode : ${response.statusCode}");
//     if (response.statusCode == 200) {
//       utlLogger.log("ApiService", "Success Response Body : ${response.body}");
//       //return response.body;
//     } else {
//       utlLogger.log("ApiService", "Failed Response  : ${response.toString()}");
//       //throw Exception('Failed to post data: ${response.statusCode}');

//     }

//     return response;
//   }
// }
