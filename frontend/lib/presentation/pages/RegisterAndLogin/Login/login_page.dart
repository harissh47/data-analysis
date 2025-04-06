import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:frontend/presentation/pages/RegisterAndLogin/Register/tenant_register.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../data/models/mdlloginUser.dart';

import '../../../../data/repositories/login_repository.dart';
import '../../../../domain/APIServices/login_service.dart';
import '../../../blocs/RegistrationAndLoginBloc/login/login_bloc.dart';
import '../../../blocs/RegistrationAndLoginBloc/login/login_event.dart';
import '../../../blocs/RegistrationAndLoginBloc/login/login_state.dart';
import '../../Dashboard.dart/admin_dashboard.dart';
import '../../Dashboard.dart/tenant_dashboard.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  void _loginUser() {
    if (_formKey.currentState!.validate()) {
      final loginBloc = context.read<LoginBloc>();
      final user = LoginModel(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
      loginBloc.add(LoginUser(user));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocListener<LoginBloc, LoginState>(
        listener: (context, state) async {
          if (state is LoginLoading) {
            showDialog(
              context: context,
              barrierDismissible: false,
              builder: (_) => const Center(child: CircularProgressIndicator()),
            );
          } else {
            Navigator.of(context, rootNavigator: true).pop(); // Close loading
          }

          if (state is LoginSuccess) {
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString('token', state.token);
            await prefs.setInt('user_id', state.userId);
            await prefs.setString('role', state.role);

            if (state.role == 'admin') {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => AdminDashboard()),
              );
            } else if (state.role == 'tenant') {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => TenantRegisterForm()),
              );
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Unknown role: ${state.role}")),
              );
            }
          } else if (state is LoginFailure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.error)),
            );
          }
        },
        child: Stack(
          children: [
            _buildBackground(),
            Center(
              child: _buildLoginForm(),
            ).animate().fade(duration: 800.ms).slideY(begin: 0.5, end: 0),
          ],
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

  Widget _buildLoginForm() {
    return Card(
      elevation: 10,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      margin: const EdgeInsets.symmetric(horizontal: 30),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "Welcome Back!",
                style: GoogleFonts.poppins(
                  fontSize: 24,
                  fontWeight: FontWeight.w600,
                  color: Colors.blue.shade900,
                ),
              ),
              const SizedBox(height: 20),
              _buildTextField(
                controller: _emailController,
                hint: "Email",
                icon: Icons.email,
                obscure: false,
                validator: (value) =>
                    value!.isEmpty ? "Please enter your email" : null,
              ),
              const SizedBox(height: 15),
              _buildTextField(
                controller: _passwordController,
                hint: "Password",
                icon: Icons.lock,
                obscure: true,
                validator: (value) =>
                    value!.isEmpty ? "Please enter your password" : null,
              ),
              const SizedBox(height: 20),
              _buildLoginButton(),
              const SizedBox(height: 10),
              TextButton(
                onPressed: () {
                  // TODO: Forgot password logic
                },
                child: const Text(
                  "Forgot Password?",
                  style: TextStyle(color: Colors.blue),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    required bool obscure,
    required String? Function(String?) validator,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      validator: validator,
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: Colors.blue.shade700),
        hintText: hint,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: Colors.grey[200],
      ),
    );
  }

  Widget _buildLoginButton() {
    return ElevatedButton(
      onPressed: _loginUser,
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 80),
        backgroundColor: Colors.blue.shade700,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: Text(
        "Login",
        style: GoogleFonts.poppins(
          fontSize: 18,
          fontWeight: FontWeight.w500,
          color: Colors.white, // Better contrast than blue on blue
        ),
      ),
    ).animate().fade(duration: 500.ms).scale(
          duration: 500.ms,
          begin: const Offset(0.9, 0.9),
          end: const Offset(1, 1),
        );
  }
}
