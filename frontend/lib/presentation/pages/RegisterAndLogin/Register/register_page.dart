import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart';
import 'package:validators/validators.dart';

import '../../../../data/models/mdlUser.dart';
import '../../../../data/repositories/login_repository.dart';
import '../../../../domain/APIServices/login_service.dart';
import '../../../blocs/RegistrationAndLoginBloc/login/login_bloc.dart';
import '../../../blocs/RegistrationAndLoginBloc/register/register_bloc.dart';
import '../../../blocs/RegistrationAndLoginBloc/register/register_event.dart';
import '../../../blocs/RegistrationAndLoginBloc/register/register_state.dart';
import '../login/login_page.dart';

class RegistrationPage extends StatefulWidget {
  const RegistrationPage({Key? key}) : super(key: key);

  @override
  State<RegistrationPage> createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _mobileController = TextEditingController();
  final _emailController = TextEditingController();

  String _selectedUserType = 'Select Role';
  bool _passwordVisible = true;

  String passwordPattern =
      r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$';

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    } else if (!RegExp(passwordPattern).hasMatch(value)) {
      return 'Password must be at least 8 chars,\ninclude uppercase, number, & symbol';
    }
    return null;
  }

  String? _validateMobile(String? value) {
    if (value == null || value.isEmpty) {
      return 'Mobile number is required';
    } else if (!RegExp(r'^[0-9]{10}$').hasMatch(value)) {
      return 'Enter a valid 10-digit mobile number';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    } else if (!isEmail(value)) {
      return 'Enter a valid email';
    }
    return null;
  }

  String? _validateRole(String? value) {
    if (value == null || value == 'Select Role') {
      return 'Please select a role';
    }
    return null;
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      final user = UserModel(
        name: _usernameController.text.trim(),
        email: _emailController.text.trim(),
        phone: _mobileController.text.trim(),
        role: _selectedUserType.toLowerCase(),
        password: _passwordController.text.trim(),
      );

      context.read<RegisterBloc>().add(RegisterUser(user));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          _buildBackground(),
          Center(
            child: SingleChildScrollView(
              child: Card(
                elevation: 12,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
                margin: const EdgeInsets.symmetric(horizontal: 30),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: BlocListener<RegisterBloc, RegisterState>(
                    listener: (context, state) {
                      if (state is RegisterLoading) {
                        showDialog(
                          context: context,
                          barrierDismissible: false,
                          builder: (_) =>
                              const Center(child: CircularProgressIndicator()),
                        );
                      } else if (state is RegisterSuccess) {
                        Navigator.of(context).pop(); // Close dialog
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(state.message)),
                        );
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (_) => BlocProvider<LoginBloc>(
                              create: (context) => LoginBloc(
                                LoginRepository(LoginService()),
                              ),
                              child: LoginPage(),
                            ),
                          ),
                        );
                      } else if (state is RegisterFailure) {
                        Navigator.of(context).pop(); // Close dialog
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(state.error)),
                        );
                      }
                    },
                    child: Form(
                      key: _formKey,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            "Create Account",
                            style: GoogleFonts.poppins(
                              fontSize: 30,
                              fontWeight: FontWeight.w600,
                              color: Colors.blue.shade900,
                            ),
                          ),
                          const SizedBox(height: 30),
                          _buildTextField(
                            hint: "Username",
                            icon: Icons.person,
                            controller: _usernameController,
                            validator: (value) =>
                                value!.isEmpty ? 'Username is required' : null,
                          ),
                          const SizedBox(height: 20),
                          _buildTextField(
                            hint: "Password",
                            icon: Icons.lock,
                            controller: _passwordController,
                            validator: _validatePassword,
                            obscure: _passwordVisible,
                            toggleVisibility: () {
                              setState(() {
                                _passwordVisible = !_passwordVisible;
                              });
                            },
                          ),
                          const SizedBox(height: 20),
                          _buildDropdown(),
                          const SizedBox(height: 20),
                          _buildTextField(
                            hint: "Mobile Number",
                            icon: Icons.phone,
                            controller: _mobileController,
                            validator: _validateMobile,
                            keyboardType: TextInputType.phone,
                          ),
                          const SizedBox(height: 20),
                          _buildTextField(
                            hint: "Email ID",
                            icon: Icons.email,
                            controller: _emailController,
                            validator: _validateEmail,
                            keyboardType: TextInputType.emailAddress,
                          ),
                          const SizedBox(height: 30),
                          _buildRegisterButton(),
                          const SizedBox(height: 15),
                          TextButton(
                            onPressed: () {
                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => BlocProvider<LoginBloc>(
                                    create: (context) => LoginBloc(
                                        LoginRepository(LoginService())),
                                    child: LoginPage(),
                                  ),
                                ),
                              );
                            },
                            child: const Text(
                              "Already have an account? Login",
                              style: TextStyle(color: Colors.blue),
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required String hint,
    required IconData icon,
    required TextEditingController controller,
    required String? Function(String?) validator,
    bool obscure = false,
    VoidCallback? toggleVisibility,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      validator: validator,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: Colors.blue.shade700),
        hintText: hint,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: Colors.grey[200],
        suffixIcon: hint == "Password" && toggleVisibility != null
            ? IconButton(
                icon: Icon(
                  obscure ? Icons.visibility_off : Icons.visibility,
                  color: Colors.blue.shade700,
                ),
                onPressed: toggleVisibility,
              )
            : null,
      ),
    );
  }

  Widget _buildDropdown() {
    return DropdownButtonFormField<String>(
      value: _selectedUserType == 'Select Role' ? null : _selectedUserType,
      decoration: InputDecoration(
        prefixIcon: Icon(Icons.account_circle, color: Colors.blue.shade700),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: Colors.grey[200],
      ),
      items: ['Admin', 'Tenant'].map((String value) {
        return DropdownMenuItem<String>(
          value: value,
          child: Text(value),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _selectedUserType = value!;
        });
      },
      validator: _validateRole,
      hint: const Text("Select Role"),
    );
  }

  Widget _buildRegisterButton() {
    return ElevatedButton(
      onPressed: _submitForm,
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 80),
        backgroundColor: Colors.blue.shade700,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: Text(
        "Register",
        style: GoogleFonts.poppins(
          fontSize: 18,
          fontWeight: FontWeight.w500,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildBackground() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue.shade900, Colors.purple.shade700],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
    );
  }
}
