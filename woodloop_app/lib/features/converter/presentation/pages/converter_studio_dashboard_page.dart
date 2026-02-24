import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class ConverterStudioDashboardPage extends StatelessWidget {
  const ConverterStudioDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                          image: const DecorationImage(
                            image: AssetImage(
                              'assets/images/supplier_profile.jpg', // Placeholder profile
                            ),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            l10n.converterDashActiveStudio,
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            l10n.converterDashMockStudioName,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                        ),
                        child: const Icon(
                          Icons.chat_bubble_outline,
                          color: Colors.white54,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                        ),
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            const Icon(
                              Icons.notifications_none,
                              color: Colors.white54,
                            ),
                            Positioned(
                              top: 10,
                              right: 12,
                              child: Container(
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryColor,
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: AppTheme.surfaceColor,
                                    width: 2,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Revenue / Progress Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF13EC5B), Color(0xFF0A6E29)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primaryColor.withValues(alpha: 0.2),
                      blurRadius: 15,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          l10n.converterDashRevenueThisMonth,
                          style: const TextStyle(
                            color: Colors.black54,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            l10n.converterDashMockMonth,
                            style: const TextStyle(
                              color: Colors.black87,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Text(
                          l10n.converterDashMockRevenue,
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        _buildStatItem(
                          l10n.converterDashMockSold,
                          l10n.converterDashSoldLabel,
                          Icons.shopping_bag_outlined,
                        ),
                        Container(
                          width: 1,
                          height: 24,
                          color: Colors.black12,
                          margin: const EdgeInsets.symmetric(horizontal: 16),
                        ),
                        _buildStatItem(
                          l10n.converterDashMockProcessed,
                          l10n.converterDashProcessedLabel,
                          Icons.recycling,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Main Actions Menu
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Expanded(
                    child: _buildActionCard(
                      context: context,
                      title: l10n.converterDashMenuMarketplace,
                      icon: Icons.storefront,
                      color: AppTheme.primaryColor,
                      route: '/waste-materials-marketplace',
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionCard(
                      context: context,
                      title: l10n.converterDashMenuCatalog,
                      icon: Icons.inventory_2_outlined,
                      color: Colors.blue,
                      route: '/my-upcycled-catalog',
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionCard(
                      context: context,
                      title: l10n.converterDashMenuClinic,
                      icon: Icons.design_services_outlined,
                      color: Colors.orange,
                      route: '/design-clinic-inspiration',
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Recent Upcycled Products Added
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    l10n.converterDashNewProducts,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    l10n.converterDashSeeAll,
                    style: TextStyle(
                      color: AppTheme.primaryColor.withValues(alpha: 0.8),
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _buildProductListItem(
                    title: l10n.converterDashMockProd1Title,
                    subtitle: l10n.converterDashMockProd1Sub,
                    price: l10n.converterDashMockProd1Price,
                    sales: l10n.converterDashMockProd1Sales,
                    imageUrl:
                        'assets/images/map_jepara.jpg', // Map Placeholder acting as product image
                    l10n: l10n,
                  ),
                  _buildProductListItem(
                    title: l10n.converterDashMockProd2Title,
                    subtitle: l10n.converterDashMockProd2Sub,
                    price: l10n.converterDashMockProd2Price,
                    sales: l10n.converterDashMockProd2Sales,
                    imageUrl: 'assets/images/map_jepara.jpg',
                    l10n: l10n,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          context.pushNamed('create_upcycled_product');
        },
        backgroundColor: AppTheme.primaryColor,
        child: const Icon(Icons.add, color: AppTheme.background),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: AppTheme.surfaceColor,
        selectedItemColor: AppTheme.primaryColor,
        unselectedItemColor: Colors.white54,
        type: BottomNavigationBarType.fixed,
        showUnselectedLabels: true,
        selectedLabelStyle: const TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
        unselectedLabelStyle: const TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w600,
        ),
        onTap: (index) {
          switch (index) {
            case 0:
              // Studio Dashboard
              break;
            case 1:
              context.pushNamed('waste_materials_marketplace');
              break;
            case 2:
              // Pesanan - not specifically defined yet
              break;
            case 3:
              context.pushNamed('b2b_profile');
              break;
          }
        },
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.home),
            label: l10n.converterDashNavStudio,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.store),
            label: l10n.converterDashNavMarketplace,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.receipt_long),
            label: l10n.converterDashNavOrders,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person_outline),
            label: l10n.converterDashNavProfile,
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String value, String label, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: Colors.black54, size: 16),
        const SizedBox(width: 4),
        Text(
          value,
          style: const TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.black54,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildActionCard({
    required BuildContext context,
    required String title,
    required IconData icon,
    required Color color,
    required String route,
  }) {
    return GestureDetector(
      onTap: () => context.push(route),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
        decoration: BoxDecoration(
          color: AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w600,
                height: 1.2,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProductListItem({
    required String title,
    required String subtitle,
    required String price,
    required String sales,
    required String imageUrl,
    required AppLocalizations l10n,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(
        children: [
          Container(
            width: 70,
            height: 70,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              image: DecorationImage(
                image: AssetImage(imageUrl), // Using placeholder
                fit: BoxFit.cover,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(color: Colors.white54, fontSize: 12),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      price,
                      style: const TextStyle(
                        color: AppTheme.primaryColor,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      l10n.converterDashSalesCount(sales),
                      style: const TextStyle(
                        color: Colors.white38,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
