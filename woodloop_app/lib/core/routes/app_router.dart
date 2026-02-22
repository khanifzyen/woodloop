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

import '../../features/generator/presentation/pages/generator_registration_page.dart';
import '../../features/generator/presentation/pages/generator_dashboard_page.dart';
import '../../features/generator/presentation/pages/report_wood_waste_form_page.dart';
import '../../features/generator/presentation/pages/generator_order_management_page.dart';

import '../../features/aggregator/presentation/pages/aggregator_registration_page.dart';
import '../../features/aggregator/presentation/pages/aggregator_dashboard_page.dart';
import '../../features/aggregator/presentation/pages/aggregator_treasure_map_page.dart';
import '../../features/aggregator/presentation/pages/confirm_pickup_collection_page.dart';
import '../../features/aggregator/presentation/pages/warehouse_inventory_log_page.dart';

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
      GoRoute(
        path: '/generator-registration',
        name: 'generator_registration',
        builder: (context, state) => const GeneratorRegistrationPage(),
      ),
      GoRoute(
        path: '/generator-dashboard',
        name: 'generator_dashboard',
        builder: (context, state) => const GeneratorDashboardPage(),
      ),
      GoRoute(
        path: '/report-wood-waste',
        name: 'report_wood_waste',
        builder: (context, state) => const ReportWoodWasteFormPage(),
      ),
      GoRoute(
        path: '/generator-order-management',
        name: 'generator_order_management',
        builder: (context, state) => const GeneratorOrderManagementPage(),
      ),
      GoRoute(
        path: '/aggregator-registration',
        name: 'aggregator_registration',
        builder: (context, state) => const AggregatorRegistrationPage(),
      ),
      GoRoute(
        path: '/aggregator-dashboard',
        name: 'aggregator_dashboard',
        builder: (context, state) => const AggregatorDashboardPage(),
      ),
      GoRoute(
        path: '/aggregator-treasure-map',
        name: 'aggregator_treasure_map',
        builder: (context, state) => const AggregatorTreasureMapPage(),
      ),
      GoRoute(
        path: '/confirm-pickup',
        name: 'confirm_pickup',
        builder: (context, state) => const ConfirmPickupCollectionPage(),
      ),
      GoRoute(
        path: '/warehouse-inventory-log',
        name: 'warehouse_inventory_log',
        builder: (context, state) => const WarehouseInventoryLogPage(),
      ),
    ],
  );
}
