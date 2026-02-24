import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    // Simulate loading and redirect
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        context.goNamed('onboarding');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF102216), // background-dark
      body: Stack(
        children: [
          // Background Gradient
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Color(0xFF102216), Color(0xFF0C180F)],
                ),
              ),
            ),
          ),

          // Main Content
          SafeArea(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Spacer(),

                // Logo Area
                Center(
                  child: Container(
                    width: 96,
                    height: 96,
                    decoration: BoxDecoration(
                      color: AppTheme.background,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.5),
                          blurRadius: 20,
                          spreadRadius: 5,
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        'W',
                        style: GoogleFonts.newsreader(
                          color: AppTheme.primaryColor,
                          fontSize: 48,
                          fontWeight: FontWeight.w900,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 32),

                // Title
                RichText(
                  text: TextSpan(
                    style: GoogleFonts.newsreader(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
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

                const SizedBox(height: 16),

                // Divider
                Container(
                  height: 1,
                  width: 64,
                  color: Colors.white.withValues(alpha: 0.2),
                ),

                const SizedBox(height: 16),

                // Subtitle
                Text(
                  AppLocalizations.of(context)!.splashSubtitle,
                  style: GoogleFonts.spaceGrotesk(
                    color: Colors.white70,
                    fontSize: 20,
                    fontStyle: FontStyle.italic,
                  ),
                ),

                const Spacer(),

                // Loading Indicator Area
                Container(
                  width: 160,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(2),
                  ),
                  child: FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: 0.33,
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor,
                        borderRadius: BorderRadius.circular(2),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primaryColor.withValues(alpha: 0.5),
                            blurRadius: 10,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 12),

                Text(
                  AppLocalizations.of(context)!.splashInitializing,
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.4),
                    fontSize: 12,
                    letterSpacing: 2,
                    fontWeight: FontWeight.w500,
                  ),
                ),

                const SizedBox(height: 32),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
