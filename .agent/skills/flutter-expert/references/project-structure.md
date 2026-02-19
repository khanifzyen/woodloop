# Project Structure

## Feature-First Clean Architecture

```text
lib/
├── main.dart                  # Application entry point
├── app.dart                   # Material App & Global Providers
├── injection_container.dart   # DI Setup (GetIt + Injectable)
├── core/
│   ├── constants/             # App-wide constants (colors, strings)
│   ├── error/                 # Failures & Exceptions
│   ├── network/               # Network clients (Dio)
│   ├── usecases/              # Base UseCase interface
│   └── util/                  # Extensions, validators, input converters
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── datasources/   # Remote/Local data sources
│   │   │   ├── models/        # DTOs (fromJson/toJson)
│   │   │   └── repositories/  # Repository Implementations
│   │   ├── domain/
│   │   │   ├── entities/      # Pure Dart Objects
│   │   │   ├── repositories/  # Repository Interfaces
│   │   │   └── usecases/      # Business Logic (callable classes)
│   │   └── presentation/
│   │       ├── bloc/          # Bloc/Cubit & States
│   │       ├── pages/         # Scaffold Screens
│   │       └── widgets/       # Feature-specific Widgets
│   └── home/
│       └── ...
└── shared/
    ├── widgets/               # Reusable UI components
    └── domain/                # Shared entities/logic
```

## pubspec.yaml Essentials

> **Important**: Always use the command `flutter pub add <package-name>` to add packages. Do not directly edit `pubspec.yaml`.

```yaml
dependencies:
  flutter:
    sdk: flutter
  # State Management
  flutter_bloc: ^9.1.1
  bloc: ^9.2.0
  equatable: ^2.0.8
  # Dependency Injection
  get_it: ^8.0.3
  injectable: ^2.7.1
  # Navigation
  go_router: ^17.1.0
  # Networking
  dio: ^5.9.1
  # Code Generation
  freezed_annotation: ^3.1.0
  json_annotation: ^4.10.0
  # Storage
  shared_preferences: ^2.5.4
  hive_flutter: ^1.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  bloc_test: ^10.0.0
  mocktail: ^1.0.4
  build_runner: ^2.11.1
  injectable_generator: ^2.12.0
  freezed: ^3.2.5
  json_serializable: ^6.12.0
  flutter_lints: ^6.0.0
```

## Layer Responsibilities

| Layer | Type | Responsibility |
|-------|------|----------------|
| **Domain** | **Entities** | Pure business objects. Immutable. No Flutter code. |
| | **Repositories** | Abstract interfaces defining data contracts. |
| | **UseCases** | Encapsulate specific business rules. Single responsibility. |
| **Data** | **Models** | DTOs with JSON serialization. Extends Entities. |
| | **DataSources** | Low-level data access (API, DB). Throws Exceptions. |
| | **Repositories** | Implements Domain Repositories. Handles data coordination & error mapping (Exception -> Failure). |
| **Presentation** | **Bloc** | Manages State. Handles User Events. Emits new States. |
| | **Pages/Widgets** | UI. Listens to Bloc state. Dispatches Events. |

## Main Entry Point

```dart
// main.dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await configureDependencies(); // Initialize GetIt + Injectable
  runApp(const MyApp());
}

// app.dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Global Blocs provided here
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<AuthBloc>()),
        BlocProvider(create: (_) => getIt<ThemeCubit>()),
      ],
      child: MaterialApp.router(
        routerConfig: getIt<GoRouter>(),
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
      ),
    );
  }
}
```
