import 'package:flutter/material.dart';
import 'package:frontend/Login/login_page.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:validators/validators.dart'; // To use built-in validators for email

class RegistrationPage extends StatefulWidget {
  @override
  _RegistrationPageState createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final _formKey = GlobalKey<FormState>();
  String _selectedUserType = 'Select Role'; // Default selection is "Select Role"
  bool _passwordVisible = true; // To toggle password visibility

  TextEditingController usernameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController mobileController = TextEditingController();
  TextEditingController emailController = TextEditingController();

  String passwordPattern = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$';

  // Track validation state for each field
  bool _isUsernameValid = true;
  bool _isPasswordValid = true;
  bool _isMobileValid = true;
  bool _isEmailValid = true;
  bool _isRoleValid = true;

  // Validate password
  String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      setState(() {
        _isPasswordValid = false;
      });
      return 'Password is required';
    } else if (!RegExp(passwordPattern).hasMatch(value)) {
      setState(() {
        _isPasswordValid = false;
      });
      return 'Password must be at least 8 characters, include an uppercase letter, a number, and a special character';
    }
    setState(() {
      _isPasswordValid = true;
    });
    return null;
  }

  // Validate mobile number
  String? validateMobile(String? value) {
    if (value == null || value.isEmpty) {
      setState(() {
        _isMobileValid = false;
      });
      return 'Mobile number is required';
    } else if (!RegExp(r'^[0-9]{10}$').hasMatch(value)) {
      setState(() {
        _isMobileValid = false;
      });
      return 'Enter a valid 10-digit mobile number';
    }
    setState(() {
      _isMobileValid = true;
    });
    return null;
  }

  // Validate email address
  String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      setState(() {
        _isEmailValid = false;
      });
      return 'Email is required';
    } else if (!isEmail(value)) {
      setState(() {
        _isEmailValid = false;
      });
      return 'Enter a valid email address';
    }
    setState(() {
      _isEmailValid = true;
    });
    return null;
  }

  // Register user and send data to backend
  Future<void> registerUser() async {
    final Map<String, String> data = {
      'username': usernameController.text,
      'password': passwordController.text,
      'usertype': _selectedUserType,
      'mobile': mobileController.text,
      'email': emailController.text,
    };

    try {
      final response = await http.post(
        Uri.parse('https://de79-202-144-77-234.ngrok-free.app/register'), // Replace with your backend URL
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data),
      );

      if (response.statusCode == 200) {
        print(response.body);
        // Successfully registered
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(jsonDecode(response.body)["message"])),
        );
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => LoginPage()), // Navigate to LoginPage
        );
      } else {
        // Backend error
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${response.body}')),
        );
      }
    } catch (e) {
      // Handle connection or other errors
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to connect to server. Try again later.')),
      );
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
                margin: EdgeInsets.symmetric(horizontal: 30),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
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
                        SizedBox(height: 30),
                        _buildTextField("Username", Icons.person, false, usernameController, (value) {
                          setState(() {
                            if (value == null || value.isEmpty) {
                              _isUsernameValid = false;
                            } else {
                              _isUsernameValid = true;
                            }
                          });
                          return null;
                        }),
                        SizedBox(height: 20),
                        _buildTextField("Password", Icons.lock, _passwordVisible, passwordController, validatePassword),
                        SizedBox(height: 20),
                        _buildDropdown(),
                        SizedBox(height: 20),
                        _buildTextField("Mobile Number", Icons.phone, false, mobileController, validateMobile),
                        SizedBox(height: 20),
                        _buildTextField("Email ID", Icons.email, false, emailController, validateEmail),
                        SizedBox(height: 30),
                        _buildRegisterButton(),
                        SizedBox(height: 15),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => LoginPage()),
                            );
                          },
                          child: Text("Already have an account? Login", style: TextStyle(color: Colors.blue)),
                        )
                      ],
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

  Widget _buildTextField(String hint, IconData icon, bool obscure, TextEditingController controller, FormFieldValidator<String> validator) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      keyboardType:
          hint == "Mobile Number" ? TextInputType.phone : TextInputType.text,
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: Colors.blue.shade700),
        hintText: hint,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: Colors.grey[200],
        suffixIcon: hint == "Password"
            ? IconButton(
                icon: Icon(
                  _passwordVisible ? Icons.visibility_off : Icons.visibility,
                  color: Colors.blue.shade700,
                ),
                onPressed: () {
                  setState(() {
                    _passwordVisible = !_passwordVisible;
                  });
                },
              )
            : null,
        errorText: _getFieldError(hint),
      ),
      validator: validator,
      onChanged: (value) {
        setState(() {
          _getFieldError(hint);  // Trigger error display while typing
        });
      },
    );
  }

  String? _getFieldError(String hint) {
    if (hint == "Username") {
      return _isUsernameValid ? null : 'Username is required';
    } else if (hint == "Password") {
      return _isPasswordValid ? null : 'Password is required';
    } else if (hint == "Mobile Number") {
      return _isMobileValid ? null : 'Mobile number is required';
    } else if (hint == "Email ID") {
      return _isEmailValid ? null : 'Email is required';
    }
    return null;
  }

  Widget _buildDropdown() {
    return DropdownButtonFormField<String>(
      hint: Text("Select Role"),
      value: _selectedUserType == 'Select Role' ? null : _selectedUserType,
      items: ["Admin", "Tenant"].map((String userType) {
        return DropdownMenuItem<String>(
          value: userType,
          child: Text(userType),
        );
      }).toList(),
      onChanged: (newValue) {
        setState(() {
          _selectedUserType = newValue!;
          _isRoleValid = true;
        });
      },
      decoration: InputDecoration(
        prefixIcon: Icon(Icons.account_circle, color: Colors.blue.shade700),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: Colors.grey[200],
      ),
      validator: (value) {
        if (value == 'Select Role') {
          setState(() {
            _isRoleValid = false;
          });
          return 'Please select a user type';
        }
        setState(() {
          _isRoleValid = true;
        });
        return null;
      },
    );
  }

  Widget _buildRegisterButton() {
    return ElevatedButton(
      onPressed: () {
        if (_formKey.currentState!.validate()) {
          registerUser();
        }
      },
      style: ElevatedButton.styleFrom(
        padding: EdgeInsets.symmetric(vertical: 12, horizontal: 80),
        backgroundColor: Colors.blue.shade700,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: Text(
        "Register",
        style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w500, color: Colors.white),
      ),
    );
  }
}
