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

import '../../features/converter/presentation/pages/converter_registration_page.dart';
import '../../features/converter/presentation/pages/converter_studio_dashboard_page.dart';
import '../../features/converter/presentation/pages/waste_materials_marketplace_page.dart';
import '../../features/converter/presentation/pages/design_clinic_inspiration_page.dart';
import '../../features/converter/presentation/pages/my_upcycled_catalog_page.dart';
import '../../features/converter/presentation/pages/create_upcycled_product_form_page.dart';

import '../../features/buyer/presentation/pages/buyer_registration_page.dart';
import '../../features/buyer/presentation/pages/buyer_profile_impact_dashboard_page.dart';
import '../../features/buyer/presentation/pages/upcycled_products_marketplace_page.dart';
import '../../features/buyer/presentation/pages/marketplace_category_hub_page.dart';
import '../../features/buyer/presentation/pages/your_shopping_cart_page.dart';
import '../../features/buyer/presentation/pages/secure_checkout_payment_page.dart';
import '../../features/buyer/presentation/pages/order_tracking_journey_page.dart';

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
      GoRoute(
        path: '/converter-registration',
        name: 'converter_registration',
        builder: (context, state) => const ConverterRegistrationPage(),
      ),
      GoRoute(
        path: '/converter-dashboard',
        name: 'converter_dashboard',
        builder: (context, state) => const ConverterStudioDashboardPage(),
      ),
      GoRoute(
        path: '/waste-materials-marketplace',
        name: 'waste_materials_marketplace',
        builder: (context, state) => const WasteMaterialsMarketplacePage(),
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
        path: '/buyer-registration',
        name: 'buyer_registration',
        builder: (context, state) => const BuyerRegistrationPage(),
      ),
      GoRoute(
        path: '/buyer-dashboard',
        name: 'buyer_dashboard',
        builder: (context, state) => const BuyerProfileImpactDashboardPage(),
      ),
      GoRoute(
        path: '/upcycled-products-marketplace',
        name: 'upcycled_products_marketplace',
        builder: (context, state) => const UpcycledProductsMarketplacePage(),
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
    ],
  );
}
