import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'services/api_service.dart';
import 'providers/auth_provider.dart';
import 'pages/landing_page.dart';
import 'pages/login_page.dart';
import 'pages/register_page.dart';
import 'pages/dashboard_page.dart';
import 'pages/results_page.dart';
import 'pages/profile_page.dart';

void main() {
  // Use 10.0.2.2 for Android emulators when accessing the local backend.
  const baseUrl = 'http://10.0.2.2:8000/api';
  final api = ApiService(baseUrl);
  runApp(MyApp(api: api));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key, required this.api});

  final ApiService api;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AuthProvider(api),
      child: MaterialApp(
        title: 'VeriFake',
        theme: ThemeData(
          primaryColor: const Color(0xff2563eb),
          colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xff2563eb)),
          textTheme: GoogleFonts.poppinsTextTheme(),
          useMaterial3: true,
        ),
        initialRoute: '/',
        routes: {
          '/': (_) => const LandingPage(),
          '/login': (_) => const LoginPage(),
          '/register': (_) => const RegisterPage(),
          '/dashboard': (_) => const DashboardPage(),
          '/results': (_) => const ResultsPage(),
          '/profile': (_) => const ProfilePage(),
        },
      ),
    );
  }
}
