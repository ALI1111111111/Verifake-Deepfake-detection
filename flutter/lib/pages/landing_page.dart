import 'package:flutter/material.dart';
import 'login_page.dart';
import 'register_page.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  Widget _feature(IconData icon, String title, String text) {
    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: Column(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: Colors.indigo,
            child: Icon(icon, color: Colors.white),
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text(
            text,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 12),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            title: const Text('VeriFake'),
            actions: [
              TextButton(
                onPressed: () => Navigator.push(
                    context, MaterialPageRoute(builder: (_) => const LoginPage())),
                child: const Text('Log In', style: TextStyle(color: Colors.white)),
              ),
              TextButton(
                onPressed: () => Navigator.push(
                    context, MaterialPageRoute(builder: (_) => const RegisterPage())),
                child: const Text('Sign Up', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 20),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xfff0f9ff), Color(0xffe0f2fe)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                children: [
                  const Text(
                    'Detect Deep Fake Easily in Seconds',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Use VeriFake to analyze videos, images, and audio files for authenticity with our cutting-edge AI technology',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      ElevatedButton(
                        onPressed: () => Navigator.push(
                            context, MaterialPageRoute(builder: (_) => const RegisterPage())),
                        child: const Text('Get Started'),
                      ),
                      OutlinedButton(
                        onPressed: () {},
                        child: const Text('See Demo'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Fantastic Features',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Powerful tools to detect and analyze deep fakes across all media formats',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    children: [
                      _feature(Icons.bolt, 'Real-Time Detection',
                          'Analyze media files in real-time.'),
                      _feature(Icons.video_collection, 'Comprehensive Analysis',
                          'Check videos, audio and images.'),
                      _feature(Icons.shield, 'Privacy Protection',
                          'Your files are processed securely.'),
                      _feature(Icons.people, 'Multi-User Support',
                          'Collaborate with your team.'),
                    ],
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Container(
              color: Colors.white,
              padding: const EdgeInsets.all(20),
              child: Column(
                children: const [
                  Text(
                    'About VeriFake',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Our mission is to empower individuals and organizations with cutting-edge tools to detect deep fakes.',
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xff2563eb), Color(0xff8b5cf6)],
                ),
              ),
              child: Column(
                children: const [
                  Icon(Icons.cloud_upload, size: 48, color: Colors.white),
                  SizedBox(height: 16),
                  Text(
                    'Drop your video/audio/picture here',
                    style: TextStyle(color: Colors.white, fontSize: 18),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Container(
              color: Colors.black87,
              padding: const EdgeInsets.all(20),
              child: const Center(
                child: Text(
                  '© 2024 VeriFake Technologies',
                  style: TextStyle(color: Colors.white70),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
