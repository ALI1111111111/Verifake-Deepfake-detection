# Flutter Mobile App - VeriFake

## Overview
This is the mobile application for the Deepfake Detection system built with Flutter. It provides a native mobile experience for iOS and Android devices, mirroring the functionality of the React web application.

## 🚀 Tech Stack
- **Framework**: Flutter 3.16+
- **Language**: Dart 3.0+
- **State Management**: Provider / Riverpod
- **HTTP Client**: Dio
- **Storage**: SharedPreferences + Secure Storage
- **Navigation**: Go Router
- **UI**: Material Design 3

## 📁 Project Structure
```
flutter/
├── lib/
│   ├── main.dart           # App entry point
│   ├── models/             # Data models
│   ├── providers/          # State management
│   ├── services/           # API services
│   ├── screens/            # Screen widgets
│   │   ├── auth/          # Login/Register screens
│   │   ├── dashboard/     # Main dashboard
│   │   └── results/       # Results viewing
│   ├── widgets/           # Reusable widgets
│   │   ├── common/        # Common UI components
│   │   └── custom/        # Custom components
│   └── utils/             # Utilities and helpers
├── android/               # Android platform files
├── ios/                  # iOS platform files
├── web/                  # Web platform files (optional)
├── test/                 # Unit and widget tests
└── pubspec.yaml          # Dependencies
```

## 🔧 Setup Instructions

### Prerequisites
- Flutter 3.16+
- Dart 3.0+
- Android Studio / VS Code
- iOS development (macOS only)

### Installation
```bash
# Navigate to flutter directory
cd flutter

# Install Flutter (if not already installed)
# Follow: https://flutter.dev/docs/get-started/install

# Generate platform files (if missing)
flutter create . --platforms android,ios

# Install dependencies
flutter pub get

# Run on device/emulator
flutter run

# Run on specific platform
flutter run -d android
flutter run -d ios
```

## 🔐 Configuration

### API Configuration
Update `lib/services/api_service.dart`:
```dart
class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8000/api'; // Android emulator
  // static const String baseUrl = 'http://localhost:8000/api'; // iOS simulator
  // static const String baseUrl = 'https://your-api.com/api'; // Production
}
```

### Environment Variables
Create `lib/config/app_config.dart`:
```dart
class AppConfig {
  static const String appName = 'VeriFake';
  static const String version = '1.0.0';
  static const String apiUrl = 'http://10.0.2.2:8000/api';
  static const bool isDebug = true;
}
```

## 📱 Features

### Authentication
- **Login/Register**: Native form inputs with validation
- **Biometric Auth**: Fingerprint/Face ID support (planned)
- **Token Storage**: Secure token management
- **Auto-login**: Remember user sessions

### File Upload
- **Camera Integration**: Take photos/videos directly
- **Gallery Selection**: Choose from device gallery
- **File Browser**: Select any supported file type
- **Progress Tracking**: Upload progress indicators

### Analysis Services
- **Deepfake Detection**: Video/image deepfake analysis
- **Face Detection**: Facial recognition and analysis
- **Content Moderation**: Detect inappropriate content
- **Multi-service**: Support for all backend services

### User Interface
- **Material Design 3**: Modern Android design
- **Cupertino**: iOS-style widgets for iOS
- **Dark/Light Theme**: Theme switching support
- **Responsive**: Adapts to different screen sizes

## 🔌 API Integration

### Authentication Service
```dart
class AuthService {
  Future<User> login(String email, String password);
  Future<User> register(String name, String email, String password);
  Future<void> logout();
  Future<User?> getCurrentUser();
}
```

### Analysis Service
```dart
class AnalysisService {
  Future<Analysis> submitFile(File file, String service);
  Future<List<Analysis>> getHistory();
  Future<Analysis> getResult(String id);
}
```

## 🎨 UI Components

### Custom Widgets
```dart
// File upload widget
FileUploadWidget(
  onFileSelected: (File file) {},
  acceptedTypes: ['.jpg', '.mp4', '.mp3'],
  maxSizeMB: 100,
)

// Analysis result card
AnalysisResultCard(
  analysis: analysis,
  onTap: () => showDetails(analysis),
)

// Service selection
ServiceSelector(
  services: AnalysisService.values,
  onChanged: (service) => setState(() => _selectedService = service),
)
```

### Navigation
```dart
// Go Router configuration
final router = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (context, state) => SplashScreen()),
    GoRoute(path: '/login', builder: (context, state) => LoginScreen()),
    GoRoute(path: '/dashboard', builder: (context, state) => DashboardScreen()),
    // Protected routes with authentication guard
  ],
);
```

## 🧪 Testing
```bash
# Run unit tests
flutter test

# Run integration tests
flutter test integration_test/

# Run tests with coverage
flutter test --coverage

# Generate coverage report
genhtml coverage/lcov.info -o coverage/html
```

## 📦 Dependencies
```yaml
dependencies:
  flutter:
    sdk: flutter
  dio: ^5.3.0                    # HTTP client
  provider: ^6.0.0               # State management
  shared_preferences: ^2.2.0     # Local storage
  flutter_secure_storage: ^9.0.0 # Secure storage
  image_picker: ^1.0.0           # Camera/gallery access
  file_picker: ^6.0.0            # File selection
  go_router: ^12.0.0             # Navigation
  
dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
  flutter_lints: ^3.0.0
```

## 🚀 Platform-Specific Setup

### Android
1. **Permissions** (android/app/src/main/AndroidManifest.xml):
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

2. **Network Security** (android/app/src/main/res/xml/network_security_config.xml):
```xml
<network-security-config>
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">10.0.2.2</domain>
    <domain includeSubdomains="true">localhost</domain>
  </domain-config>
</network-security-config>
```

### iOS
1. **Permissions** (ios/Runner/Info.plist):
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to capture photos for analysis</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to select images for analysis</string>
```

## 🔒 Security Features
- **Secure Storage**: Sensitive data encryption
- **Certificate Pinning**: API security (planned)
- **Biometric Auth**: Device security integration
- **Input Validation**: Client-side validation

## 📊 Performance
- **Image Compression**: Optimize file sizes before upload
- **Lazy Loading**: Efficient list rendering
- **Caching**: Image and data caching
- **Background Processing**: Handle uploads in background

## 🚀 Build & Release
```bash
# Android APK
flutter build apk --release

# Android App Bundle
flutter build appbundle --release

# iOS
flutter build ios --release

# Install on device
flutter install
```

## 🐛 Debugging
```bash
# Debug mode
flutter run --debug

# Profile mode
flutter run --profile

# Inspector
flutter inspector

# Logs
flutter logs
```

## 🤝 Contributing
1. Follow Flutter/Dart conventions
2. Use proper state management patterns
3. Write tests for new features
4. Update documentation
5. Test on both Android and iOS

## 📚 Resources
- [Flutter Documentation](https://docs.flutter.dev)
- [Dart Language](https://dart.dev)
- [Material Design 3](https://m3.material.io)
- [Flutter Cookbook](https://docs.flutter.dev/cookbook)
Android emulator, use `http://10.0.2.2:8000` as the base URL so the emulator can
reach your host machine. Update `main.dart` if your backend runs elsewhere.
