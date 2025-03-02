import 'package:flutter/material.dart';


class ServicesPage extends StatelessWidget {
  final List<Service> urbanCompanyServices = [
    Service(Icons.build, "Appliance Repair", Colors.blue),
    Service(Icons.ac_unit, "AC Service", Colors.teal),
    Service(Icons.cleaning_services, "Kitchen Cleaning", Colors.orange),
    Service(Icons.weekend, "Sofa Cleaning", Colors.purple),
    Service(Icons.home_repair_service, "Full Home Cleaning", Colors.green),
    Service(Icons.bug_report, "Pest Control", Colors.red),
    Service(Icons.carpenter, "Carpenters", Colors.brown),
    Service(Icons.plumbing, "Plumbers", Colors.indigo),
    Service(Icons.electrical_services, "Electricians", Colors.amber),
    Service(Icons.face, "Salon Women", Colors.pink),
    Service(Icons.person, "Salon Men", Colors.blueGrey),
    Service(Icons.format_paint, "Home Painting", Colors.deepOrange),
  ];

  final List<Service> otherServices = [
    Service(Icons.local_laundry_service, "Laundry", Colors.cyan),
    Service(Icons.local_florist, "Florist", Colors.pinkAccent),
    Service(Icons.local_grocery_store, "Grocery", Colors.lightGreen),
  ];

  ServicesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Services",
            style: TextStyle(fontWeight: FontWeight.bold)),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.blue[800]!, Colors.blue[600]!],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Urban Company Services Card
              _buildServiceSection(
                title: "Services by Urban Company",
                services: urbanCompanyServices,
                color: Colors.blue[800]!,
              ),

              const SizedBox(height: 24),

              // Other Services Card
              _buildServiceSection(
                title: "Local Community Services",
                services: otherServices,
                color: Colors.green[800]!,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildServiceSection({
    required String title,
    required List<Service> services,
    required Color color,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
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
                  child: Text("View All",
                      style: TextStyle(color: color)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.9,
              ),
              itemCount: services.length,
              itemBuilder: (context, index) {
                return _buildServiceItem(services[index]);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceItem(Service service) {
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: () {},
      child: Container(
        decoration: BoxDecoration(
          color: service.color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: service.color.withOpacity(0.3)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(service.icon, size: 32, color: service.color),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4.0),
              child: Text(service.name,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: service.color)),
            ),
          ],
        ),
      ),
    );
  }
}

class Service {
  final IconData icon;
  final String name;
  final Color color;

  Service(this.icon, this.name, this.color);
}