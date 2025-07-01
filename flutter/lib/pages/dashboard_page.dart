import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/analysis.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../widgets/analysis_tile.dart';
import '../theme.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  List<Analysis> analyses = [];
  bool loading = false;

  @override
  void initState() {
    super.initState();
    _loadAnalyses();
  }

  Future<void> _loadAnalyses() async {
    final auth = context.read<AuthProvider>();
    final api = auth.api;
    final list = await api.fetchAnalyses(auth.token!);
    setState(() => analyses = list);
  }

  Future<void> _pickAndAnalyze() async {
    final auth = context.read<AuthProvider>();
    final api = auth.api;
    final result = await FilePicker.platform.pickFiles();
    if (result != null && result.files.single.path != null) {
      setState(() => loading = true);
      try {
        final analysis = await api.analyze(
          auth.token!,
          File(result.files.single.path!),
          'deepfake',
        );
        setState(() => analyses.insert(0, analysis));
      } finally {
        setState(() => loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, ${auth.user?.name ?? ''}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await auth.logout();
              if (mounted) Navigator.pushReplacementNamed(context, '/');
            },
          )
        ],
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ElevatedButton(
                  onPressed: loading ? null : _pickAndAnalyze,
                  style: ElevatedButton.styleFrom(backgroundColor: primaryColor),
                  child: Text(loading ? 'Analyzing...' : 'Upload File'),
                ),
                const SizedBox(height: 20),
                Expanded(
                  child: ListView(
                    children: analyses
                        .map((a) => AnalysisTile(analysis: a))
                        .toList(),
                  ),
                ),
              ],
            ),
          ),
          if (loading)
            Container(
              color: Colors.black54,
              child: const Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }
}
