# Flutter Mobile App

This directory contains a basic Flutter application that mirrors the React frontend.
The platform folders were omitted to keep the repository small. To run the app:

1. Install Flutter and run `flutter create .` inside this `flutter` directory to generate the missing platform files.
2. Replace the generated `lib` folder with the one in this repo.
3. Run `flutter pub get` and `flutter run`.

The app expects the Laravel backend to be running locally. When testing on an
Android emulator, use `http://10.0.2.2:8000` as the base URL so the emulator can
reach your host machine. Update `main.dart` if your backend runs elsewhere.
