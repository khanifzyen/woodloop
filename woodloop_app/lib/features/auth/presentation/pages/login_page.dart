import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../bloc/auth_bloc.dart';
import '../../domain/entities/user_document.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../../../injection_container.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool _obscurePassword = true;
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  String _friendlyErrorMessage(String raw) {
    final lower = raw.toLowerCase();
    if (lower.contains('invalid credentials') ||
        lower.contains('failed to authenticate')) {
      return 'Email atau password salah. Silakan coba lagi.';
    }
    if (lower.contains('not found')) {
      return 'Akun tidak ditemukan. Pastikan email Anda benar.';
    }
    return 'Login gagal. Silakan coba lagi.';
  }

  void _showUnverifiedDialog(BuildContext context, String email) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        icon: const Icon(
          Icons.mark_email_unread_outlined,
          color: AppTheme.primaryColor,
          size: 40,
        ),
        title: const Text(
          'Akun Belum Aktif',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        content: Text(
          'Email Anda ($email) belum diverifikasi.\n\nCek kotak masuk email Anda dan klik tautan verifikasi untuk mengaktifkan akun.',
          style: const TextStyle(color: Colors.white70, height: 1.5),
          textAlign: TextAlign.center,
        ),
        actionsAlignment: MainAxisAlignment.center,
        actions: [
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();
              try {
                await getIt<AuthRepository>().requestPasswordReset(email);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Email verifikasi sudah dikirim ulang.'),
                      backgroundColor: Colors.green,
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                }
              } catch (_) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Gagal mengirim ulang. Coba lagi.'),
                      backgroundColor: Colors.redAccent,
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                }
              }
            },
            child: const Text(
              'Kirim Ulang Email',
              style: TextStyle(color: Colors.white54),
            ),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Mengerti'),
          ),
        ],
      ),
    );
  }

  void _showAdminUnverifiedDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        icon: const Icon(
          Icons.pending_actions_outlined,
          color: Colors.orange,
          size: 40,
        ),
        title: const Text(
          'Akun Dalam Proses Verifikasi',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        content: const Text(
          'Email Anda sudah terverifikasi, namun akun Anda masih menunggu persetujuan admin.\n\nProses verifikasi membutuhkan waktu hingga 1×24 jam. Harap bersabar dan coba login kembali setelah menerima notifikasi persetujuan.',
          style: TextStyle(color: Colors.white70, height: 1.5),
          textAlign: TextAlign.center,
        ),
        actionsAlignment: MainAxisAlignment.center,
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              foregroundColor: Colors.white,
            ),
            child: const Text('Baik, Mengerti'),
          ),
        ],
      ),
    );
  }

  void _showDocumentsUnverifiedDialog(
    BuildContext context,
    List<UserDocument> documents,
  ) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text(
          'Status Verifikasi Dokumen',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        content: SizedBox(
          width: double.maxFinite,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Dokumen legalitas Anda belum lengkap atau masih menunggu verifikasi admin.',
                style: TextStyle(color: Colors.white70, height: 1.5),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              if (documents.isEmpty)
                const Text(
                  'Belum ada dokumen yang diunggah. Hubungi admin.',
                  style: TextStyle(color: Colors.redAccent),
                  textAlign: TextAlign.center,
                )
              else
                Flexible(
                  child: ListView.builder(
                    shrinkWrap: true,
                    itemCount: documents.length,
                    itemBuilder: (context, index) {
                      final doc = documents[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.background,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: doc.verified
                                ? Colors.green.withValues(alpha: 0.3)
                                : Colors.orange.withValues(alpha: 0.3),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    doc.docType.replaceAll('_', ' '),
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                Icon(
                                  doc.verified
                                      ? Icons.check_circle
                                      : Icons.pending,
                                  color: doc.verified
                                      ? Colors.green
                                      : Colors.orange,
                                  size: 16,
                                ),
                              ],
                            ),
                            if (doc.notes != null && doc.notes!.isNotEmpty)
                              Padding(
                                padding: const EdgeInsets.only(top: 4),
                                child: Text(
                                  'Catatan: ${doc.notes}',
                                  style: const TextStyle(
                                    color: Colors.white54,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
            ],
          ),
        ),
        actionsAlignment: MainAxisAlignment.center,
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Mengerti'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: IntrinsicHeight(
                  child: BlocListener<AuthBloc, AuthState>(
                    listener: (context, state) {
                      if (state is AuthUnverifiedEmail) {
                        _showUnverifiedDialog(context, state.email);
                      } else if (state is AuthAdminUnverified) {
                        _showAdminUnverifiedDialog(context);
                      } else if (state is AuthDocumentsUnverified) {
                        _showDocumentsUnverifiedDialog(
                          context,
                          state.documents,
                        );
                      } else if (state is AuthError) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(_friendlyErrorMessage(state.message)),
                            backgroundColor: Colors.redAccent,
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      }
                    },
                    child: Form(
                      key: _formKey,
                      child: Column(
                        children: [
                          const SizedBox(
                            height: 16,
                          ), // Reduced top padding due to AppBar
                          // Header & Logo Section
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceColor,
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: AppTheme.primaryColor.withValues(
                                  alpha: 0.3,
                                ),
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: AppTheme.primaryColor.withValues(
                                    alpha: 0.1,
                                  ),
                                  blurRadius: 20,
                                  spreadRadius: 2,
                                ),
                              ],
                            ),
                            child: Transform.rotate(
                              angle:
                                  0.05, // Slight rotation for the 'rotate-3' effect
                              child: Icon(
                                Icons.recycling,
                                color: AppTheme.primaryColor,
                                size: 48,
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            l10n.loginWelcomeBack,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            l10n.loginSubtitle,
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 16,
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
                                  l10n.loginEmailLabel,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                              TextFormField(
                                controller: _emailController,
                                style: const TextStyle(color: Colors.white),
                                keyboardType: TextInputType.emailAddress,
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
                                  hintText: l10n.loginEmailHint,
                                  prefixIcon: const Icon(
                                    Icons.mail_outline,
                                    color: Colors.white38,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),

                          // Password Field
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Padding(
                                padding: const EdgeInsets.only(
                                  left: 4.0,
                                  bottom: 8.0,
                                ),
                                child: Text(
                                  l10n.loginPasswordLabel,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                              TextFormField(
                                controller: _passwordController,
                                style: const TextStyle(color: Colors.white),
                                obscureText: _obscurePassword,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Password wajib diisi';
                                  }
                                  return null;
                                },
                                decoration: InputDecoration(
                                  hintText: l10n.loginPasswordHint,
                                  prefixIcon: const Icon(
                                    Icons.lock_outline,
                                    color: Colors.white38,
                                  ),
                                  suffixIcon: IconButton(
                                    icon: Icon(
                                      _obscurePassword
                                          ? Icons.visibility_off
                                          : Icons.visibility,
                                      color: Colors.white38,
                                    ),
                                    onPressed: () {
                                      setState(() {
                                        _obscurePassword = !_obscurePassword;
                                      });
                                    },
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),

                          // Forgot Password Link
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () =>
                                  context.pushNamed('forgot_password'),
                              style: TextButton.styleFrom(
                                foregroundColor: Colors.white54,
                                padding: EdgeInsets.zero,
                              ),
                              child: Text(l10n.loginForgotPasswordLink),
                            ),
                          ),
                          const SizedBox(height: 24),

                          SizedBox(
                            width: double.infinity,
                            height: 56,
                            child: BlocBuilder<AuthBloc, AuthState>(
                              builder: (context, state) {
                                final isLoading = state is AuthLoading;
                                return ElevatedButton(
                                  onPressed: isLoading
                                      ? null
                                      : () {
                                          if (_formKey.currentState!
                                              .validate()) {
                                            context.read<AuthBloc>().add(
                                              AuthLoginRequested(
                                                email: _emailController.text
                                                    .trim(),
                                                password:
                                                    _passwordController.text,
                                              ),
                                            );
                                          }
                                        },
                                  child: isLoading
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
                                              l10n.loginButton,
                                              style: TextStyle(
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
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 32),

                          // Social Divider
                          Row(
                            children: [
                              Expanded(
                                child: Divider(
                                  color: Colors.white.withValues(alpha: 0.1),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                ),
                                child: Text(
                                  l10n.loginOrContinueWith,
                                  style: const TextStyle(
                                    color: Colors.white54,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                              Expanded(
                                child: Divider(
                                  color: Colors.white.withValues(alpha: 0.1),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),

                          // Social Buttons
                          SizedBox(
                            width: double.infinity,
                            child: OutlinedButton.icon(
                              onPressed: () {},
                              icon: const Icon(
                                Icons.g_mobiledata,
                                color: Colors.white,
                                size: 28,
                              ), // Placeholder for Google
                              label: Text(
                                l10n.loginGoogle,
                                style: const TextStyle(color: Colors.white),
                              ),
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 12,
                                ),
                                side: BorderSide(
                                  color: Colors.white.withValues(alpha: 0.1),
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                backgroundColor: AppTheme.surfaceColor,
                              ),
                            ),
                          ),

                          const Spacer(),

                          // Footer Sign Up Link
                          Padding(
                            padding: const EdgeInsets.only(
                              bottom: 24.0,
                              top: 48.0,
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  l10n.loginDontHaveAccount,
                                  style: const TextStyle(color: Colors.white54),
                                ),
                                GestureDetector(
                                  onTap: () {
                                    context.pushNamed('role_selection');
                                  },
                                  child: Text(
                                    l10n.loginSignUp,
                                    style: TextStyle(
                                      color: AppTheme.primaryColor,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
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
