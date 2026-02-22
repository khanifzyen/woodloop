import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

import '../../features/auth/presentation/pages/splash_page.dart';
import '../../features/auth/presentation/pages/onboarding_page.dart';
import '../../features/auth/presentation/pages/role_selection_page.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/forgot_password_page.dart';

import '../../features/supplier/presentation/pages/supplier_registration_page.dart';
import '../../features/supplier/presentation/pages/supplier_dashboard_page.dart';
import '../../features/supplier/presentation/pages/list_raw_timber_form_page.dart';
import '../../features/supplier/presentation/pages/supplier_sales_history_page.dart';

final GlobalKey<NavigatorState> rootNavigatorKey = GlobalKey<NavigatorState>();

class AppRouter {
  static final GoRouter router = GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        name: 'splash',
        builder: (context, state) => const SplashPage(),
      ),
      GoRoute(
        path: '/onboarding',
        name: 'onboarding',
        builder: (context, state) => const OnboardingPage(),
      ),
      GoRoute(
        path: '/role-selection',
        name: 'role_selection',
        builder: (context, state) => const RoleSelectionPage(),
      ),
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/forgot-password',
        name: 'forgot_password',
        builder: (context, state) => const ForgotPasswordPage(),
      ),
      GoRoute(
        path: '/supplier-registration',
        name: 'supplier_registration',
        builder: (context, state) => const SupplierRegistrationPage(),
      ),
      GoRoute(
        path: '/supplier-dashboard',
        name: 'supplier_dashboard',
        builder: (context, state) => const SupplierDashboardPage(),
      ),
      GoRoute(
        path: '/list-raw-timber',
        name: 'list_raw_timber',
        builder: (context, state) => const ListRawTimberFormPage(),
      ),
      GoRoute(
        path: '/supplier-sales-history',
        name: 'supplier_sales_history',
        builder: (context, state) => const SupplierSalesHistoryPage(),
      ),
    ],
  );
}
