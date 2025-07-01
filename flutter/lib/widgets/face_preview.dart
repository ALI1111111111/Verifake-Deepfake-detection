import 'package:flutter/material.dart';

class FacePreview extends StatelessWidget {
  const FacePreview({
    super.key,
    required this.src,
    this.faces = const [],
  });

  final String src;
  final List<Map<String, dynamic>> faces;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 128, // equivalent to h-32 in Tailwind
      child: Stack(
        children: [
          // Base image
          Image.network(
            src,
            height: 128,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              return Container(
                height: 128,
                width: 128,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.broken_image,
                  color: Colors.grey,
                  size: 32,
                ),
              );
            },
          ),
          // Face detection boxes
          ...faces.asMap().entries.map((entry) {
            final face = entry.value;
            final x = (face['x'] as num?)?.toDouble() ?? 0.0;
            final y = (face['y'] as num?)?.toDouble() ?? 0.0;
            final w = (face['w'] as num?)?.toDouble() ?? 0.0;
            final h = (face['h'] as num?)?.toDouble() ?? 0.0;

            return Positioned(
              left: x * 128 - (w * 128 / 2), // Convert percentage to pixels and center
              top: y * 128 - (h * 128 / 2),
              width: w * 128,
              height: h * 128,
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: Colors.red,
                    width: 2,
                  ),
                  borderRadius: BorderRadius.circular(64), // Make it circular
                ),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }
}
