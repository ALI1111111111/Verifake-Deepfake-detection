import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/analysis.dart';

class AnalysisProvider with ChangeNotifier {
  final ApiService _api;
  
  AnalysisProvider(this._api);

  List<Analysis> _analyses = [];
  bool _loading = false;
  String _error = '';
  int _progress = 0;

  List<Analysis> get analyses => _analyses;
  bool get loading => _loading;
  String get error => _error;
  int get progress => _progress;

  Future<void> loadAnalyses() async {
    _loading = true;
    _error = '';
    notifyListeners();

    try {
      _analyses = await _api.getAnalyses();
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<Analysis?> analyzeFile(String filePath, String service) async {
    _loading = true;
    _progress = 0;
    _error = '';
    notifyListeners();

    try {
      _progress = 25;
      notifyListeners();
      
      final analysis = await _api.analyzeFile(filePath, service);
      
      _progress = 100;
      notifyListeners();
      
      if (analysis != null) {
        _analyses.insert(0, analysis);
      }
      
      return analysis;
    } catch (e) {
      _error = e.toString();
      return null;
    } finally {
      _loading = false;
      _progress = 0;
      notifyListeners();
    }
  }

  void clearError() {
    _error = '';
    notifyListeners();
  }
}
