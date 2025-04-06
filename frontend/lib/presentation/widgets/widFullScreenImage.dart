import 'package:flutter/material.dart';

class blcFullScreenImage extends StatelessWidget {
  final String imageUrl;

  const blcFullScreenImage({super.key, required this.imageUrl});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          Center(
            child: Image.network(
              imageUrl,
              fit: BoxFit.contain, // Ensures proper scaling
              errorBuilder: (context, error, stackTrace) {
                return const Icon(Icons.image, size: 200, color: Colors.grey);
              },
            ),
          ),
          Positioned(
            top: 40,
            right: 20,
            child: IconButton(
              icon: const Icon(Icons.close, size: 30, color: Colors.black),
              onPressed: () {
                Navigator.pop(context); // Close the fullscreen image
              },
            ),
          ),
        ],
      ),
    );
  }
}
