import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../theme.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xfff0f9ff), Color(0xffe0f2fe)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Card(
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        'Create Account',
                        style: Theme.of(context).textTheme.headlineSmall,
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _nameController,
                        decoration:
                            const InputDecoration(labelText: 'Full Name'),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _emailController,
                        decoration: const InputDecoration(labelText: 'Email'),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _passwordController,
                        decoration:
                            const InputDecoration(labelText: 'Password'),
                        obscureText: true,
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: auth.loading
                            ? null
                            : () async {
                                await auth.register(
                                  _emailController.text,
                                  _passwordController.text,
                                  _nameController.text,
                                );
                                if (auth.isAuthenticated && mounted) {
                                  Navigator.pushReplacementNamed(
                                      context, '/main');
                                }
                              },
                        style: ElevatedButton.styleFrom(
                            backgroundColor: primaryColor),
                        child: Text(auth.loading ? 'Loading...' : 'Sign Up'),
                      ),
                      TextButton(
                        onPressed: () =>
                            Navigator.pushReplacementNamed(context, '/login'),
                        child: const Text('Have an account? Log in'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          if (auth.loading)
            Container(
              color: Colors.black45,
              child: const Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }
}
