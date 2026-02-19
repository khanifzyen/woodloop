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

## Basic Bloc Setup (with Equatable)

### Dependencies

```yaml
dependencies:
  flutter_bloc: ^9.0.0
  equatable: ^2.0.7
```

### Event

Use `equatable` to ensure events are comparable by value.

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

### State

State **must** be immutable. Use `Equatable` to prevent unnecessary rebuilds.

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

Combine `GoRouter` redirect with `Bloc` state.

```dart
// router_provider.dart
final routerProvider = Provider((ref) {
  // Watch auth state changes
  final authState = ref.watch(authBlocProvider); 

  return GoRouter(
    redirect: (context, state) {
      final isAuthenticated = authState.status == AuthStatus.authenticated;
      
      if (!isAuthenticated && state.uri.path != '/login') {
        return '/login';
      }
      return null;
    },
    // ... routes
  );
});
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

