import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

import '../presentation/scaffold_with_nav_bar.dart';

import '../../features/auth/presentation/pages/splash_page.dart';
import '../../features/auth/presentation/pages/onboarding_page.dart';
import '../../features/auth/presentation/pages/role_selection_page.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/forgot_password_page.dart';
import '../../features/auth/presentation/pages/unified_registration_page.dart';

import '../../features/supplier/presentation/pages/supplier_dashboard_page.dart';
import '../../features/supplier/presentation/pages/list_raw_timber_form_page.dart';
import '../../features/supplier/presentation/pages/supplier_sales_history_page.dart';
import '../../features/supplier/presentation/pages/raw_timber_marketplace_page.dart';

import '../../features/generator/presentation/pages/generator_dashboard_page.dart';
import '../../features/generator/presentation/pages/report_wood_waste_form_page.dart';
import '../../features/generator/presentation/pages/generator_order_management_page.dart';
import '../../features/generator/presentation/pages/add_generator_product_page.dart';

import '../../features/aggregator/presentation/pages/aggregator_dashboard_page.dart';
import '../../features/aggregator/presentation/pages/aggregator_treasure_map_page.dart';
import '../../features/aggregator/presentation/pages/confirm_pickup_collection_page.dart';
import '../../features/aggregator/presentation/pages/warehouse_inventory_log_page.dart';
import '../../features/aggregator/presentation/pages/waste_bidding_page.dart';

import '../../features/converter/presentation/pages/converter_studio_dashboard_page.dart';
import '../../features/converter/presentation/pages/waste_materials_marketplace_page.dart';
import '../../features/converter/presentation/pages/waste_material_detail_page.dart';
import '../../features/converter/presentation/pages/waste_checkout_page.dart';
import '../../features/converter/presentation/pages/design_clinic_inspiration_page.dart';
import '../../features/converter/presentation/pages/my_upcycled_catalog_page.dart';
import '../../features/converter/presentation/pages/create_upcycled_product_form_page.dart';

import '../../features/buyer/presentation/pages/buyer_profile_impact_dashboard_page.dart';
import '../../features/buyer/presentation/pages/upcycled_products_marketplace_page.dart';
import '../../features/buyer/presentation/pages/product_detail_page.dart';
import '../../features/buyer/presentation/pages/marketplace_category_hub_page.dart';
import '../../features/buyer/presentation/pages/your_shopping_cart_page.dart';
import '../../features/buyer/presentation/pages/secure_checkout_payment_page.dart';
import '../../features/buyer/presentation/pages/order_tracking_journey_page.dart';

import '../../features/enabler/presentation/pages/impact_analytics_dashboard_page.dart';
import '../../features/chat/presentation/pages/messages_list_page.dart';
import '../../features/chat/presentation/pages/direct_message_conversation_page.dart';
import '../../features/traceability/presentation/pages/select_wood_source_history_page.dart';
import '../../features/traceability/presentation/pages/product_story_traceability_page.dart';
import '../../features/profile/presentation/pages/designer_consultant_profile_page.dart';
import '../../features/shared/presentation/pages/notification_center_page.dart';
import '../../features/shared/presentation/pages/woodloop_digital_wallet_page.dart';
import '../../features/shared/presentation/pages/b2b_profile_page.dart';
import '../../features/shared/presentation/pages/map_picker_page.dart';

import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../injection_container.dart';
import 'go_router_refresh_stream.dart';

final GlobalKey<NavigatorState> rootNavigatorKey = GlobalKey<NavigatorState>();

// Branch navigator keys for StatefulShellRoute
final _supplierShellKey = GlobalKey<NavigatorState>(
  debugLabel: 'supplier_shell',
);
final _generatorShellKey = GlobalKey<NavigatorState>(
  debugLabel: 'generator_shell',
);
final _aggregatorShellKey = GlobalKey<NavigatorState>(
  debugLabel: 'aggregator_shell',
);
final _converterShellKey = GlobalKey<NavigatorState>(
  debugLabel: 'converter_shell',
);
final _buyerShellKey = GlobalKey<NavigatorState>(debugLabel: 'buyer_shell');
final _enablerShellKey = GlobalKey<NavigatorState>(debugLabel: 'enabler_shell');

class AppRouter {
  static final GoRouter router = GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: '/',
    refreshListenable: GoRouterRefreshStream(getIt<AuthBloc>().stream),
    redirect: (context, state) {
      final authState = getIt<AuthBloc>().state;

      final isLoggingIn =
          state.matchedLocation == '/login' ||
          state.matchedLocation == '/role-selection' ||
          state.matchedLocation.startsWith('/register') ||
          state.matchedLocation == '/forgot-password' ||
          state.matchedLocation == '/map-picker';

      final isOnboarding =
          state.matchedLocation == '/onboarding' ||
          state.matchedLocation == '/';

      if (authState is Unauthenticated ||
          authState is AuthInitial ||
          authState is AuthError) {
        if (!isLoggingIn && !isOnboarding) return '/role-selection';
      } else if (authState is Authenticated) {
        if (isLoggingIn || isOnboarding) {
          final role = authState.user.role;
          switch (role) {
            case 'supplier':
              return '/supplier-dashboard';
            case 'generator':
              return '/generator-dashboard';
            case 'aggregator':
              return '/aggregator-dashboard';
            case 'converter':
              return '/converter-dashboard';
            case 'buyer':
              return '/buyer-dashboard';
            case 'enabler':
              return '/enabler-dashboard';
            default:
              return '/role-selection';
          }
        }
      }
      return null;
    },
    routes: [
      // ── Auth Routes (flat, no bottom nav) ──
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

      // ── Unified Registration ──
      GoRoute(
        path: '/register/:role',
        name: 'unified_registration',
        builder: (context, state) => UnifiedRegistrationPage(
          role: state.pathParameters['role'] ?? 'buyer',
        ),
      ),
      GoRoute(
        path: '/map-picker',
        name: 'map_picker',
        builder: (context, state) => const MapPickerPage(),
      ),

      // ══════════════════════════════════════
      // ── SUPPLIER Shell (Bottom Nav) ──
      // ══════════════════════════════════════
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => ScaffoldWithNavBar(
          navigationShell: navigationShell,
          destinations: const [
            NavDestination(icon: Icons.dashboard_outlined, label: 'Home'),
            NavDestination(icon: Icons.add_box_outlined, label: 'Input'),
            NavDestination(icon: Icons.storefront_outlined, label: 'Market'),
            NavDestination(icon: Icons.person_outline, label: 'Profile'),
          ],
        ),
        branches: [
          StatefulShellBranch(
            navigatorKey: _supplierShellKey,
            routes: [
              GoRoute(
                path: '/supplier-dashboard',
                name: 'supplier_dashboard',
                builder: (context, state) => const SupplierDashboardPage(),
                routes: [
                  GoRoute(
                    path: 'sales-history',
                    name: 'supplier_sales_history',
                    builder: (context, state) =>
                        const SupplierSalesHistoryPage(),
                  ),
                ],
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/supplier-input',
                name: 'supplier_input',
                builder: (context, state) => const ListRawTimberFormPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/supplier-market',
                name: 'supplier_market',
                builder: (context, state) => const RawTimberMarketplacePage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/supplier-profile',
                name: 'supplier_profile',
                builder: (context, state) => const B2BProfilePage(),
              ),
            ],
          ),
        ],
      ),

      // ══════════════════════════════════════
      // ── GENERATOR Shell (Bottom Nav) ──
      // ══════════════════════════════════════
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => ScaffoldWithNavBar(
          navigationShell: navigationShell,
          destinations: const [
            NavDestination(icon: Icons.dashboard_outlined, label: 'Home'),
            NavDestination(icon: Icons.recycling_outlined, label: 'Setor'),
            NavDestination(icon: Icons.inventory_2_outlined, label: 'Produk'),
            NavDestination(icon: Icons.person_outline, label: 'Profil'),
          ],
        ),
        branches: [
          StatefulShellBranch(
            navigatorKey: _generatorShellKey,
            routes: [
              GoRoute(
                path: '/generator-dashboard',
                name: 'generator_dashboard',
                builder: (context, state) => const GeneratorDashboardPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/generator-waste',
                name: 'generator_waste',
                builder: (context, state) => const ReportWoodWasteFormPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/generator-products',
                name: 'generator_products',
                builder: (context, state) =>
                    const GeneratorOrderManagementPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/generator-profile',
                name: 'generator_profile',
                builder: (context, state) => const B2BProfilePage(),
              ),
            ],
          ),
        ],
      ),

      // ══════════════════════════════════════
      // ── AGGREGATOR Shell (Bottom Nav) ──
      // ══════════════════════════════════════
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => ScaffoldWithNavBar(
          navigationShell: navigationShell,
          destinations: const [
            NavDestination(icon: Icons.dashboard_outlined, label: 'Home'),
            NavDestination(icon: Icons.map_outlined, label: 'Peta'),
            NavDestination(icon: Icons.warehouse_outlined, label: 'Gudang'),
            NavDestination(icon: Icons.person_outline, label: 'Profil'),
          ],
        ),
        branches: [
          StatefulShellBranch(
            navigatorKey: _aggregatorShellKey,
            routes: [
              GoRoute(
                path: '/aggregator-dashboard',
                name: 'aggregator_dashboard',
                builder: (context, state) => const AggregatorDashboardPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/aggregator-map',
                name: 'aggregator_map',
                builder: (context, state) => const AggregatorTreasureMapPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/aggregator-warehouse',
                name: 'aggregator_warehouse',
                builder: (context, state) => const WarehouseInventoryLogPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/aggregator-profile',
                name: 'aggregator_profile',
                builder: (context, state) => const B2BProfilePage(),
              ),
            ],
          ),
        ],
      ),

      // ══════════════════════════════════════
      // ── CONVERTER Shell (Bottom Nav) ──
      // ══════════════════════════════════════
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => ScaffoldWithNavBar(
          navigationShell: navigationShell,
          destinations: const [
            NavDestination(icon: Icons.dashboard_outlined, label: 'Studio'),
            NavDestination(icon: Icons.shopping_bag_outlined, label: 'Market'),
            NavDestination(icon: Icons.inventory_outlined, label: 'Produk'),
            NavDestination(icon: Icons.person_outline, label: 'Profil'),
          ],
        ),
        branches: [
          StatefulShellBranch(
            navigatorKey: _converterShellKey,
            routes: [
              GoRoute(
                path: '/converter-dashboard',
                name: 'converter_dashboard',
                builder: (context, state) =>
                    const ConverterStudioDashboardPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/converter-marketplace',
                name: 'converter_marketplace',
                builder: (context, state) =>
                    const WasteMaterialsMarketplacePage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/converter-catalog',
                name: 'converter_catalog',
                builder: (context, state) => const MyUpcycledCatalogPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/converter-profile',
                name: 'converter_profile',
                builder: (context, state) => const B2BProfilePage(),
              ),
            ],
          ),
        ],
      ),

      // ══════════════════════════════════════
      // ── BUYER Shell (Bottom Nav) ──
      // ══════════════════════════════════════
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => ScaffoldWithNavBar(
          navigationShell: navigationShell,
          destinations: const [
            NavDestination(icon: Icons.home_outlined, label: 'Home'),
            NavDestination(icon: Icons.storefront_outlined, label: 'Belanja'),
            NavDestination(
              icon: Icons.shopping_cart_outlined,
              label: 'Keranjang',
            ),
            NavDestination(icon: Icons.person_outline, label: 'Profil'),
          ],
        ),
        branches: [
          StatefulShellBranch(
            navigatorKey: _buyerShellKey,
            routes: [
              GoRoute(
                path: '/buyer-dashboard',
                name: 'buyer_dashboard',
                builder: (context, state) =>
                    const BuyerProfileImpactDashboardPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/buyer-shop',
                name: 'buyer_shop',
                builder: (context, state) =>
                    const UpcycledProductsMarketplacePage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/buyer-cart',
                name: 'buyer_cart',
                builder: (context, state) => const YourShoppingCartPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/buyer-profile',
                name: 'buyer_profile',
                builder: (context, state) => const B2BProfilePage(),
              ),
            ],
          ),
        ],
      ),

      // ══════════════════════════════════════
      // ── ENABLER Shell (Bottom Nav) ──
      // ══════════════════════════════════════
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => ScaffoldWithNavBar(
          navigationShell: navigationShell,
          destinations: const [
            NavDestination(icon: Icons.dashboard_outlined, label: 'Home'),
            NavDestination(icon: Icons.analytics_outlined, label: 'Laporan'),
            NavDestination(icon: Icons.person_outline, label: 'Profil'),
          ],
        ),
        branches: [
          StatefulShellBranch(
            navigatorKey: _enablerShellKey,
            routes: [
              GoRoute(
                path: '/enabler-dashboard',
                name: 'enabler_dashboard',
                builder: (context, state) =>
                    const ImpactAnalyticsDashboardPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/enabler-reports',
                name: 'enabler_reports',
                builder: (context, state) =>
                    const ImpactAnalyticsDashboardPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/enabler-profile',
                name: 'enabler_profile',
                builder: (context, state) => const B2BProfilePage(),
              ),
            ],
          ),
        ],
      ),

      // ══════════════════════════════════════
      // ── Shared Feature Routes (no bottom nav, pushed on top) ──
      // ══════════════════════════════════════
      GoRoute(
        path: '/list-raw-timber',
        name: 'list_raw_timber',
        builder: (context, state) => const ListRawTimberFormPage(),
      ),
      GoRoute(
        path: '/raw-timber-marketplace',
        name: 'raw_timber_marketplace',
        builder: (context, state) => const RawTimberMarketplacePage(),
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
        path: '/add-generator-product',
        name: 'add_generator_product',
        builder: (context, state) => const AddGeneratorProductPage(),
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
      GoRoute(
        path: '/waste-bidding',
        name: 'waste_bidding',
        builder: (context, state) => const WasteBiddingPage(),
      ),
      GoRoute(
        path: '/waste-materials-marketplace',
        name: 'waste_materials_marketplace',
        builder: (context, state) => const WasteMaterialsMarketplacePage(),
      ),
      GoRoute(
        path: '/waste-material-detail',
        name: 'waste_material_detail',
        builder: (context, state) => const WasteMaterialDetailPage(),
      ),
      GoRoute(
        path: '/waste-checkout',
        name: 'waste_checkout',
        builder: (context, state) => const WasteCheckoutPage(),
      ),
      GoRoute(
        path: '/design-clinic-inspiration',
        name: 'design_clinic_inspiration',
        builder: (context, state) => const DesignClinicInspirationPage(),
      ),
      GoRoute(
        path: '/my-upcycled-catalog',
        name: 'my_upcycled_catalog',
        builder: (context, state) => const MyUpcycledCatalogPage(),
      ),
      GoRoute(
        path: '/create-upcycled-product',
        name: 'create_upcycled_product',
        builder: (context, state) => const CreateUpcycledProductFormPage(),
      ),
      GoRoute(
        path: '/upcycled-products-marketplace',
        name: 'upcycled_products_marketplace',
        builder: (context, state) => const UpcycledProductsMarketplacePage(),
      ),
      GoRoute(
        path: '/product-detail',
        name: 'product_detail',
        builder: (context, state) => const ProductDetailPage(),
      ),
      GoRoute(
        path: '/marketplace-category-hub',
        name: 'marketplace_category_hub',
        builder: (context, state) => const MarketplaceCategoryHubPage(),
      ),
      GoRoute(
        path: '/your-shopping-cart',
        name: 'your_shopping_cart',
        builder: (context, state) => const YourShoppingCartPage(),
      ),
      GoRoute(
        path: '/secure-checkout-payment',
        name: 'secure_checkout_payment',
        builder: (context, state) => const SecureCheckoutPaymentPage(),
      ),
      GoRoute(
        path: '/order-tracking-journey',
        name: 'order_tracking_journey',
        builder: (context, state) => const OrderTrackingJourneyPage(),
      ),
      GoRoute(
        path: '/impact-analytics-dashboard',
        name: 'impact_analytics_dashboard',
        builder: (context, state) => const ImpactAnalyticsDashboardPage(),
      ),
      GoRoute(
        path: '/messages-list',
        name: 'messages_list',
        builder: (context, state) => const MessagesListPage(),
      ),
      GoRoute(
        path: '/direct-message-conversation',
        name: 'direct_message_conversation',
        builder: (context, state) => const DirectMessageConversationPage(),
      ),
      GoRoute(
        path: '/select-wood-source-history',
        name: 'select_wood_source_history',
        builder: (context, state) => const SelectWoodSourceHistoryPage(),
      ),
      GoRoute(
        path: '/product-story-traceability',
        name: 'product_story_traceability',
        builder: (context, state) => const ProductStoryTraceabilityPage(),
      ),
      GoRoute(
        path: '/designer-consultant-profile',
        name: 'designer_consultant_profile',
        builder: (context, state) => const DesignerConsultantProfilePage(),
      ),
      GoRoute(
        path: '/notification-center',
        name: 'notification_center',
        builder: (context, state) => const NotificationCenterPage(),
      ),
      GoRoute(
        path: '/woodloop-digital-wallet',
        name: 'woodloop_digital_wallet',
        builder: (context, state) => const WoodLoopDigitalWalletPage(),
      ),
      GoRoute(
        path: '/b2b-profile',
        name: 'b2b_profile',
        builder: (context, state) => const B2BProfilePage(),
      ),
    ],
  );
}
