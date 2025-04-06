import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/constants/gblConstants.dart';

class ListApartmentsPage extends StatefulWidget {
  const ListApartmentsPage({Key? key}) : super(key: key);

  @override
  State<ListApartmentsPage> createState() => _ListApartmentsPageState();
}

class _ListApartmentsPageState extends State<ListApartmentsPage> {
  bool _isLoading = true;
  List<Map<String, dynamic>> _apartments = [];
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchApartments();
  }

  Future<void> _fetchApartments() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) {
        setState(() {
          _error = "Authentication token missing";
          _isLoading = false;
        });
        return;
      }

      final response = await http.get(
        Uri.parse("${GblConstants.baseUrl}/apartment/list"),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        setState(() {
          _apartments = data.cast<Map<String, dynamic>>();
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = "Failed to load apartments: ${response.statusCode}";
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = "An error occurred: $e";
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Apartments',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.blue.shade700,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!, style: GoogleFonts.poppins()))
              : _apartments.isEmpty
                  ? Center(child: Text("No apartments found", style: GoogleFonts.poppins()))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _apartments.length,
                      itemBuilder: (context, index) {
                        final apartment = _apartments[index];
                        return Card(
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          elevation: 4,
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                            leading: CircleAvatar(
                              backgroundColor: Colors.blue.shade700,
                              child: Text(
                                apartment['id'].toString(),
                                style: GoogleFonts.poppins(color: Colors.white),
                              ),
                            ),
                            title: Text(
                              'Apartment No: ${apartment['apartment_no']}',
                              style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
                            ),
                            subtitle: Text(
                              'Flat No: ${apartment['flat_no']}',
                              style: GoogleFonts.poppins(),
                            ),
                          ),
                        );
                      },
                    ),
    );
  }
}
