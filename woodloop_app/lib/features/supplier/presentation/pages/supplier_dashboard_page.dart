import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class SupplierDashboardPage extends StatelessWidget {
  const SupplierDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
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
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                          image: const DecorationImage(
                            image: AssetImage(
                              'assets/images/supplier_profile.jpg',
                            ),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome back,',
                            style: TextStyle(
                              color: Colors.white54,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            'WoodLoop Supply',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  GestureDetector(
                    onTap: () => context.pushNamed('notification_center'),
                    child: Container(
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
                  ),
                ],
              ),
            ),

            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20.0),
              child: Text(
                'Dashboard Overview',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Horizontal Metrics
            SizedBox(
              height: 144,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _buildMetricCard(
                    icon: Icons.attach_money,
                    iconBgColor: Colors.green.withValues(alpha: 0.2),
                    iconColor: AppTheme.primaryColor,
                    badgeText: '12%',
                    badgeIcon: Icons.trending_up,
                    title: 'Monthly Revenue',
                    value: '\$34,200',
                    bgIcon: Icons.payments_outlined,
                  ),
                  const SizedBox(width: 16),
                  _buildMetricCard(
                    icon: Icons.inventory_2,
                    iconBgColor: Colors.blue.withValues(alpha: 0.2),
                    iconColor: Colors.blue[400]!,
                    badgeText: '5%',
                    badgeIcon: Icons.trending_up,
                    title: 'Total Timber Stock',
                    value: '4,520 m³',
                    bgIcon: Icons.forest_outlined,
                  ),
                  const SizedBox(width: 16),
                  _buildMetricCard(
                    icon: Icons.view_list,
                    iconBgColor: Colors.orange.withValues(alpha: 0.2),
                    iconColor: Colors.orange[400]!,
                    badgeText: null,
                    badgeIcon: null,
                    title: 'Active Listings',
                    value: '12',
                    bgIcon: Icons.list_alt,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Primary Action
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {
                    context.pushNamed('list_raw_timber');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 8,
                    shadowColor: AppTheme.primaryColor.withValues(alpha: 0.3),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.add, color: AppTheme.background, size: 24),
                      SizedBox(width: 8),
                      Text(
                        'List New Timber',
                        style: TextStyle(
                          color: AppTheme.background,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Recent Sales Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Recent Sales',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      context.pushNamed('supplier_sales_history');
                    },
                    child: const Text(
                      'View All',
                      style: TextStyle(
                        color: AppTheme.primaryColor,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Recent Sales List
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _buildSaleItem(
                    title: 'Raw Oak Logs',
                    price: '\$1,200',
                    subtitle: '500m³ • Buyer: Nordic Furniture',
                    status: 'Processing',
                    statusColor: Colors.yellow,
                    icon: Icons.forest,
                  ),
                  _buildSaleItem(
                    title: 'Pine Lumber Grade A',
                    price: '\$4,550',
                    subtitle: '1200m³ • Buyer: BuildCorp',
                    status: 'Shipped',
                    statusColor: AppTheme.primaryColor,
                    icon: Icons.straighten,
                  ),
                  _buildSaleItem(
                    title: 'Birch Plywood',
                    price: '\$890',
                    subtitle: '200m³ • Buyer: Local Carpentry',
                    status: 'Delivered',
                    statusColor: AppTheme.primaryColor,
                    icon: Icons.forest,
                  ),
                  _buildSaleItem(
                    title: 'Mahogany Planks',
                    price: '\$12,100',
                    subtitle: '50m³ • Buyer: Luxury Yachts Inc.',
                    status: 'Cancelled',
                    statusColor: Colors.red,
                    icon: Icons.category,
                  ),
                ],
              ),
            ),
          ],
        ),
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
              // Dashboard
              break;
            case 1:
              context.pushNamed('raw_timber_marketplace');
              break;
            case 2:
              context.pushNamed('supplier_sales_history');
              break;
            case 3:
              context.pushNamed('messages_list');
              break;
            case 4:
              context.pushNamed('b2b_profile');
              break;
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.storefront),
            label: 'Market',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.inventory_2_outlined),
            label: 'Inventory',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat_bubble_outline),
            label: 'Messages',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard({
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required String? badgeText,
    required IconData? badgeIcon,
    required String title,
    required String value,
    required IconData bgIcon,
  }) {
    return Container(
      width: 160,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Stack(
        children: [
          Positioned(
            right: -8,
            top: -8,
            child: Icon(
              bgIcon,
              size: 48,
              color: Colors.white.withValues(alpha: 0.05),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: iconBgColor,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(icon, color: iconColor, size: 20),
                  ),
                  if (badgeText != null)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            badgeIcon,
                            color: AppTheme.primaryColor,
                            size: 12,
                          ),
                          const SizedBox(width: 2),
                          Text(
                            badgeText,
                            style: const TextStyle(
                              color: AppTheme.primaryColor,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(color: Colors.white54, fontSize: 12),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    value,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSaleItem({
    required String title,
    required String price,
    required String subtitle,
    required String status,
    required Color statusColor,
    required IconData icon,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.white54),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      price,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        subtitle,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 12,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: statusColor.withValues(alpha: 0.2),
                        ),
                      ),
                      child: Text(
                        status.toUpperCase(),
                        style: TextStyle(
                          color: statusColor,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
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
