import 'package:flutter/material.dart';

import '../Helper/GradientContainer.dart';

class HomesPage extends StatelessWidget {
  final List<Property> properties = [
    Property("TOWER-A", "1504", 8),
    Property("TOWER-B", "2101", 5),
    Property("TOWER-C", "0903", 6),
  ];

  HomesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Homes",
            style: TextStyle(fontWeight: FontWeight.bold)),
        flexibleSpace: buildGradientBackground(),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      childAspectRatio: 1.1,
                    ),
                    itemCount: properties.length,
                    itemBuilder: (context, index) => _buildPropertyCard(properties[index]),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              _buildServiceCard(
                title: "Maintenance Services",
                color: Colors.indigo[800]!,
                services: ["Plumbing", "Electrical", "Cleaning"],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPropertyCard(Property property) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.blue[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.blue[100]!),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.apartment, size: 40, color: Colors.blue[800]),
          const SizedBox(height: 8),
          Text(property.tower,
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue[800])),
          Text("Unit ${property.unit}",
              style: TextStyle(color: Colors.grey[600])),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.people_outline, size: 16, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Text("${property.members} Members",
                  style: TextStyle(color: Colors.grey[600])),
            ],
          ),
        ],
      ),
    );
  }
}

Widget _buildServiceCard({
    required String title,
    required Color color,
    required List<String> services,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title,
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: color)),
                TextButton(
                  onPressed: () {},
                  child: Text("View All", style: TextStyle(color: color)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: services.map((service) => _buildServiceChip(service, color)).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceChip(String service, Color color) {
    IconData icon;
    switch (service.toLowerCase()) {
      case 'plumbing':
        icon = Icons.plumbing;
        break;
      case 'electrical':
        icon = Icons.electrical_services;
        break;
      case 'cleaning':
        icon = Icons.cleaning_services;
        break;
      default:
        icon = Icons.build;
    }
    
    return Chip(
      backgroundColor: color.withOpacity(0.1),
      label: Text(service),
      avatar: Icon(icon, color: color),
      labelStyle: TextStyle(color: color),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(color: color.withOpacity(0.3)),
      ),
    );
  }

class Property {
  final String tower;
  final String unit;
  final int members;

  Property(this.tower, this.unit, this.members);
}