import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Hello, User", 
                style: TextStyle(fontSize: 16, color: Colors.white70)),
            Text("TOWER-A 1504",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.blue[800]!, Colors.blue[600]!],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: CircleAvatar(
              backgroundColor: Colors.white,
              child: IconButton(
                icon: Icon(Icons.person, color: Colors.blue[800]),
                onPressed: () {},
              ),
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Apartment Info Card
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blue[50]!, Colors.white],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 8,
                      offset: Offset(0, 4),)
                  ],
                ),
                child: Row(
                  children: [
                    Icon(Icons.apartment, size: 40, color: Colors.blue[800]),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text("8 Members",
                              style: TextStyle(color: Colors.grey[600])),
                          const SizedBox(height: 4),
                          const Text("Your Community",
                              style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                    ElevatedButton.icon(
                      icon: const Icon(Icons.arrow_forward, size: 18, color: Colors.white),
                      label: const Text("View Details", style: TextStyle(color: Colors.white)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue[800],
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                      onPressed: () {},
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Quick Actions
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildQuickAction(
                      Icons.check_circle_outline, 
                      "Pre-Approve Entry",
                      Colors.blue),
                  _buildQuickAction(
                      Icons.person_add_alt_1, 
                      "Add Daily Help",
                      Colors.orange),
                ],
              ),

              const SizedBox(height: 24),

              // Announcements Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("Latest Announcements",
                      style: Theme.of(context).textTheme.titleLarge),
                  TextButton.icon(
                    icon: const Icon(Icons.arrow_forward, size: 16),
                    label: const Text("View All"),
                    onPressed: () {},
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Container(
                height: 150,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  // image: DecorationImage(
                  //   image: AssetImage('assets/announcement_bg.png'), // Add your image
                  //   fit: BoxFit.cover,
                  //   colorFilter: ColorFilter.mode(
                  //       Colors.black.withOpacity(0.2), BlendMode.darken),
                  // ),
                ),
                child: const Center(
                  child: Text("No new announcements",
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold)),
                ),
              ),

              const SizedBox(height: 24),

              // Testimonials Section
              Text("Resident Testimonials",
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              SizedBox(
                height: 200,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _buildTestimonialCard(
                        "Jayanthi Ragotham",
                        "Olympia Opaline, Chennai",
                        "MyGate has been very helpful in enhancing the safety of our older residents."),
                    _buildTestimonialCard(
                        "Rahul Sharma",
                        "Skyview Apartments, Mumbai",
                        "Excellent service and quick response time from the security team."),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickAction(IconData icon, String text, Color color) {
    return InkWell(
      borderRadius: BorderRadius.circular(20),
      onTap: () {},
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 16, horizontal: 24),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, size: 32, color: color),
            SizedBox(height: 8),
            Text(text,
                style: TextStyle(
                    color: color,
                    fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  Widget _buildTestimonialCard(String name, String location, String text) {
    return Container(
      width: 280,
      margin: EdgeInsets.only(right: 16),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 8,
            offset: Offset(0, 4),
        ),
        ]
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: Colors.blue[100],
                child: Icon(Icons.person, color: Colors.blue[800]),
              ),
              SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: TextStyle(fontWeight: FontWeight.bold)),
                  Text(location, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                ],
              ),
            ],
          ),
          SizedBox(height: 12),
          Expanded(
            child: Text(text,
                style: TextStyle(fontStyle: FontStyle.italic),
                overflow: TextOverflow.ellipsis,
                maxLines: 4),
          ),
          Align(
            alignment: Alignment.centerRight,
            child: Icon(Icons.format_quote, color: Colors.grey[400], size: 32),
          )
        ],
      ),
    );
  }
}