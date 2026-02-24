import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _pageController = PageController();
  int _currentPageIndex = 0;

  List<Map<String, String>> _getOnboardingData(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return [
      {
        'title': l10n.onboardingCaptureSellTitle,
        'subtitle': l10n.onboardingCaptureSellSubtitle,
        'icon': 'recycling',
        'highlight': l10n.onboardingCaptureSellHighlight,
      },
      {
        'title': l10n.onboardingEfficientCollectionTitle,
        'subtitle': l10n.onboardingEfficientCollectionSubtitle,
        'icon': 'local_shipping',
        'highlight': l10n.onboardingEfficientCollectionHighlight,
      },
      {
        'title': l10n.onboardingTraceableImpactTitle,
        'subtitle': l10n.onboardingTraceableImpactSubtitle,
        'icon': 'eco',
        'highlight': l10n.onboardingTraceableImpactHighlight,
      },
    ];
  }

  void _nextPage(int totalLength) {
    if (_currentPageIndex < totalLength - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      context.goNamed('role_selection');
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final onboardingData = _getOnboardingData(context);

    return Scaffold(
      backgroundColor: AppTheme.background, // Dark Theme based on Stitch
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 24.0,
                vertical: 16.0,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.recycling, color: AppTheme.primaryColor),
                      const SizedBox(width: 8),
                      const Text(
                        'WOODLOOP',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.2,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () => context.goNamed('role_selection'),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.white54,
                    ),
                    child: Text(l10n.onboardingSkip),
                  ),
                ],
              ),
            ),

            // Page View
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentPageIndex = index;
                  });
                },
                itemCount: onboardingData.length,
                itemBuilder: (context, index) {
                  return SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24.0,
                      vertical: 24.0,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Placeholder for the large image/graphic
                        Container(
                          height: MediaQuery.of(context).size.height * 0.45,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: const Color(0xFF102216),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: Colors.white10),
                            boxShadow: [
                              BoxShadow(
                                color: AppTheme.primaryColor.withValues(
                                  alpha: 0.05,
                                ),
                                blurRadius: 20,
                                spreadRadius: 5,
                              ),
                            ],
                          ),
                          child: Center(
                            child: Icon(
                              IconData(
                                _getIconCode(onboardingData[index]['icon']!),
                                fontFamily: 'MaterialIcons',
                              ),
                              size: 100,
                              color: AppTheme.primaryColor.withValues(
                                alpha: 0.5,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 32),

                        // Title
                        RichText(
                          textAlign: TextAlign.center,
                          text: TextSpan(
                            style: const TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              height: 1.1,
                              letterSpacing: -0.5,
                              color: Colors.white,
                            ),
                            children: [
                              TextSpan(
                                text: onboardingData[index]['title']!.split(
                                  onboardingData[index]['highlight']!,
                                )[0],
                              ),
                              TextSpan(
                                text: onboardingData[index]['highlight'],
                                style: TextStyle(color: AppTheme.primaryColor),
                              ),
                              TextSpan(
                                text:
                                    onboardingData[index]['title']!
                                            .split(
                                              onboardingData[index]['highlight']!,
                                            )
                                            .length >
                                        1
                                    ? onboardingData[index]['title']!.split(
                                        onboardingData[index]['highlight']!,
                                      )[1]
                                    : '',
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Subtitle
                        Text(
                          onboardingData[index]['subtitle']!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.white60,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Bottom Navigation Area
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  // Indicators
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      onboardingData.length,
                      (index) => AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        height: 6,
                        width: _currentPageIndex == index ? 32 : 8,
                        decoration: BoxDecoration(
                          color: _currentPageIndex == index
                              ? AppTheme.primaryColor
                              : Colors.white24,
                          borderRadius: BorderRadius.circular(4),
                          boxShadow: _currentPageIndex == index
                              ? [
                                  BoxShadow(
                                    color: AppTheme.primaryColor.withValues(
                                      alpha: 0.5,
                                    ),
                                    blurRadius: 8,
                                  ),
                                ]
                              : [],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Next Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => _nextPage(onboardingData.length),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 8,
                        shadowColor: AppTheme.primaryColor.withValues(
                          alpha: 0.5,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            l10n.onboardingNext,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF102216),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Icon(
                            Icons.arrow_forward,
                            color: const Color(0xFF102216),
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
      ),
    );
  }

  int _getIconCode(String iconName) {
    switch (iconName) {
      case 'recycling':
        return 0xe534; // Approximate Material Icon code for recycling
      case 'local_shipping':
        return 0xe3a6; // Approximate Material Icon code for local_shipping
      case 'eco':
        return 0xe231; // Approximate Material Icon code for eco
      default:
        return 0xe5d0; // Add generic if missing
    }
  }
}
