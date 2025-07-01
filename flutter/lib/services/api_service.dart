import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
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

  Future<List<Analysis>> fetchAnalyses(String token) async {
    final resp = await http.get(
      Uri.parse('$baseUrl/analyses'),
      headers: {HttpHeaders.authorizationHeader: 'Bearer $token'},
    );
    if (resp.statusCode == 200) {
      final data = json.decode(resp.body) as List<dynamic>;
      return data.map((e) => Analysis.fromJson(e as Map<String, dynamic>)).toList();
    } else {
      throw Exception('Failed to load analyses');
    }
  }

  Future<Analysis> analyze(String token, File file, String service) async {
    final request = http.MultipartRequest('POST', Uri.parse('$baseUrl/detect'))
      ..headers[HttpHeaders.authorizationHeader] = 'Bearer $token'
      ..fields['service'] = service
      ..files.add(await http.MultipartFile.fromPath('file', file.path));

    final resp = await request.send();
    final body = await resp.stream.bytesToString();
    if (resp.statusCode == 200) {
      return Analysis.fromJson(json.decode(body) as Map<String, dynamic>);
    } else {
      throw Exception('Analysis failed');
    }
  }
}
