# Bloc State Management

## When to Use Bloc

Use **Bloc/Cubit** when you need:

* Explicit event → state transitions
* Complex business logic
* Predictable, testable flows
* Clear separation between UI and logic
* Traceable state changes (via `BlocObserver`)

| Use Case               | Recommended |
| ---------------------- | ----------- |
| Simple mutable state   | Riverpod    |
| Event-driven workflows | Bloc        |
| Forms, auth, wizards   | Bloc        |
| Feature modules        | Bloc        |

---

## Core Concepts

| Concept | Description            |
| ------- | ---------------------- |
| Event   | User/system input      |
| State   | Immutable UI state     |
| Bloc    | Event → State mapper   |
| Cubit   | State-only (no events) |
| Observer| Global state logger    |

---

## Basic Setup: Equatable vs Freezed

When creating State and Event classes, you must use either `Equatable` or `freezed`.

1.  **Use `Equatable`** for simple states without complex variations or when you want to avoid running build scripts continually.
2.  **Use `freezed`** for complex states requiring robust `.copyWith` functionality or when you want strict, exhaustive compile-time safety (union types/sealed classes) to handle `Loading`, `Success`, and `Failure` states gracefully.

### Dependencies

```yaml
dependencies:
  flutter_bloc: ^9.0.0 # Or latest
  equatable: ^2.0.7  # If using Equatable
  freezed_annotation: ^3.0.0 # If using Freezed

dev_dependencies:
  build_runner: ^2.4.0
  freezed: ^3.0.0
```

### Event & State Example (with Equatable)

Use `equatable` to ensure events and states are comparable by value.

**Event:**
```dart
import 'package:equatable/equatable.dart';

sealed class CounterEvent extends Equatable {
  const CounterEvent();

  @override
  List<Object> get props => [];
}

final class CounterIncremented extends CounterEvent {}
final class CounterDecremented extends CounterEvent {}
```

**State:**
```dart
import 'package:equatable/equatable.dart';

class CounterState extends Equatable {
  final int value;
  final bool isLoading;

  const CounterState({
    this.value = 0,
    this.isLoading = false,
  });

  CounterState copyWith({
    int? value,
    bool? isLoading,
  }) {
    return CounterState(
      value: value ?? this.value,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  @override
  List<Object> get props => [value, isLoading];
}
```

### Event & State Example (with Freezed)

For complex UIs, `freezed` union types are safer and auto-generate `copyWith`. Run `dart run build_runner build -d` after modifying.

**Event:**
```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'counter_event.freezed.dart';

@freezed
sealed class CounterEvent with _$CounterEvent {
  const factory CounterEvent.incremented() = CounterIncremented;
  const factory CounterEvent.decremented() = CounterDecremented;
}
```

**State:**
```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'counter_state.freezed.dart';

@freezed
sealed class CounterState with _$CounterState {
  const factory CounterState.initial({
    @Default(0) int value,
    @Default(false) bool isLoading,
  }) = _Initial;
  const factory CounterState.loading({
    required int value,
  }) = _Loading;
  const factory CounterState.loaded({
    required int value,
  }) = _Loaded;
  const factory CounterState.error({
    required int value,
    required String message,
  }) = _Error;
}
```

### Bloc

```dart
import 'package:flutter_bloc/flutter_bloc.dart';

class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(const CounterState()) {
    on<CounterIncremented>(_onIncremented);
    on<CounterDecremented>(_onDecremented);
  }

  void _onIncremented(CounterIncremented event, Emitter<CounterState> emit) {
    emit(state.copyWith(value: state.value + 1));
  }

  void _onDecremented(CounterDecremented event, Emitter<CounterState> emit) {
    emit(state.copyWith(value: state.value - 1));
  }
}
```

---

## Cubit (Recommended for Simpler Logic)

```dart
class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);

  void increment() => emit(state + 1);
  void decrement() => emit(state - 1);
}
```

---

## Bloc Observer (Global Logging)

Implement `BlocObserver` to trace all state changes and errors.

```dart
// simple_bloc_observer.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'dart:developer';

class SimpleBlocObserver extends BlocObserver {
  @override
  void onCreate(BlocBase bloc) {
    super.onCreate(bloc);
    log('onCreate -- ${bloc.runtimeType}');
  }

  @override
  void onChange(BlocBase bloc, Change change) {
    super.onChange(bloc, change);
    log('onChange -- ${bloc.runtimeType}, $change');
  }

  @override
  void onError(BlocBase bloc, Object error, StackTrace stackTrace) {
    log('onError -- ${bloc.runtimeType}, $error');
    super.onError(bloc, error, stackTrace);
  }
}

// main.dart
void main() {
  Bloc.observer = SimpleBlocObserver();
  runApp(const App());
}
```

---

## Providing Bloc to the Widget Tree

```dart
BlocProvider(
  create: (_) => CounterBloc()..add(Started()), // Lazy by default
  child: const CounterScreen(),
);
```

Multiple blocs:

```dart
MultiBlocProvider(
  providers: [
    BlocProvider(create: (_) => AuthBloc()),
    BlocProvider(create: (_) => ProfileBloc()),
  ],
  child: const AppRoot(),
);
```

---

## Using Bloc in Widgets

### BlocBuilder (UI rebuilds)

Rebuilds only when `buildWhen` returns true (or state changes if `Equatable` is used).

```dart
class CounterScreen extends StatelessWidget {
  const CounterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CounterBloc, CounterState>(
      buildWhen: (prev, curr) => prev.value != curr.value,
      builder: (context, state) {
        if (state.isLoading) return const CircularProgressIndicator();
        
        return Text(
          '${state.value}',
          style: Theme.of(context).textTheme.displayLarge,
        );
      },
    );
  }
}
```

---

### BlocListener (Side Effects)

Use for navigation, snacking bars, dialogs, etc.

```dart
BlocListener<AuthBloc, AuthState>(
  listenWhen: (prev, curr) => prev.status != curr.status,
  listener: (context, state) {
    if (state.status == AuthStatus.failure) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(state.errorMessage)));
    }
  },
  child: const LoginForm(),
);
```

---

### BlocConsumer (Builder + Listener)

```dart
BlocConsumer<FormBloc, FormState>(
  listener: (context, state) {
    if (state.isSuccess) context.pop();
  },
  builder: (context, state) {
    return ElevatedButton(
      onPressed: state.isValid
          ? () => context.read<FormBloc>().add(FormSubmitted())
          : null,
      child: state.isSubmitting 
          ? const CircularProgressIndicator() 
          : const Text('Submit'),
    );
  },
);
```

---

## Accessing Bloc Without Rebuilds

```dart
// Inside onPressed or callbacks
context.read<CounterBloc>().add(CounterIncremented());
```

⚠️ **Never use `watch` inside callbacks or functions**

---

## Async Bloc Pattern (API Calls)

Always handle loading and error states.

```dart
on<UserRequested>((event, emit) async {
  // 1. Emit Loading
  emit(state.copyWith(status: UserStatus.loading));

  try {
    // 2. Perform Async Work
    final user = await repository.fetchUser();
    
    // 3. Emit Success
    emit(state.copyWith(
      status: UserStatus.success,
      user: user,
    ));
  } catch (e) {
    // 4. Emit Failure
    emit(state.copyWith(
      status: UserStatus.failure,
      errorMessage: e.toString(),
    ));
  }
});
```

---

## Bloc + GoRouter (Auth Guard Example)

Combine `GoRouter` redirect with `Bloc` state, usually using `BlocListener` at the root or standard listening mechanisms.

```dart
// main_router.dart (Example of integrating Bloc with GoRouter)
// Note: Do not use Riverpod here. Provide the Bloc to the router setup.

GoRouter createRouter(AuthBloc authBloc) {
  return GoRouter(
    refreshListenable: GoRouterRefreshStream(authBloc.stream),
    redirect: (context, state) {
      final authState = authBloc.state;
      final isAuthenticated = authState.status == AuthStatus.authenticated;
      
      if (!isAuthenticated && state.uri.path != '/login') {
        return '/login';
      }
      return null;
    },
    // ... routes
  );
}

// Utility class to convert Stream to Listenable for GoRouter
class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<dynamic> stream) {
    notifyListeners();
    _subscription = stream.asBroadcastStream().listen(
      (dynamic _) => notifyListeners(),
    );
  }

  late final StreamSubscription<dynamic> _subscription;

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
```

---

## Testing Bloc

Use `bloc_test` package.

```dart
import 'package:bloc_test/bloc_test.dart';

blocTest<CounterBloc, CounterState>(
  'emits [1] when CounterIncremented is added',
  build: () => CounterBloc(),
  act: (bloc) => bloc.add(CounterIncremented()),
  expect: () => [
    const CounterState(value: 1),
  ],
);
```

---

## Best Practices (MUST FOLLOW)

✅ **Immutable States**: Always use `Equatable` or `Freezed`.
✅ **Event-Driven**: Use Events for all inputs in Blocs.
✅ **One Feature = One Bloc**: Don't reuse Blocs across disparate features.
✅ **Testability**: Logic in Bloc/Cubit is easy to unit test.
✅ **Add Handlers**: Use method references (`on<Event>(_onEvent)`) for cleaner code.
✅ **Concurrency**: Use transformers (e.g., `droppable`, `restartable`) for advanced event handling.

❌ **No UI Logic**: Blocs should never import `flutter/material.dart` (except for specific types if unavoidable).
❌ **No Context**: Never pass `BuildContext` into a Bloc.
❌ **No Public Setters**: State should only change via `emit`.

