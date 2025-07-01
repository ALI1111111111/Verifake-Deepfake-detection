import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  AuthProvider(this.api) {
    _loadToken();
  }

  final ApiService api;
  String? _token;
  User? _user;
  bool _loading = false;

  String? get token => _token;
  User? get user => _user;
  bool get isAuthenticated => _token != null;
  bool get loading => _loading;

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString('token');
    if (saved != null) {
      _token = saved;
      await fetchUser();
    }
  }

  Future<void> login(String email, String password) async {
    _loading = true;
    notifyListeners();
    try {
      final token = await api.login(email, password);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);
      _token = token;
      await fetchUser();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> register(String email, String password, String name) async {
    _loading = true;
    notifyListeners();
    try {
      await api.register(email, password, name);
      await login(email, password);
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> fetchUser() async {
    if (_token == null) return;
    _user = await api.fetchUser(_token!);
    notifyListeners();
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    _token = null;
    _user = null;
    notifyListeners();
  }
}
