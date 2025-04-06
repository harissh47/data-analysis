// import 'dart:convert';
// import 'dart:io';

// import 'package:flutter/foundation.dart';
// import 'package:flutter/material.dart';
// import 'package:package_info_plus/package_info_plus.dart';
// import 'package:http/http.dart' as http;
// import 'package:url_launcher/url_launcher.dart';
// import 'package:html/parser.dart' as html_parser;

// class apiVersionCheckService {
//   final String androidAppId = 'com.sify.sffnxt'; // Replace with your Play Store app ID
//   final String iosAppId = '6737022226'; // Replace with your App Store app ID
//   final currentVersion = '200100';
//   Future<bool> checkForUpdate(BuildContext context) async {
//     final latestVersion = await _getLatestVersion();

//     if (currentVersion != null && latestVersion != null) {
//       if (_isUpdateAvailable(currentVersion, latestVersion)) {
//         _showUpdateDialog(context);
//         return true;
//       }
//     }
//     return false;
//   }

//   Future<String?> _getCurrentVersion() async {
//     final packageInfo = await PackageInfo.fromPlatform();
//     return packageInfo.version;
//   }

//   Future<String?> _getLatestVersion() async {
//     if(kIsWeb)
//       {
//         return null;
//       }
//     if (Platform.isAndroid) {
//       return await _getLatestVersionFromPlayStore();
//     } else if (Platform.isIOS) {
//       return await _getLatestVersionFromAppStore();
//     }
//     return null;
//   }

//   Future<String?> _getLatestVersionFromPlayStore() async {
//     final url = 'https://play.google.com/store/apps/details?id=$androidAppId&hl=en';
//     final response = await http.get(Uri.parse(url));

//     if (response.statusCode == 200) {
//       print("");
//       final document = html_parser.parse(response.body);
//       final elements = document.getElementsByClassName('hAyfc');
//       for (var element in elements) {
//         if (element.querySelector('.BgcNfc')?.text == 'Current Version') {
//           final versionElement = element.querySelector('.htlgb');
//           if (versionElement != null) {
//             return versionElement.text.trim();
//           }
//         }
//       }
//     }
//     return null;
//   }

//   Future<String?> _getLatestVersionFromAppStore() async {
//     final url = 'https://itunes.apple.com/lookup?id=$iosAppId';
//     final response = await http.get(Uri.parse(url));

//     if (response.statusCode == 200) {
//       final jsonResponse = json.decode(response.body);
//       if (jsonResponse['resultCount'] > 0) {
//         return jsonResponse['results'][0]['version'];
//       }
//     }
//     return null;
//   }

//   bool _isUpdateAvailable(String currentVersion, String latestVersion) {
//     final currentVersionParts = currentVersion.split('.').map(int.parse).toList();
//     final latestVersionParts = latestVersion.split('.').map(int.parse).toList();

//     for (var i = 0; i < latestVersionParts.length; i++) {
//       if (i >= currentVersionParts.length || currentVersionParts[i] < latestVersionParts[i]) {
//         return true;
//       } else if (currentVersionParts[i] > latestVersionParts[i]) {
//         return false;
//       }
//     }
//     return false;
//   }

//   void _showUpdateDialog(BuildContext context) {
//     showDialog(
//       context: context,
//       builder: (context) => AlertDialog(
//         title: Text('Update Available'),
//         content: Text('A new version of the app is available. Please update to the latest version.'),
//         actions: [
//           TextButton(
//             onPressed: () {
//               Navigator.pop(context);
//             },
//             child: Text('Later'),
//           ),
//           TextButton(
//             onPressed: () {
//               _redirectToStore();
//             },
//             child: Text('Update'),
//           ),
//         ],
//       ),
//     );
//   }

//   void _redirectToStore() {
//     final url = Platform.isAndroid
//         ? 'https://play.google.com/store/apps/details?id=$androidAppId'
//         : 'https://apps.apple.com/app/id$iosAppId';
//     launch(url);
//   }
// }
