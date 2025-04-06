import 'package:flutter/material.dart';
import 'package:frontend/data/models/mdlTenantRegister.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../data/repositories/tenant_repository.dart';
import '../../../../domain/APIServices/tenant_register_service.dart';


class TenantRegisterForm extends StatefulWidget {
  @override
  _TenantRegisterFormState createState() => _TenantRegisterFormState();

}

class _TenantRegisterFormState extends State<TenantRegisterForm> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _stateController = TextEditingController();
  final TextEditingController _zipCodeController = TextEditingController();
  final TextEditingController _countryController = TextEditingController();
  final TextEditingController _tenantTypeController = TextEditingController();
  final TextEditingController _tenantStatusController = TextEditingController();
  final TextEditingController _startDateController = TextEditingController();
  final TextEditingController _endDateController = TextEditingController();
  final TextEditingController _familyMembersController = TextEditingController();
  final TextEditingController _numberOfMembersController = TextEditingController();

  Future<void> _pickDate(TextEditingController controller) async {
    DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );

    if (picked != null) {
      controller.text = DateFormat('yyyy-MM-dd').format(picked);
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getInt('user_id');

    if (userId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("User ID missing. Please log in again.")),
      );
      return;
    }

    final tenant = TenantRegisterModel(
      userId: userId,
      apartmentId: 1, // Make dynamic if needed
      address: _addressController.text.trim(),
      city: _cityController.text.trim(),
      state: _stateController.text.trim(),
      zipCode: _zipCodeController.text.trim(),
      country: _countryController.text.trim(),
      tenantType: _tenantTypeController.text.trim(),
      tenantStatus: _tenantStatusController.text.trim(),
      tenantStartDate: _startDateController.text.trim(),
      tenantEndDate: _endDateController.text.trim(),
      familyMembers: _familyMembersController.text.trim(),
      numberOfMembers: int.tryParse(_numberOfMembersController.text.trim()) ?? 0,
    );

    try {
      final tenantRepository = TenantRepository(TenantService());
      final result = await tenantRepository.registerTenant(tenant);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Tenant registered')),
      );
      // You may want to reset form or navigate
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Registration failed: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Tenant Registration")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              _buildTextField(_addressController, "Address"),
              _buildTextField(_cityController, "City"),
              _buildTextField(_stateController, "State"),
              _buildTextField(_zipCodeController, "Zip Code"),
              _buildTextField(_countryController, "Country"),
              _buildTextField(_tenantTypeController, "Tenant Type"),
              _buildTextField(_tenantStatusController, "Tenant Status"),
              _buildDateField(_startDateController, "Start Date"),
              _buildDateField(_endDateController, "End Date"),
              _buildTextField(_familyMembersController, "Family Members"),
              _buildTextField(_numberOfMembersController, "Number of Members", inputType: TextInputType.number),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _submitForm,
                child: Text("Register Tenant"),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label,
      {TextInputType inputType = TextInputType.text}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextFormField(
        controller: controller,
        keyboardType: inputType,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(),
        ),
        validator: (value) => value == null || value.isEmpty ? "Enter $label" : null,
      ),
    );
  }

  Widget _buildDateField(TextEditingController controller, String label) {
    return GestureDetector(
      onTap: () => _pickDate(controller),
      child: AbsorbPointer(child: _buildTextField(controller, label)),
    );
  }
}
