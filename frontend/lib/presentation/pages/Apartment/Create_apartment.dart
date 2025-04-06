import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/constants/gblConstants.dart'; // Make sure this contains your base URL

class CreateApartmentPage extends StatefulWidget {
  const CreateApartmentPage({Key? key}) : super(key: key);

  @override
  State<CreateApartmentPage> createState() => _CreateApartmentPageState();
}

class _CreateApartmentPageState extends State<CreateApartmentPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _apartmentNoController = TextEditingController();
  final TextEditingController _flatNoController = TextEditingController();

  bool _isLoading = false;

  Future<void> _submitApartment() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) {
      _showSnackBar("Authentication token missing");
      setState(() => _isLoading = false);
      return;
    }

    final response = await http.post(
      Uri.parse(GblConstants.createApartmentUrl),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        "apartment_no": _apartmentNoController.text.trim(),
        "flat_no": _flatNoController.text.trim(),
      }),
    );

    setState(() => _isLoading = false);

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      _showSnackBar(data['message'] ?? "Apartment created successfully");
      _formKey.currentState!.reset();
      _apartmentNoController.clear();
      _flatNoController.clear();
    } else {
      _showSnackBar("Failed: ${response.body}");
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Create Apartment",
          style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.blue.shade700,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              _buildInputField(_apartmentNoController, "Apartment Number"),
              const SizedBox(height: 16),
              _buildInputField(_flatNoController, "Flat Number"),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: _isLoading ? null : _submitApartment,
                icon: const Icon(Icons.add_business),
                label: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Create Apartment"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue.shade700,
                  textStyle: GoogleFonts.poppins(fontSize: 16),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputField(TextEditingController controller, String label) {
    return TextFormField(
      controller: controller,
      validator: (value) => value == null || value.isEmpty ? "Please enter $label" : null,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.poppins(),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}
