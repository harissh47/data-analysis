import 'package:flutter/material.dart';
import 'package:frontend/presentation/pages/Apartment/Create_apartment.dart';
import 'package:google_fonts/google_fonts.dart';

// Dummy static pages (you will implement them later)
import '../Apartment/List_apartment.dart';
import '../Services/CreateService.dart';
import '../Services/ListService.dart';
import '../Staffs/Create_staff.dart';

class AdminDashboard extends StatefulWidget {
  final int initialIndex;
  const AdminDashboard({Key? key, this.initialIndex = 0}) : super(key: key);

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  late int _selectedIndex;

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.initialIndex;
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  final List<Widget> _pages = [
    HomeDashboard(),
    ServiceSection(),
    ApartmentSection(),
    StaffSection(),
    TenantSection(),
    NotificationSection(),
  ];

  final List<BottomNavigationBarItem> _bottomNavItems = const [
    BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
    BottomNavigationBarItem(icon: Icon(Icons.build), label: 'Services'),
    BottomNavigationBarItem(icon: Icon(Icons.apartment), label: 'Apartments'),
    BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Staffs'),
    BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Tenants'),
    BottomNavigationBarItem(icon: Icon(Icons.notifications), label: 'Notifications'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Admin Dashboard",
          style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.blue.shade700,
      ),
      body: (_selectedIndex >= 0 && _selectedIndex < _pages.length)
          ? _pages[_selectedIndex]
          : Center(child: Text("Invalid Page")),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        selectedItemColor: Colors.blue.shade700,
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        items: _bottomNavItems,
      ),
    );
  }
}

class HomeDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        "Welcome, Admin!",
        style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w500),
      ),
    );
  }
}

// ---------------- Services ----------------
class ServiceSection extends StatelessWidget {
  const ServiceSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        SectionButton(label: "Create Service", onTap: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const CreateServicePage()));
        }),
        SectionButton(label: "List Services", onTap: () {Navigator.push(context, MaterialPageRoute(builder: (_) => const ServicesPage()));}),
      ],
    );
  }
}

// ---------------- Apartments ----------------
class ApartmentSection extends StatelessWidget {
  const ApartmentSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        SectionButton(label: "Create Apartment", onTap: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const CreateApartmentPage()));}),
        SectionButton(label: "List Apartments", onTap: () {Navigator.push(context, MaterialPageRoute(builder: (_) => const ListApartmentsPage()));}),
      ],
    );
  }
}

// ---------------- Staffs ----------------
class StaffSection extends StatelessWidget {
  const StaffSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        SectionButton(label: "Create Staff", onTap: () {Navigator.push(context, MaterialPageRoute(builder: (_) => const CreateStaffPage()));}),
        SectionButton(label: "List Staffs", onTap: () {}),
        SectionButton(label: "Available Staffs", onTap: () {}),
        SectionButton(label: "Allocate Staff", onTap: () {}),
        SectionButton(label: "Delete Staff", onTap: () {}),
      ],
    );
  }
}

// ---------------- Tenants ----------------
class TenantSection extends StatelessWidget {
  const TenantSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        SectionButton(label: "List Tenants", onTap: () {}),
      ],
    );
  }
}

// ---------------- Notifications ----------------
class NotificationSection extends StatelessWidget {
  const NotificationSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        SectionButton(label: "Get Notifications", onTap: () {}),
        SectionButton(label: "List Notifications", onTap: () {}),
      ],
    );
  }
}

// ---------------- Common Widget ----------------
class SectionButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const SectionButton({required this.label, required this.onTap, super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        title: Text(label, style: GoogleFonts.poppins(fontWeight: FontWeight.w500)),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: onTap,
      ),
    );
  }
}
