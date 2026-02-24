import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class ForgotPasswordPage extends StatelessWidget {
  const ForgotPasswordPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: IntrinsicHeight(
                  child: Column(
                    children: [
                      // Top Section: Logo
                      Padding(
                        padding: const EdgeInsets.only(top: 24.0, bottom: 48.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: AppTheme.primaryColor,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(
                                Icons.recycling,
                                color: Color(0xFF0F2317),
                                size: 20,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'WoodLoop',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                letterSpacing: -0.5,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const Spacer(),

                      // Middle Section: Content Form
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppTheme.primaryColor.withValues(alpha: 0.2),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.primaryColor.withValues(
                                alpha: 0.15,
                              ),
                              blurRadius: 20,
                              spreadRadius: -5,
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.lock_reset,
                          color: AppTheme.primaryColor,
                          size: 32,
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        l10n.forgotPasswordTitle,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        l10n.forgotPasswordSubtitle,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 16,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 48),

                      // Email Field
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(
                              left: 4.0,
                              bottom: 8.0,
                            ),
                            child: Text(
                              l10n.forgotPasswordEmailLabel,
                              style: const TextStyle(
                                color: Colors.white70,
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          TextField(
                            style: const TextStyle(color: Colors.white),
                            keyboardType: TextInputType.emailAddress,
                            decoration: InputDecoration(
                              hintText: l10n.forgotPasswordEmailHint,
                              prefixIcon: const Icon(
                                Icons.mail_outline,
                                color: Colors.white38,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Send Reset Link Button
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: () {
                            // TODO: Implement password reset logic
                          },
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                l10n.forgotPasswordSendLink,
                                style: TextStyle(color: AppTheme.background),
                              ),
                              const SizedBox(width: 8),
                              Icon(
                                Icons.arrow_forward,
                                color: AppTheme.background,
                                size: 20,
                              ),
                            ],
                          ),
                        ),
                      ),

                      const Spacer(),

                      // Bottom Section: Back to Login
                      Padding(
                        padding: const EdgeInsets.only(bottom: 24.0, top: 24.0),
                        child: TextButton.icon(
                          onPressed: () => context.pop(),
                          icon: const Icon(
                            Icons.arrow_back,
                            color: Colors.white54,
                            size: 18,
                          ),
                          label: Text(
                            l10n.forgotPasswordBackToLogin,
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          style: TextButton.styleFrom(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
