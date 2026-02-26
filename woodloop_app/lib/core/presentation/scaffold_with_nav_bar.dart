import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';

/// A scaffold wrapper that provides a styled bottom navigation bar
/// for role-based dashboards using go_router's StatefulShellRoute.
class ScaffoldWithNavBar extends StatelessWidget {
  const ScaffoldWithNavBar({
    super.key,
    required this.navigationShell,
    required this.destinations,
  });

  final StatefulNavigationShell navigationShell;
  final List<NavDestination> destinations;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: navigationShell,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppTheme.surfaceColor,
          border: Border(
            top: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
          ),
        ),
        child: NavigationBar(
          backgroundColor: AppTheme.surfaceColor,
          indicatorColor: AppTheme.primaryColor.withValues(alpha: 0.15),
          surfaceTintColor: Colors.transparent,
          shadowColor: Colors.transparent,
          selectedIndex: navigationShell.currentIndex,
          onDestinationSelected: (index) {
            navigationShell.goBranch(
              index,
              initialLocation: index == navigationShell.currentIndex,
            );
          },
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          height: 72,
          destinations: destinations
              .map(
                (d) => NavigationDestination(
                  icon: Icon(d.icon, color: Colors.white38, size: 22),
                  selectedIcon: Icon(
                    d.icon,
                    color: AppTheme.primaryColor,
                    size: 22,
                  ),
                  label: d.label,
                ),
              )
              .toList(),
        ),
      ),
    );
  }
}

/// Simple data class for navigation destinations.
class NavDestination {
  final IconData icon;
  final String label;

  const NavDestination({required this.icon, required this.label});
}
