import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class TenantDashboard extends StatelessWidget {
  const TenantDashboard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Tenant Dashboard",
          style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.green.shade700,
      ),
      body: Center(
        child: Text(
          "Welcome, Tenant!",
          style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}
