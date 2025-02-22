import 'package:flutter/material.dart';

import '../Helper/GradientContainer.dart';

class MarketplacePage extends StatelessWidget {
  final List<MarketItem> items = [
    MarketItem("Sofa Set", "₹15,000", "Pre-owned 3-seater sofa", "user1"),
    MarketItem("Bookshelf", "₹4,500", "Teak wood shelf", "user2"),
    MarketItem("AC Unit", "₹25,000", "1.5 ton, 3 years old", "user3"),
  ];

  MarketplacePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Marketplace",
            style: TextStyle(fontWeight: FontWeight.bold)),
        flexibleSpace: buildGradientBackground(),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
        ],
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
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text("Recent Listings",
                              style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green[800])),
                          TextButton(
                            onPressed: () {},
                            child: Text("View All",
                                style: TextStyle(color: Colors.green[800])),
                          ),
                        ],
                      ),
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: items.length,
                        separatorBuilder: (context, index) => const Divider(),
                        itemBuilder: (context, index) => ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12),
                              color: Colors.grey[200],
                            ),
                            child: Icon(Icons.image, color: Colors.grey[500]),
                          ),
                          title: Text(items[index].title),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(items[index].price,
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.green[800])),
                              Text(items[index].description,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis),
                              const SizedBox(height: 4),
                              Text("Sold by: ${items[index].seller}",
                                  style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey[600])),
                            ],
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.green[800],
        child: const Icon(Icons.add, color: Colors.white),
        onPressed: () {},
      ),
    );
  }
}

class MarketItem {
  final String title;
  final String price;
  final String description;
  final String seller;

  MarketItem(this.title, this.price, this.description, this.seller);
}