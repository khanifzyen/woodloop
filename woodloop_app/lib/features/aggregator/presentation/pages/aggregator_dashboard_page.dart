import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class AggregatorDashboardPage extends StatelessWidget {
  const AggregatorDashboardPage({super.key});

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
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                          image: const DecorationImage(
                            image: AssetImage(
                              'assets/images/supplier_profile.jpg', // Using placeholder from supplier
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
                            l10n.aggregatorDashGreeting,
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            l10n.aggregatorDashMockName,
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
                                  color: Colors
                                      .red, // Using red for notification alert
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

            // Today's Stats Card
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
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primaryColor.withValues(alpha: 0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          l10n.aggregatorDashEstIncome,
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
                            l10n.aggregatorDashMockDate,
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
                          l10n.aggregatorDashMockIncome,
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
                          '3',
                          l10n.aggregatorDashTaskCount,
                          Icons.task_alt,
                        ),
                        Container(
                          width: 1,
                          height: 24,
                          color: Colors.black12,
                          margin: const EdgeInsets.symmetric(horizontal: 16),
                        ),
                        _buildStatItem('45', 'km', Icons.route_outlined),
                        Container(
                          width: 1,
                          height: 24,
                          color: Colors.black12,
                          margin: const EdgeInsets.symmetric(horizontal: 16),
                        ),
                        _buildStatItem('850', 'kg', Icons.scale_outlined),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Main Actions Grid
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        context.go('/aggregator-treasure-map');
                      },
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor.withValues(alpha: 0.1),
                          border: Border.all(color: AppTheme.primaryColor),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.map_outlined,
                              color: AppTheme.primaryColor,
                              size: 32,
                            ),
                            const SizedBox(height: 12),
                            Text(
                              l10n.aggregatorDashRouteMap,
                              style: const TextStyle(
                                color: AppTheme.primaryColor,
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        context.go('/warehouse-inventory-log');
                      },
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.warehouse_outlined,
                              color: Colors.white,
                              size: 32,
                            ),
                            const SizedBox(height: 12),
                            Text(
                              l10n.aggregatorDashWarehouse,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Active Pickups Route
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    l10n.aggregatorDashPickupSchedule,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    l10n.aggregatorDashViewAll,
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
                  _buildRouteItem(
                    time: '09:00',
                    title: l10n.aggregatorDashMockRouteDesc1Title,
                    subtitle: l10n.aggregatorDashMockRouteDesc1Sub,
                    distance: '2.5 km',
                    isFirst: true,
                    isLast: false,
                    isCompleted: true,
                  ),
                  _buildRouteItem(
                    time: '10:30',
                    title: l10n.aggregatorDashMockRouteDesc2Title,
                    subtitle: l10n.aggregatorDashMockRouteDesc2Sub,
                    distance: '4.2 km',
                    isFirst: false,
                    isLast: false,
                    isActive: true,
                  ),
                  _buildRouteItem(
                    time: '13:00',
                    title: l10n.aggregatorDashMockRouteDesc3Title,
                    subtitle: l10n.aggregatorDashMockRouteDesc3Sub,
                    distance: '7.8 km',
                    isFirst: false,
                    isLast: true,
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
              // Transaksi / Riwayat - Route not fully defined yet, can be empty or redirect
              break;
            case 2:
              context.pushNamed('b2b_profile');
              break;
          }
        },
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.home),
            label: l10n.aggregatorDashNavHome,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.receipt_long),
            label: l10n.aggregatorDashNavTransaction,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person_outline),
            label: l10n.aggregatorDashNavProfile,
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
        const SizedBox(width: 2),
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

  Widget _buildRouteItem({
    required String time,
    required String title,
    required String subtitle,
    required String distance,
    bool isFirst = false,
    bool isLast = false,
    bool isActive = false,
    bool isCompleted = false,
  }) {
    Color dotColor = Colors.white38;
    if (isCompleted) dotColor = AppTheme.primaryColor;
    if (isActive) dotColor = Colors.blue;

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Timeline indicator
          SizedBox(
            width: 60,
            child: Column(
              children: [
                Text(
                  time,
                  style: TextStyle(
                    color: isActive || isCompleted
                        ? Colors.white
                        : Colors.white54,
                    fontSize: 12,
                    fontWeight: isActive || isCompleted
                        ? FontWeight.bold
                        : FontWeight.normal,
                  ),
                ),
                const SizedBox(height: 8),
                Expanded(
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      if (!isLast)
                        Container(
                          width: 2,
                          color: isCompleted
                              ? AppTheme.primaryColor.withValues(alpha: 0.5)
                              : Colors.white12,
                        ),
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: AppTheme.background,
                          shape: BoxShape.circle,
                          border: Border.all(color: dotColor, width: 3),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Content Card
          Expanded(
            child: Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isActive
                    ? Colors.blue.withValues(alpha: 0.1)
                    : AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isActive
                      ? Colors.blue.withValues(alpha: 0.3)
                      : Colors.white.withValues(alpha: 0.05),
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: TextStyle(
                            color: isCompleted ? Colors.white70 : Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            decoration: isCompleted
                                ? TextDecoration.lineThrough
                                : null,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          subtitle,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      distance,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
