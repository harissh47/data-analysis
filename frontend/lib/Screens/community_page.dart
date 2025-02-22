import 'package:flutter/material.dart';

import '../Helper/GradientContainer.dart';

class CommunityPage extends StatelessWidget {
  const CommunityPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Community",
            style: TextStyle(fontWeight: FontWeight.bold)),
        flexibleSpace: buildGradientBackground(),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              _buildCommunityCard(
                title: "Latest Announcements",
                color: Colors.purple[800]!,
                items: 3,
              ),
              const SizedBox(height: 24),
              _buildCommunityCard(
                title: "Upcoming Events",
                color: Colors.orange[800]!,
                items: 2,
              ),
              const SizedBox(height: 24),
              _buildCommunityCard(
                title: "Active Polls",
                color: Colors.teal[800]!,
                items: 1,
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.blue[800],
        child: const Icon(Icons.add, color: Colors.white),
        onPressed: () {},
      ),
    );
  }

  Widget _buildCommunityCard({required String title, required Color color, required int items}) {
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
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: items,
              separatorBuilder: (context, index) => const Divider(),
              itemBuilder: (context, index) => ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.campaign, color: color),
                ),
                title: Text("Community Meeting ${index + 1}"),
                subtitle: Text("June ${15 + index}, 2024 | Club House"),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
              ),
            ),
            if(items == 0) Padding(
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: Text("No items available",
                  style: TextStyle(color: Colors.grey[600])),
            )
          ],
        ),
      ),
    );
  }
}