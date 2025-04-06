import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/constants/gblConstants.dart';

class CreateServicePage extends StatefulWidget {
  const CreateServicePage({Key? key}) : super(key: key);

  @override
  State<CreateServicePage> createState() => _CreateServicePageState();
}

class _CreateServicePageState extends State<CreateServicePage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  bool _isLoading = false;

  Future<void> _submitService() async {
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
      Uri.parse(GblConstants.createServiceUrl),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        "name": _nameController.text.trim(),
        "description": _descriptionController.text.trim(),
      }),
    );

    setState(() => _isLoading = false);

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      _showSnackBar(data['message'] ?? "Service created successfully");

      // Clear the form
      _formKey.currentState!.reset();
      _nameController.clear();
      _descriptionController.clear();
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Create Service",
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
              _buildInputField(_nameController, "Service Name"),
              const SizedBox(height: 16),
              _buildInputField(_descriptionController, "Description",
                  maxLines: 3),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: _isLoading ? null : _submitService,
                icon: Icon(Icons.add),
                label: _isLoading
                    ? CircularProgressIndicator(color: Colors.white)
                    : Text("Create Service"),
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

  Widget _buildInputField(TextEditingController controller, String label,
      {int maxLines = 1}) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      validator: (value) =>
          value == null || value.isEmpty ? "Please enter $label" : null,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.poppins(),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}
