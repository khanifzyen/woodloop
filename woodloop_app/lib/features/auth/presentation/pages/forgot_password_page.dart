import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../../../injection_container.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _isLoading = false;
  bool _emailSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _requestReset() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      await getIt<AuthRepository>().requestPasswordReset(
        _emailController.text.trim(),
      );
      if (mounted) {
        setState(() {
          _isLoading = false;
          _emailSent = true;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(e.toString()),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

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
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        // Top Section: Logo
                        Padding(
                          padding: const EdgeInsets.only(
                            top: 24.0,
                            bottom: 48.0,
                          ),
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

                        // Icon
                        Container(
                          width: 64,
                          height: 64,
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceColor,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: AppTheme.primaryColor.withValues(
                                alpha: 0.2,
                              ),
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
                            _emailSent
                                ? Icons.mark_email_read_outlined
                                : Icons.lock_reset,
                            color: AppTheme.primaryColor,
                            size: 32,
                          ),
                        ),
                        const SizedBox(height: 24),

                        Text(
                          _emailSent
                              ? 'Email Terkirim!'
                              : l10n.forgotPasswordTitle,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          _emailSent
                              ? 'Cek kotak masuk email Anda dan ikuti instruksi untuk mereset password.'
                              : l10n.forgotPasswordSubtitle,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 16,
                            height: 1.5,
                          ),
                        ),
                        const SizedBox(height: 48),

                        if (!_emailSent) ...[
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
                              TextFormField(
                                controller: _emailController,
                                style: const TextStyle(color: Colors.white),
                                keyboardType: TextInputType.emailAddress,
                                textInputAction: TextInputAction.done,
                                onFieldSubmitted: (_) => _requestReset(),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Email wajib diisi';
                                  }
                                  if (!RegExp(
                                    r'^[^@]+@[^@]+\.[^@]+',
                                  ).hasMatch(value)) {
                                    return 'Format email tidak valid';
                                  }
                                  return null;
                                },
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
                              onPressed: _isLoading ? null : _requestReset,
                              child: _isLoading
                                  ? const SizedBox(
                                      width: 24,
                                      height: 24,
                                      child: CircularProgressIndicator(
                                        color: AppTheme.background,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          l10n.forgotPasswordSendLink,
                                          style: TextStyle(
                                            color: AppTheme.background,
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Icon(
                                          Icons.send_outlined,
                                          color: AppTheme.background,
                                          size: 20,
                                        ),
                                      ],
                                    ),
                            ),
                          ),
                        ] else ...[
                          // Resend button
                          TextButton(
                            onPressed: () => setState(() {
                              _emailSent = false;
                              _emailController.clear();
                            }),
                            child: const Text(
                              'Kirim ulang ke email lain',
                              style: TextStyle(color: Colors.white54),
                            ),
                          ),
                        ],

                        const Spacer(),

                        // Bottom: Back to Login
                        Padding(
                          padding: const EdgeInsets.only(
                            bottom: 24.0,
                            top: 24.0,
                          ),
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
              ),
            );
          },
        ),
      ),
    );
  }
}
