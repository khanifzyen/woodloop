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
  String _selectedLang = 'EN';

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
      'id': 'designer',
      'title': 'Designer',
      'subtitle': 'Creative Consultant',
      'description': 'Offer design services and waste upcycling consulting',
      'icon': Icons.architecture,
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
      backgroundColor: const Color(0xFF102216), // background-dark
      body: SafeArea(
        child: Stack(
          children: [
            // Background glow effect
            Positioned(
              top: 0,
              left: MediaQuery.of(context).size.width / 2 - 128,
              child: Container(
                width: 256,
                height: 256,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.primaryColor.withValues(alpha: 0.2),
                ),
                // Emulating the blur filter via container (can also use ImageFilter or physical constraints)
                // For simplicity assuming standard blurring
              ),
            ),

            // Language Switcher Sticky Top
            Positioned(
              top: 16,
              right: 16,
              // zIndex: 20, // To mimic z-index - Flutter doesn't have zIndex on Positioned directly, order in Stack matters
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A2E22).withValues(alpha: 0.9),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.1),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    GestureDetector(
                      onTap: () => setState(() => _selectedLang = 'EN'),
                      child: Text(
                        'EN',
                        style: TextStyle(
                          color: _selectedLang == 'EN'
                              ? AppTheme.primaryColor
                              : Colors.white54,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8.0),
                      child: Text(
                        '|',
                        style: TextStyle(color: Colors.white38, fontSize: 12),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => setState(() => _selectedLang = 'ID'),
                      child: Text(
                        'ID',
                        style: TextStyle(
                          color: _selectedLang == 'ID'
                              ? AppTheme.primaryColor
                              : Colors.white54,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            Column(
              children: [
                // Header
                Padding(
                  padding: const EdgeInsets.only(
                    left: 24.0,
                    right: 24.0,
                    top: 48.0,
                    bottom: 24.0,
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: const Color(0xFF1A2E22), // surface-dark
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
                          size: 48,
                        ),
                      ),
                      const SizedBox(height: 24),
                      RichText(
                        text: TextSpan(
                          style: const TextStyle(
                            fontSize: 36,
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
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
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
                                : const Color(
                                    0xFF1A2E22,
                                  ).withValues(alpha: 0.8),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: isSelected
                                  ? AppTheme.primaryColor
                                  : Colors.white.withValues(alpha: 0.1),
                              width: isSelected ? 2 : 1,
                            ),
                            boxShadow: isSelected
                                ? [
                                    BoxShadow(
                                      color: AppTheme.primaryColor.withValues(
                                        alpha: 0.1,
                                      ),
                                      blurRadius: 15,
                                    ),
                                  ]
                                : [],
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

                // Footer Actions
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
                  child: Column(
                    children: [
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            context.pushNamed('login');
                          },
                          // Applying styling required by user to global theme:
                          // Elevated button defaults handle text coloring
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme
                                .primaryColor, // the standard primary green
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
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(width: 8),
                              Icon(Icons.arrow_forward),
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
