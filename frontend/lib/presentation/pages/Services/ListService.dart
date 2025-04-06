// import 'dart:convert';
// import 'package:flutter/material.dart';
// import 'package:google_fonts/google_fonts.dart';
// import 'package:http/http.dart' as http;
// import 'package:shared_preferences/shared_preferences.dart';

// import '../../../core/constants/gblConstants.dart';

// class ListServicesPage extends StatefulWidget {
//   const ListServicesPage({Key? key}) : super(key: key);

//   @override
//   State<ListServicesPage> createState() => _ListServicesPageState();
// }

// class _ListServicesPageState extends State<ListServicesPage> {
//   bool _isLoading = true;
//   String? _error;
//   List<Map<String, dynamic>> _services = [];

//   @override
//   void initState() {
//     super.initState();
//     _fetchServices();
//   }

//   Future<void> _fetchServices() async {
//     try {
//       SharedPreferences prefs = await SharedPreferences.getInstance();
//       String? token = prefs.getString('token');

//       if (token == null) {
//         setState(() {
//           _error = "Authentication token missing.";
//           _isLoading = false;
//         });
//         return;
//       }

//       final response = await http.get(
//         Uri.parse("${GblConstants.baseUrl}/service/list"),
//         headers: {
//           'Authorization': 'Bearer $token',
//         },
//       );

//       if (response.statusCode == 200) {
//         final List<dynamic> data = jsonDecode(response.body);
//         setState(() {
//           _services = data.cast<Map<String, dynamic>>();
//           _isLoading = false;
//         });
//       } else {
//         setState(() {
//           _error = "Failed to fetch services: ${response.statusCode}";
//           _isLoading = false;
//         });
//       }
//     } catch (e) {
//       setState(() {
//         _error = "Error occurred: $e";
//         _isLoading = false;
//       });
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text(
//           "List of Services",
//           style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
//         ),
//         backgroundColor: Colors.blue.shade700,
//       ),
//       body: _isLoading
//           ? const Center(child: CircularProgressIndicator())
//           : _error != null
//               ? Center(child: Text(_error!, style: GoogleFonts.poppins()))
//               : _services.isEmpty
//                   ? Center(child: Text("No services available", style: GoogleFonts.poppins()))
//                   : ListView.builder(
//                       padding: const EdgeInsets.all(16),
//                       itemCount: _services.length,
//                       itemBuilder: (context, index) {
//                         final service = _services[index];
//                         return Card(
//                           shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//                           elevation: 4,
//                           margin: const EdgeInsets.only(bottom: 12),
//                           child: ListTile(
//                             contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
//                             title: Text(
//                               service['name'],
//                               style: GoogleFonts.poppins(
//                                 fontSize: 18,
//                                 fontWeight: FontWeight.w600,
//                               ),
//                             ),
//                             subtitle: Text(
//                               service['description'],
//                               style: GoogleFonts.poppins(fontSize: 14),
//                             ),
//                             leading: CircleAvatar(
//                               backgroundColor: Colors.blue.shade700,
//                               child: Text(
//                                 service['id'].toString(),
//                                 style: GoogleFonts.poppins(color: Colors.white),
//                               ),
//                             ),
//                           ),
//                         );
//                       },
//                     ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'dart:convert'; // For JSON decoding
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/constants/gblConstants.dart'; // For API calls

class ServicesPage extends StatefulWidget {
  const ServicesPage({super.key});

  @override
  State<ServicesPage> createState() => _ServicesPageState();
}

class _ServicesPageState extends State<ServicesPage> {
  final String baseUrl = "http://127.0.0.1:5000"; // Base URL
  final String token = "<access_token>"; // Replace with dynamic token fetching logic
  final String tenantId = "1"; // Replace with actual tenant ID

  final Map<String, IconData> serviceIcons = {
    "AC": Icons.ac_unit,
    "CLEANING": Icons.cleaning_services,
    "PLUMBING": Icons.plumbing,
    "ELECTRICIAN": Icons.electrical_services,
    "CARPENTRY": Icons.carpenter,
    // Add more mappings as needed
  };

  List<Service> services = [];
  bool isLoading = true;
  String? _error; // Define _error as a nullable String

  @override
  void initState() {
    super.initState();
    fetchServices();
  }

  Future<void> fetchServices() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');

      if (token == null) {
        setState(() {
          _error = "Authentication token missing.";
          isLoading = false;
        });
        return;
      }

      final response = await http.get(
        Uri.parse("${GblConstants.baseUrl}/service/list"),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        setState(() {
          services = data.map<Service>((serviceData) {
            return Service(
              serviceIcons[serviceData['type']] ?? Icons.miscellaneous_services,
              serviceData['name'],
              Colors.blue, // Replace with dynamic color if needed
              serviceData['id'],
            );
          }).toList();
          isLoading = false;
        });
      } else {
        setState(() {
          _error = "Failed to fetch services: ${response.statusCode}";
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = "Error occurred: $e";
        isLoading = false;
      });
    }
  }

  Future<void> requestService(int serviceId) async {
    final String url = "$baseUrl/service/request";

    final Map<String, String> headers = {
      "Authorization": "Bearer $token",
      "Content-Type": "application/json",
    };

    final Map<String, dynamic> body = {
      "tenant_id": tenantId, // Replace with actual tenant ID
      "service_id": serviceId,
    };

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: headers,
        body: json.encode(body),
      );

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(responseData['message'])),
        );
      } else {
        throw Exception("Failed to submit service request");
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );
    }
  }

  void showRequestPopup(Service service) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text("Request Service"),
          content: Text("Do you want to request the ${service.name} service?"),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Cancel"),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                requestService(service.id);
              },
              child: const Text("Yes"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Services",
            style: TextStyle(fontWeight: FontWeight.bold)),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.blue[800]!, Colors.blue[600]!],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : services.isEmpty
              ? const Center(child: Text("No services available"))
              : SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: _buildServiceSection(
                      title: "Available Services",
                      services: services,
                      color: Colors.blue[800]!,
                    ),
                  ),
                ),
    );
  }

  Widget _buildServiceSection({
    required String title,
    required List<Service> services,
    required Color color,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title,
                style: TextStyle(
                    fontSize: 18, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 16),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.9,
              ),
              itemCount: services.length,
              itemBuilder: (context, index) {
                return _buildServiceItem(services[index]);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceItem(Service service) {
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: () => showRequestPopup(service),
      child: Container(
        decoration: BoxDecoration(
          color: service.color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: service.color.withOpacity(0.3)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(service.icon, size: 32, color: service.color),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4.0),
              child: Text(service.name,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: service.color)),
            ),
          ],
        ),
      ),
    );
  }
}

class Service {
  final IconData icon;
  final String name;
  final Color color;
  final int id;

  Service(this.icon, this.name, this.color, this.id);
}