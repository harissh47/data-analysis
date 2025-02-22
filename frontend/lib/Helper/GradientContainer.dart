import 'package:flutter/material.dart';

Container buildGradientBackground() {
  return Container(
    decoration: BoxDecoration(
      gradient: LinearGradient(
        colors: [Colors.blue[800]!, Colors.blue[600]!],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
  );
}
