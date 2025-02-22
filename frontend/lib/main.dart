import 'package:flutter/material.dart';
import 'package:frontend/Login/introduction_page.dart';
import 'package:frontend/Login/login_page.dart';
import 'package:frontend/Login/register_page.dart';

import 'Navigation/main_navigation.dart';
 // Update the path if needed

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Login Page',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home: const MainNavigation(), // Directly loading the LoginPage PgIntroductionAnimationScreen()
    );
  }
}
