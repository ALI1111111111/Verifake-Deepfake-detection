import 'package:flutter/material.dart';
import '../models/analysis.dart';

class AnalysisDebugWidget extends StatelessWidget {
  const AnalysisDebugWidget({super.key, required this.analysis});

  final Analysis analysis;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(8),
      child: ExpansionTile(
        title: Text('Debug: Analysis ${analysis.id}'),
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('ID: ${analysis.id}'),
                Text('Service: ${analysis.service}'),
                Text('File Path: ${analysis.filePath}'),
                Text('File URL: ${analysis.fileUrl}'),
                Text('Created: ${analysis.formattedDate}'),
                Text('Result: ${analysis.result}'),
                const SizedBox(height: 8),
                if (analysis.fileUrl.isNotEmpty)
                  ElevatedButton(
                    onPressed: () {
                      // Test image loading
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          title: const Text('Image Test'),
                          content: SizedBox(
                            width: 200,
                            height: 200,
                            child: Image.network(
                              analysis.fileUrl,
                              errorBuilder: (context, error, stackTrace) {
                                return Column(
                                  children: [
                                    const Icon(Icons.error),
                                    Text('Error: $error'),
                                  ],
                                );
                              },
                            ),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Close'),
                            ),
                          ],
                        ),
                      );
                    },
                    child: const Text('Test Image Load'),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
