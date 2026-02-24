import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../../../core/presentation/bloc/language/language_cubit.dart';

class RoleSelectionPage extends StatefulWidget {
  const RoleSelectionPage({super.key});

  @override
  State<RoleSelectionPage> createState() => _RoleSelectionPageState();
}

class _RoleSelectionPageState extends State<RoleSelectionPage> {
  String? _selectedRole = 'supplier'; // default

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final currentLang = context
        .select((LanguageCubit cubit) => cubit.state.locale.languageCode)
        .toUpperCase();

    final List<Map<String, dynamic>> roles = [
      {
        'id': 'supplier',
        'title': l10n.roleSupplierTitle,
        'subtitle': l10n.roleSupplierSubtitle,
        'description': l10n.roleSupplierDesc,
        'icon': Icons.forest,
      },
      {
        'id': 'generator',
        'title': l10n.roleGeneratorTitle,
        'subtitle': l10n.roleGeneratorSubtitle,
        'description': l10n.roleGeneratorDesc,
        'icon': Icons.handyman,
      },
      {
        'id': 'aggregator',
        'title': l10n.roleAggregatorTitle,
        'subtitle': l10n.roleAggregatorSubtitle,
        'description': l10n.roleAggregatorDesc,
        'icon': Icons.local_shipping,
      },
      {
        'id': 'converter',
        'title': l10n.roleConverterTitle,
        'subtitle': l10n.roleConverterSubtitle,
        'description': l10n.roleConverterDesc,
        'icon': Icons.brush,
      },
      {
        'id': 'designer',
        'title': l10n.roleDesignerTitle,
        'subtitle': l10n.roleDesignerSubtitle,
        'description': l10n.roleDesignerDesc,
        'icon': Icons.architecture,
      },
      {
        'id': 'buyer',
        'title': l10n.roleBuyerTitle,
        'subtitle': l10n.roleBuyerSubtitle,
        'description': l10n.roleBuyerDesc,
        'icon': Icons.shopping_bag,
      },
    ];

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
                      onTap: () =>
                          context.read<LanguageCubit>().changeLanguage('en'),
                      child: Text(
                        'EN',
                        style: TextStyle(
                          color: currentLang == 'EN'
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
                      onTap: () =>
                          context.read<LanguageCubit>().changeLanguage('id'),
                      child: Text(
                        'ID',
                        style: TextStyle(
                          color: currentLang == 'ID'
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
                      Text(
                        l10n.roleSelectionWelcome,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),

                // Roles List
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    itemCount: roles.length,
                    itemBuilder: (context, index) {
                      final role = roles[index];
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
                            switch (_selectedRole) {
                              case 'supplier':
                                context.pushNamed('supplier_registration');
                                break;
                              case 'generator':
                                context.pushNamed('generator_registration');
                                break;
                              case 'aggregator':
                                context.pushNamed('aggregator_registration');
                                break;
                              case 'converter':
                                context.pushNamed('converter_registration');
                                break;
                              case 'designer':
                                context.pushNamed(
                                  'designer_consultant_profile',
                                );
                                break;
                              case 'buyer':
                                context.pushNamed('buyer_registration');
                                break;
                              default:
                                context.pushNamed('login');
                            }
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
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                l10n.continueButton,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Icon(Icons.arrow_forward),
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
                              TextSpan(text: l10n.alreadyHaveAccount),
                              TextSpan(
                                text: l10n.logInButton,
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
