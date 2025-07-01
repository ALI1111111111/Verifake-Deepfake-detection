import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';

class CustomNavbar extends StatelessWidget {
  const CustomNavbar({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Container(
      height: 80,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.95),
        border: const Border(
          bottom: BorderSide(
            color: Color(0xFFe5e7eb),
            width: 1,
          ),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Logo
            GestureDetector(
              onTap: () => Navigator.pushNamed(context, '/'),
              child: Row(
                children: [
                  Icon(
                    Icons.security,
                    size: 28,
                    color: Color(0xFF8b5cf6),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'VeriFake',
                    style: TextStyle(
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.w900,
                      fontSize: 28,
                      color: Color(0xFF2563eb),
                    ),
                  ),
                ],
              ),
            ),
            // Navigation Links
            if (auth.isAuthenticated) ...[
              Row(
                children: [
                  _buildNavLink(context, 'Dashboard', '/dashboard'),
                  const SizedBox(width: 20),
                  _buildNavLink(context, 'Results', '/results'),
                  const SizedBox(width: 20),
                  _buildNavLink(context, 'Profile', '/profile'),
                  const SizedBox(width: 20),
                  _buildLogoutButton(context),
                ],
              ),
            ] else ...[
              Row(
                children: [
                  _buildAuthButton(
                    context,
                    'Log In',
                    () => Navigator.pushNamed(context, '/login'),
                    isPrimary: false,
                  ),
                  const SizedBox(width: 15),
                  _buildAuthButton(
                    context,
                    'Sign Up',
                    () => Navigator.pushNamed(context, '/register'),
                    isPrimary: true,
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildNavLink(BuildContext context, String title, String route) {
    final isActive = ModalRoute.of(context)?.settings.name == route;
    
    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, route),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: isActive ? const Color(0xFF2563eb) : Colors.transparent,
              width: 3,
            ),
          ),
        ),
        child: Text(
          title,
          style: TextStyle(
            color: isActive ? const Color(0xFF2563eb) : const Color(0xFF0f172a),
            fontWeight: FontWeight.w500,
            fontSize: 16,
          ),
        ),
      ),
    );
  }

  Widget _buildAuthButton(
    BuildContext context,
    String title,
    VoidCallback onPressed, {
    required bool isPrimary,
  }) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: isPrimary ? const Color(0xFF2563eb) : Colors.transparent,
        foregroundColor: isPrimary ? Colors.white : const Color(0xFF2563eb),
        side: isPrimary ? null : const BorderSide(color: Color(0xFF2563eb), width: 2),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        elevation: isPrimary ? 2 : 0,
      ),
      child: Text(
        title,
        style: const TextStyle(
          fontWeight: FontWeight.w500,
          fontSize: 16,
        ),
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        final auth = context.read<AuthProvider>();
        await auth.logout();
        Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: const Color(0xFFef4444),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Icon(
              Icons.logout,
              size: 16,
              color: Colors.white,
            ),
            const SizedBox(width: 4),
            const Text(
              'Logout',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w500,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
