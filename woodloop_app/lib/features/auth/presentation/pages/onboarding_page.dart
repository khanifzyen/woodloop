import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _pageController = PageController();
  int _currentPageIndex = 0;

  final List<Map<String, String>> _onboardingData = [
    {
      'title': 'Capture & Sell',
      'subtitle':
          'Simply take a photo of your wood waste to list it on the marketplace. No more burning—turn your leftovers into resources.',
      'icon': 'recycling',
      'highlight': 'Sell',
    },
    {
      'title': 'Efficient Collection',
      'subtitle':
          'Aggregators bridge the gap by collecting waste from various workshops and supplying them to creative converters. We automate the pickup scheduling so you can focus on sorting and selling.',
      'icon': 'local_shipping',
      'highlight': 'Collection',
    },
    {
      'title': 'Traceable Impact',
      'subtitle':
          'Every piece of wood has a story. Track your environmental impact and showcase the sustainable journey of your products to eco-conscious buyers worldwide.',
      'icon': 'eco',
      'highlight': 'Impact',
    },
  ];

  void _nextPage() {
    if (_currentPageIndex < _onboardingData.length - 1) {
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
    return Scaffold(
      backgroundColor: AppTheme.background, // Match light theme from Stitch
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
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () => context.goNamed('role_selection'),
                    child: const Text(
                      'Skip',
                      style: TextStyle(color: Colors.grey),
                    ),
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
                itemCount: _onboardingData.length,
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
                          height: MediaQuery.of(context).size.height * 0.4,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: const Color(0xFF102216),
                            borderRadius: BorderRadius.circular(24),
                            boxShadow: [
                              BoxShadow(
                                color: AppTheme.primaryColor.withValues(
                                  alpha: 0.1,
                                ),
                                blurRadius: 20,
                                spreadRadius: 5,
                              ),
                            ],
                          ),
                          child: Icon(
                            IconData(
                              _getIconCode(_onboardingData[index]['icon']!),
                              fontFamily: 'MaterialIcons',
                            ),
                            size: 100,
                            color: AppTheme.primaryColor.withValues(alpha: 0.5),
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
                              color: Colors.black87,
                            ),
                            children: [
                              TextSpan(
                                text: _onboardingData[index]['title']!.split(
                                  _onboardingData[index]['highlight']!,
                                )[0],
                              ),
                              TextSpan(
                                text: _onboardingData[index]['highlight'],
                                style: TextStyle(color: AppTheme.primaryColor),
                              ),
                              TextSpan(
                                text:
                                    _onboardingData[index]['title']!
                                            .split(
                                              _onboardingData[index]['highlight']!,
                                            )
                                            .length >
                                        1
                                    ? _onboardingData[index]['title']!.split(
                                        _onboardingData[index]['highlight']!,
                                      )[1]
                                    : '',
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Subtitle
                        Text(
                          _onboardingData[index]['subtitle']!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.black54,
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
                      _onboardingData.length,
                      (index) => AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        height: 6,
                        width: _currentPageIndex == index ? 32 : 8,
                        decoration: BoxDecoration(
                          color: _currentPageIndex == index
                              ? AppTheme.primaryColor
                              : Colors.grey.shade300,
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
                      onPressed: _nextPage,
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
                          const Text(
                            'Next',
                            style: TextStyle(
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
