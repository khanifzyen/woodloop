import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class BuyerRegistrationPage extends StatefulWidget {
  const BuyerRegistrationPage({super.key});

  @override
  State<BuyerRegistrationPage> createState() => _BuyerRegistrationPageState();
}

class _BuyerRegistrationPageState extends State<BuyerRegistrationPage> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l10n.buyerRegTitle,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Form Header
                      Text(
                        l10n.buyerRegHeader,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        l10n.buyerRegSubheader,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 14,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Input Fields
                      _buildInputField(
                        context: context,
                        label: l10n.buyerRegNameLabel,
                        hint: l10n.buyerRegNameHint,
                        icon: Icons.person_outline,
                      ),
                      const SizedBox(height: 20),
                      _buildInputField(
                        context: context,
                        label: l10n.buyerRegEmailLabel,
                        hint: l10n.buyerRegEmailHint,
                        icon: Icons.email_outlined,
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 20),
                      _buildInputField(
                        context: context,
                        label: l10n.buyerRegPhoneLabel,
                        hint: l10n.buyerRegPhoneHint,
                        icon: Icons.phone_outlined,
                        keyboardType: TextInputType.phone,
                      ),
                      const SizedBox(height: 20),
                      _buildInputField(
                        context: context,
                        label: l10n.buyerRegPasswordLabel,
                        hint: l10n.buyerRegPasswordHint,
                        icon: Icons.lock_outline,
                        isPassword: true,
                      ),
                      const SizedBox(height: 20),
                      _buildInputField(
                        context: context,
                        label: l10n.buyerRegAddressLabel,
                        hint: l10n.buyerRegAddressHint,
                        icon: Icons.home_outlined,
                        maxLines: 3,
                      ),
                      const SizedBox(height: 48), // Bottom padding
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Action
            Container(
              padding: const EdgeInsets.all(24.0),
              decoration: BoxDecoration(
                color: AppTheme.background,
                border: Border(
                  top: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
                ),
              ),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      // Navigate to Buyer Dashboard
                      context.go('/buyer-dashboard');
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  child: Text(
                    l10n.buyerRegBtnSubmit,
                    style: const TextStyle(
                      color: AppTheme.background,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputField({
    required BuildContext context,
    required String label,
    required String hint,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    bool isPassword = false,
    int maxLines = 1,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          keyboardType: keyboardType,
          obscureText: isPassword,
          maxLines: maxLines,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Colors.white24),
            prefixIcon: maxLines == 1
                ? Icon(icon, color: Colors.white54)
                : null,
            filled: true,
            fillColor: AppTheme.surfaceColor,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(
                color: Colors.white.withValues(alpha: 0.1),
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(
                color: Colors.white.withValues(alpha: 0.1),
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppTheme.primaryColor),
            ),
          ),
          validator: (value) {
            // Optional field logic if needed, simplify for now
            if (maxLines == 1 && (value == null || value.isEmpty)) {
              return AppLocalizations.of(context)!.buyerRegRequiredValidation;
            }
            return null;
          },
        ),
      ],
    );
  }
}
