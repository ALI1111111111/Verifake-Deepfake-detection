import 'package:flutter/material.dart';
import '../models/analysis.dart';

class AnalysisTile extends StatelessWidget {
  const AnalysisTile({super.key, required this.analysis});

  final Analysis analysis;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: analysis.fileUrl.isNotEmpty
            ? Image.network(
                analysis.fileUrl,
                width: 50,
                height: 50,
                fit: BoxFit.cover,
              )
            : const Icon(Icons.image),
        title: Text(analysis.service),
        subtitle: Text(analysis.result.toString()),
      ),
    );
  }
}
