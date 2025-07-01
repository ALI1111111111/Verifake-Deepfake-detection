import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'services/api_service.dart';
import 'providers/auth_provider.dart';
import 'providers/analysis_provider.dart';
import 'pages/splash_screen.dart';
import 'pages/onboarding_screen.dart';
import 'pages/auth_screen.dart';
import 'pages/login_page_mobile.dart';
import 'pages/register_page_mobile.dart';
import 'pages/main_screen.dart';
import 'pages/guest_landing_screen.dart';
import 'widgets/auth_guard.dart';

void main() {
  final api = ApiService('http://localhost:8001/api');
  runApp(MyApp(api: api));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key, required this.api});

  final ApiService api;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider(api)),
        ChangeNotifierProvider(create: (_) => AnalysisProvider(api)),
      ],
      child: MaterialApp(
        title: 'VeriFake - Deepfake Detection',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.blue,
          primaryColor: const Color(0xFF2563EB),
          textTheme: GoogleFonts.poppinsTextTheme(),
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.white,
            foregroundColor: Colors.black,
            elevation: 0,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2563EB),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          useMaterial3: true,
        ),
        initialRoute: '/',
        routes: {
          '/': (_) => const SplashScreen(),
          '/onboarding': (_) => const OnboardingScreen(),
          '/auth': (_) => const GuestGuard(child: AuthScreen()),
          '/login': (_) => const GuestGuard(child: LoginPageMobile()),
          '/register': (_) => const GuestGuard(child: RegisterPageMobile()),
          '/guest': (_) => const GuestLandingScreen(),
          '/main': (_) => const AuthGuard(child: MainScreen()),
        },
      ),
    );
  }
}
