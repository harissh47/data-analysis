import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/constants/gblConstants.dart';

class CreateStaffPage extends StatefulWidget {
  const CreateStaffPage({Key? key}) : super(key: key);

  @override
  State<CreateStaffPage> createState() => _CreateStaffPageState();
}

class _CreateStaffPageState extends State<CreateStaffPage> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _apartmentIdController = TextEditingController();
  final TextEditingController _specializationIdController = TextEditingController();

  bool _isLoading = false;

  Future<void> _submitStaff() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    SharedPreferences prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) {
      _showSnackBar("Authentication token missing");
      setState(() => _isLoading = false);
      return;
    }

    final response = await http.post(
      Uri.parse("${GblConstants.baseUrl}/staff/create"),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        "name": _nameController.text.trim(),
        "phone": _phoneController.text.trim(),
        "apartment_id": int.parse(_apartmentIdController.text.trim()),
        "specialization_id": int.parse(_specializationIdController.text.trim()),
      }),
    );

    setState(() => _isLoading = false);

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      _showSnackBar(data['message'] ?? "Staff created successfully");
      _formKey.currentState!.reset();
    } else {
      _showSnackBar("Failed to create staff: ${response.body}");
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  Widget _buildInputField(TextEditingController controller, String label,
      {TextInputType type = TextInputType.text}) {
    return TextFormField(
      controller: controller,
      keyboardType: type,
      validator: (value) => value == null || value.isEmpty ? "Please enter $label" : null,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.poppins(),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Create Staff",
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
              _buildInputField(_nameController, "Name"),
              const SizedBox(height: 16),
              _buildInputField(_phoneController, "Phone", type: TextInputType.phone),
              const SizedBox(height: 16),
              _buildInputField(_apartmentIdController, "Apartment ID", type: TextInputType.number),
              const SizedBox(height: 16),
              _buildInputField(_specializationIdController, "Specialization ID", type: TextInputType.number),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: _isLoading ? null : _submitStaff,
                icon: const Icon(Icons.person_add),
                label: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Create Staff"),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  textStyle: GoogleFonts.poppins(fontSize: 16),
                  backgroundColor: Colors.blue.shade700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
