import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class RoleSelectionPage extends StatefulWidget {
  const RoleSelectionPage({super.key});

  @override
  State<RoleSelectionPage> createState() => _RoleSelectionPageState();
}

class _RoleSelectionPageState extends State<RoleSelectionPage> {
  String? _selectedRole = 'supplier'; // default

  final List<Map<String, dynamic>> _roles = [
    {
      'id': 'supplier',
      'title': 'Supplier',
      'subtitle': 'Timber Trader',
      'description': 'Source & sell raw timber materials',
      'icon': Icons.forest,
    },
    {
      'id': 'generator',
      'title': 'Generator',
      'subtitle': 'Furniture Workshop',
      'description': 'Manage production & wood waste',
      'icon': Icons.handyman,
    },
    {
      'id': 'aggregator',
      'title': 'Aggregator',
      'subtitle': 'Logistics',
      'description': 'Collect, transport & store materials',
      'icon': Icons.local_shipping,
    },
    {
      'id': 'converter',
      'title': 'Converter',
      'subtitle': 'Creative Artisan',
      'description': 'Upcycle waste into value products',
      'icon': Icons.brush,
    },
    {
      'id': 'buyer',
      'title': 'Buyer / End User',
      'subtitle': 'Public Consumer',
      'description': 'Purchase unique upcycled wood products',
      'icon': Icons.shopping_bag,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Stack(
          children: [
            // Background effects could go here
            Positioned(
              top: -50,
              left: MediaQuery.of(context).size.width / 2 - 150,
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.primaryColor.withValues(alpha: 0.1),
                ),
              ),
            ),

            Column(
              children: [
                // Header
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24.0,
                    vertical: 32.0,
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppTheme.primaryColor.withValues(alpha: 0.3),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.primaryColor.withValues(
                                alpha: 0.15,
                              ),
                              blurRadius: 15,
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.water_drop,
                          color: AppTheme.primaryColor,
                          size: 40,
                        ),
                      ),
                      const SizedBox(height: 24),
                      RichText(
                        text: TextSpan(
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: -1,
                          ),
                          children: [
                            const TextSpan(text: 'Wood'),
                            TextSpan(
                              text: 'Loop',
                              style: TextStyle(color: AppTheme.primaryColor),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Connecting the wood industry for a sustainable future. Select your role to begin.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.white54, fontSize: 14),
                      ),
                    ],
                  ),
                ),

                // Roles List
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    itemCount: _roles.length,
                    itemBuilder: (context, index) {
                      final role = _roles[index];
                      final isSelected = _selectedRole == role['id'];
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedRole = role['id'];
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? const Color(0xFF243C2F)
                                : AppTheme.surfaceColor,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: isSelected
                                  ? AppTheme.primaryColor
                                  : Colors.white.withValues(alpha: 0.1),
                              width: isSelected ? 2 : 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? AppTheme.primaryColor
                                      : Colors.white.withValues(alpha: 0.05),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Icon(
                                  role['icon'],
                                  color: isSelected
                                      ? Colors.black
                                      : Colors.white70,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      role['title'],
                                      style: TextStyle(
                                        color: isSelected
                                            ? AppTheme.primaryColor
                                            : Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      role['subtitle'],
                                      style: const TextStyle(
                                        color: Colors.white54,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        letterSpacing: 1,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      role['description'],
                                      style: const TextStyle(
                                        color: Colors.white38,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                width: 24,
                                height: 24,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: isSelected
                                      ? AppTheme.primaryColor
                                      : Colors.transparent,
                                  border: Border.all(
                                    color: isSelected
                                        ? AppTheme.primaryColor
                                        : Colors.white54,
                                  ),
                                ),
                                child: isSelected
                                    ? const Icon(
                                        Icons.check,
                                        size: 16,
                                        color: Colors.black,
                                      )
                                    : null,
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),

                // Footer
                Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    children: [
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            // Navigate to login or registration depending on role.
                            if (_selectedRole == 'supplier') {
                              context.pushNamed('supplier_registration');
                            } else if (_selectedRole == 'generator') {
                              context.pushNamed('generator_registration');
                            } else if (_selectedRole == 'aggregator') {
                              context.pushNamed('aggregator_registration');
                            } else if (_selectedRole == 'converter') {
                              context.pushNamed('converter_registration');
                            } else if (_selectedRole == 'buyer') {
                              context.pushNamed('buyer_registration');
                            } else {
                              context.pushNamed('login');
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Continue',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: AppTheme.background,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Icon(
                                Icons.arrow_forward,
                                color: AppTheme.background,
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      GestureDetector(
                        onTap: () => context.pushNamed('login'),
                        child: RichText(
                          text: TextSpan(
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 14,
                            ),
                            children: [
                              const TextSpan(text: 'Already have an account? '),
                              TextSpan(
                                text: 'Log in',
                                style: TextStyle(
                                  color: AppTheme.primaryColor,
                                  fontWeight: FontWeight.bold,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ],
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
    );
  }
}
