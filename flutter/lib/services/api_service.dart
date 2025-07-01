import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import '../models/analysis.dart';
import '../models/user.dart';

class ApiService {
  ApiService(this.baseUrl);

  final String baseUrl;

  Future<User> register(String email, String password, String name) async {
    final resp = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      body: {'email': email, 'password': password, 'name': name},
    );
    if (resp.statusCode == 201) {
      return User.fromJson(json.decode(resp.body));
    } else {
      throw Exception('Failed to register');
    }
  }

  Future<String> login(String email, String password) async {
    final resp = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      body: {'email': email, 'password': password},
    );
    if (resp.statusCode == 200) {
      final data = json.decode(resp.body) as Map<String, dynamic>;
      return data['token'] as String;
    } else {
      throw Exception('Invalid credentials');
    }
  }

  Future<User> fetchUser(String token) async {
    final resp = await http.get(
      Uri.parse('$baseUrl/user'),
      headers: {HttpHeaders.authorizationHeader: 'Bearer $token'},
    );
    if (resp.statusCode == 200) {
      return User.fromJson(json.decode(resp.body));
    } else {
      throw Exception('Failed to load user');
    }
  }

  Future<List<Analysis>> getAnalyses() async {
    final resp = await http.get(
      Uri.parse('$baseUrl/analyses'),
    );
    if (resp.statusCode == 200) {
      final data = json.decode(resp.body) as List<dynamic>;
      return data
          .map((e) => Analysis.fromJson(e as Map<String, dynamic>))
          .toList();
    } else {
      throw Exception('Failed to load analyses');
    }
  }

  Future<List<Analysis>> fetchAnalyses(String token) async {
    final resp = await http.get(
      Uri.parse('$baseUrl/analyses'),
      headers: {HttpHeaders.authorizationHeader: 'Bearer $token'},
    );
    if (resp.statusCode == 200) {
      final data = json.decode(resp.body) as List<dynamic>;
      return data
          .map((e) => Analysis.fromJson(e as Map<String, dynamic>))
          .toList();
    } else {
      throw Exception('Failed to load analyses');
    }
  }

  Future<Analysis?> analyzeFile(String filePath, String service) async {
    final file = File(filePath);
    final request = http.MultipartRequest('POST', Uri.parse('$baseUrl/detect'))
      ..fields['service'] = service
      ..files.add(await http.MultipartFile.fromPath('file', file.path));

    final resp = await request.send();
    final body = await resp.stream.bytesToString();
    // Accept both 200 (OK) and 201 (Created) as successful responses
    if (resp.statusCode == 200 || resp.statusCode == 201) {
      return Analysis.fromJson(json.decode(body) as Map<String, dynamic>);
    } else {
      throw Exception('Analysis failed: HTTP ${resp.statusCode} - $body');
    }
  }

  Future<Analysis> analyze(String token, File file, String service) async {
    final request = http.MultipartRequest('POST', Uri.parse('$baseUrl/detect'))
      ..headers[HttpHeaders.authorizationHeader] = 'Bearer $token'
      ..fields['service'] = service
      ..files.add(await http.MultipartFile.fromPath('file', file.path));

    final resp = await request.send();
    final body = await resp.stream.bytesToString();
    // Accept both 200 (OK) and 201 (Created) as successful responses
    if (resp.statusCode == 200 || resp.statusCode == 201) {
      return Analysis.fromJson(json.decode(body) as Map<String, dynamic>);
    } else {
      throw Exception('Analysis failed: HTTP ${resp.statusCode} - $body');
    }
  }

  Future<Analysis> analyzeFileData(
    String token, {
    File? file,
    Uint8List? fileBytes,
    required String fileName,
    required String service,
  }) async {
    final request = http.MultipartRequest('POST', Uri.parse('$baseUrl/detect'))
      ..headers[HttpHeaders.authorizationHeader] = 'Bearer $token'
      ..fields['service'] = service;

    if (kIsWeb && fileBytes != null) {
      // Web upload using bytes
      request.files.add(http.MultipartFile.fromBytes(
        'file',
        fileBytes,
        filename: fileName,
      ));
    } else if (file != null) {
      // Mobile upload using file path
      request.files.add(await http.MultipartFile.fromPath('file', file.path));
    } else {
      throw Exception('No file provided');
    }

    final resp = await request.send();
    final body = await resp.stream.bytesToString();

    // Accept both 200 (OK) and 201 (Created) as successful responses
    if (resp.statusCode == 200 || resp.statusCode == 201) {
      try {
        final jsonData = json.decode(body) as Map<String, dynamic>;
        return Analysis.fromJson(jsonData);
      } catch (e) {
        throw Exception('Failed to parse response: $e');
      }
    } else {
      throw Exception('Analysis failed: HTTP ${resp.statusCode} - $body');
    }
  }

  // Check connectivity by making a simple health check request
  Future<bool> checkConnectivity() async {
    try {
      final resp = await http.get(
        Uri.parse('$baseUrl/health'),
        headers: {'Accept': 'application/json'},
      ).timeout(const Duration(seconds: 5));
      return resp.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  // Test if an image URL is accessible
  Future<bool> testImageUrl(String imageUrl) async {
    try {
      final resp = await http.head(Uri.parse(imageUrl));
      return resp.statusCode == 200;
    } catch (e) {
      print('Image test failed for $imageUrl: $e');
      return false;
    }
  }
}
