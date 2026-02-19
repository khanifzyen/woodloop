# GoRouter Navigation

## Basic Setup (Type-Safe)

We use `go_router_builder` for type-safe routing.

### Dependencies

```yaml
dependencies:
  go_router: ^14.7.1
  flutter_bloc: ^9.0.0

dev_dependencies:
  go_router_builder: ^2.7.1
  build_runner: ^2.4.14
```

### Route Definition

```dart
import 'package:go_router/go_router.dart';

part 'app_router.g.dart';

@TypedGoRoute<HomeRoute>(
  path: '/',
  routes: [
    TypedGoRoute<DetailsRoute>(path: 'details/:id'),
  ],
)
class HomeRoute extends GoRouteData {
  const HomeRoute();

  @override
  Widget build(BuildContext context, GoRouterState state) => const HomeScreen();
}

class DetailsRoute extends GoRouteData {
  final String id;

  const DetailsRoute({required this.id});

  @override
  Widget build(BuildContext context, GoRouterState state) => DetailsScreen(id: id);
}
```

### Router Config

```dart
final goRouter = GoRouter(
  initialLocation: '/',
  routes: $appRoutes, // Generated list
  redirect: (context, state) {
    // Auth Logic with Bloc
    final authState = context.read<AuthBloc>().state;
    final isLoggedIn = authState.status == AuthStatus.authenticated;
    final isLoggingIn = state.matchedLocation == '/login';

    if (!isLoggedIn && !isLoggingIn) return '/login';
    if (isLoggedIn && isLoggingIn) return '/';

    return null;
  },
);
```

---

## Stateful Shell Route (Bottom Navigation)

Use `StatefulShellRoute` to preserve state between tabs.

```dart
// app_router.dart

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _sectionNavigatorKey = GlobalKey<NavigatorState>();

final router = GoRouter(
  navigatorKey: _rootNavigatorKey,
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return ScaffoldWithNavBar(navigationShell: navigationShell);
      },
      branches: [
        // Tab 1
        StatefulShellBranch(
          navigatorKey: _sectionNavigatorKey,
          routes: [
            GoRoute(
              path: '/home',
              builder: (context, state) => const HomeScreen(),
            ),
          ],
        ),
        // Tab 2
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/profile',
              builder: (context, state) => const ProfileScreen(),
            ),
          ],
        ),
      ],
    ),
  ],
);
```

### Scaffold with NavBar

```dart
class ScaffoldWithNavBar extends StatelessWidget {
  const ScaffoldWithNavBar({
    required this.navigationShell,
    super.key,
  });

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: (index) {
          navigationShell.goBranch(
            index,
            initialLocation: index == navigationShell.currentIndex,
          );
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
```

---

## Navigation Methods (Type-Safe)

Dependencies: `go_router_builder` must be run via `dart run build_runner build`.

```dart
// Navigate to Home
const HomeRoute().go(context);

// Navigate to Details
DetailsRoute(id: '123').push(context);

// Replace
const LoginRoute().pushReplacement(context);

// Pop
context.pop();
```

---

## Passing Extra Data (Not Type-Safe)

Type-safe routes support basic types in constructors. For complex objects, use `extra`.

```dart
// Define
class ProductRoute extends GoRouteData {
  final Product $extra; // Special property

  const ProductRoute({required this.$extra});

  @override
  Widget build(BuildContext context, GoRouterState state) {
    return ProductScreen(product: $extra);
  }
}

// Usage
ProductRoute($extra: myProduct).push(context);
```

---

## Custom Transitions

```dart
GoRoute(
  path: '/modal',
  pageBuilder: (context, state) => CustomTransitionPage(
    key: state.pageKey,
    child: const ModalScreen(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(opacity: animation, child: child);
    },
  ),
),
```

---

## Quick Reference

| Method | Legacy (String) | Type-Safe (Builder) |
|--------|-----------------|---------------------|
| **Go** | `context.go('/path')` | `Route().go(context)` |
| **Push** | `context.push('/path')` | `Route().push(context)` |
| **Replace** | `context.pushReplacement('/path')` | `Route().pushReplacement(context)` |
| **Params** | `/path/:id` | `Route(id: '123')` |
