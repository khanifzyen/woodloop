import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class ConverterRegistrationPage extends StatefulWidget {
  const ConverterRegistrationPage({super.key});

  @override
  State<ConverterRegistrationPage> createState() =>
      _ConverterRegistrationPageState();
}

class _ConverterRegistrationPageState extends State<ConverterRegistrationPage> {
  final _formKey = GlobalKey<FormState>();
  String _selectedSpecialty = '';

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
          l10n.converterRegTitle,
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
                        l10n.converterRegHeader,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        l10n.converterRegSubHeader,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Input Fields
                      _buildInputField(
                        label: l10n.converterRegStudioName,
                        hint: l10n.converterRegStudioNameHint,
                        icon: Icons.storefront,
                      ),
                      const SizedBox(height: 20),
                      _buildInputField(
                        label: l10n.converterRegOwnerName,
                        hint: l10n.converterRegOwnerNameHint,
                        icon: Icons.person_outline,
                      ),
                      const SizedBox(height: 20),
                      _buildInputField(
                        label: l10n.converterRegWhatsApp,
                        hint: l10n.converterRegWhatsAppHint,
                        icon: Icons.phone_outlined,
                        keyboardType: TextInputType.phone,
                      ),
                      const SizedBox(height: 24),

                      // Map Placeholder
                      Text(
                        l10n.converterRegLocation,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        height: 160,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                          image: const DecorationImage(
                            image: AssetImage('assets/images/map_jepara.jpg'),
                            fit: BoxFit.cover,
                            opacity: 0.5,
                          ),
                        ),
                        child: Center(
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: AppTheme.primaryColor.withValues(
                                    alpha: 0.4,
                                  ),
                                  blurRadius: 12,
                                  spreadRadius: 4,
                                ),
                              ],
                            ),
                            child: const Icon(
                              Icons.location_on,
                              color: AppTheme.background,
                              size: 32,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Specialty Selection
                      Text(
                        l10n.converterRegSpecialty,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          _buildSpecialtyChip(
                            l10n.converterRegSpecEcoFurniture,
                            Icons.chair_alt,
                          ),
                          _buildSpecialtyChip(
                            l10n.converterRegSpecHandicraft,
                            Icons.palette_outlined,
                          ),
                          _buildSpecialtyChip(
                            l10n.converterRegSpecBriquette,
                            Icons.local_fire_department_outlined,
                          ),
                          _buildSpecialtyChip(
                            l10n.converterRegSpecCompost,
                            Icons.eco_outlined,
                          ),
                          _buildSpecialtyChip(
                            l10n.converterRegSpecOther,
                            Icons.more_horiz,
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Estimated Volume Need
                      _buildInputField(
                        label: l10n.converterRegRawMaterialNeed,
                        hint: l10n.converterRegRawMaterialHint,
                        icon: Icons.inventory_2_outlined,
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 48), // Padding at bottom
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
                      // Logic for successful registration, navigate to Dashboard
                      context.go('/converter-dashboard');
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
                    l10n.converterRegSubmitBtn,
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
    required String label,
    required String hint,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
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
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Colors.white24),
            prefixIcon: Icon(icon, color: Colors.white54),
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
            if (value == null || value.isEmpty) {
              return AppLocalizations.of(
                context,
              )!.converterRegRequiredValidation;
            }
            return null;
          },
        ),
      ],
    );
  }

  Widget _buildSpecialtyChip(String label, IconData icon) {
    bool isSelected = _selectedSpecialty == label;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedSpecialty = label;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor.withValues(alpha: 0.1)
              : AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? AppTheme.primaryColor
                : Colors.white.withValues(alpha: 0.1),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected ? AppTheme.primaryColor : Colors.white54,
              size: 18,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? AppTheme.primaryColor : Colors.white70,
                fontSize: 14,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
