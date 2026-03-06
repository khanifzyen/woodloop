import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import 'package:file_picker/file_picker.dart';
import '../bloc/auth_bloc.dart';
import '../../../../injection_container.dart';
import '../../domain/repositories/auth_repository.dart';

/// Unified registration page that shows role-specific fields
/// based on the selected role from RoleSelectionPage.
class UnifiedRegistrationPage extends StatefulWidget {
  final String role;

  const UnifiedRegistrationPage({super.key, required this.role});

  @override
  State<UnifiedRegistrationPage> createState() =>
      _UnifiedRegistrationPageState();
}

class _UnifiedRegistrationPageState extends State<UnifiedRegistrationPage> {
  final _formKey = GlobalKey<FormState>();
  final Set<String> _selectedWasteTypes = {};
  String _selectedVehicle = '';
  final Set<String> _selectedSpecialties = {};

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _companyController = TextEditingController();
  final _addressController = TextEditingController();
  double? _lat;
  double? _lng;

  /// Legality documents with their type: { 'path': '/tmp/...', 'docType': 'NIB' }
  final List<Map<String, String>> _legalityDocs = [];
  bool _obscurePassword = true;
  bool _isRegistering = false;

  static const List<String> _docTypes = [
    'NIB',
    'SVLK',
    'SK_Pengesahan',
    'Izin_Usaha',
    'Sertifikat_Lainnya',
    'Lainnya',
  ];

  Future<void> _uploadDocumentsForUser(String userId) async {
    if (_legalityDocs.isEmpty) return;
    final repo = getIt<AuthRepository>();
    // Group by docType for efficient batch upload
    final grouped = <String, List<String>>{};
    for (final doc in _legalityDocs) {
      final type = doc['docType'] ?? 'Lainnya';
      grouped.putIfAbsent(type, () => []).add(doc['path']!);
    }
    for (final entry in grouped.entries) {
      await repo.uploadUserDocuments(
        userId: userId,
        filePaths: entry.value,
        docType: entry.key,
      );
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _companyController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  String _getRoleDisplayName(AppLocalizations l10n) {
    switch (widget.role) {
      case 'supplier':
        return l10n.roleSupplierTitle;
      case 'generator':
        return l10n.roleGeneratorTitle;
      case 'aggregator':
        return l10n.roleAggregatorTitle;
      case 'converter':
        return l10n.roleConverterTitle;
      case 'buyer':
        return l10n.roleBuyerTitle;
      default:
        return widget.role;
    }
  }

  String _getRegTitle(AppLocalizations l10n) {
    switch (widget.role) {
      case 'supplier':
        return l10n.supplierRegTitle;
      case 'generator':
        return l10n.generatorRegTitle;
      case 'aggregator':
        return l10n.aggregatorRegTitle;
      case 'converter':
        return l10n.converterRegTitle;
      case 'buyer':
        return l10n.buyerRegTitle;
      default:
        return 'Register';
    }
  }

  String _getRegSubtitle(AppLocalizations l10n) {
    switch (widget.role) {
      case 'supplier':
        return l10n.supplierRegSubtitle;
      case 'generator':
        return l10n.generatorRegSubtitle;
      case 'aggregator':
        return l10n.aggregatorRegSubtitle;
      case 'converter':
        return l10n.converterRegSubHeader;
      case 'buyer':
        return l10n.buyerRegSubheader;
      default:
        return 'Bergabung dengan aplikasi ini.';
    }
  }

  String _getNameLabel(AppLocalizations l10n) {
    switch (widget.role) {
      case 'supplier':
        return l10n.supplierRegFullNameLabel;
      case 'generator':
        return l10n.generatorRegOwnerName;
      case 'aggregator':
        return l10n.aggregatorRegFullName;
      case 'converter':
        return l10n.converterRegOwnerName;
      case 'buyer':
        return l10n.buyerRegNameLabel;
      default:
        return 'NAMA LENGKAP';
    }
  }

  String _getNameHint(AppLocalizations l10n) {
    switch (widget.role) {
      case 'supplier':
        return l10n.supplierRegFullNameHint;
      case 'generator':
        return l10n.generatorRegOwnerHint;
      case 'aggregator':
        return l10n.aggregatorRegFullNameHint;
      case 'converter':
        return l10n.converterRegOwnerNameHint;
      case 'buyer':
        return l10n.buyerRegNameHint;
      default:
        return 'John Doe';
    }
  }

  String _getRegSubmitBtnLabel(AppLocalizations l10n) {
    switch (widget.role) {
      case 'supplier':
        return l10n.supplierRegCompleteBtn;
      case 'generator':
        return l10n.generatorRegCompleteBtn;
      case 'aggregator':
        return l10n.aggregatorRegSubmitBtn;
      case 'converter':
        return l10n.converterRegSubmitBtn;
      case 'buyer':
        return l10n.buyerRegBtnSubmit;
      default:
        return 'Daftar';
    }
  }

  IconData get _roleIcon {
    switch (widget.role) {
      case 'supplier':
        return Icons.forest;
      case 'generator':
        return Icons.factory_outlined;
      case 'aggregator':
        return Icons.local_shipping_outlined;
      case 'converter':
        return Icons.auto_fix_high;
      case 'buyer':
        return Icons.shopping_bag_outlined;
      case 'enabler':
        return Icons.verified_outlined;
      default:
        return Icons.person;
    }
  }

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
          _getRegTitle(l10n),
          style: const TextStyle(
            color: AppTheme.primaryColor,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthError) {
            setState(() => _isRegistering = false);
            String message = state.message;
            // Handle PocketBase unique field error specifically
            if (message.contains('is not unique') ||
                message.contains('Constraint violation')) {
              if (message.contains('email')) {
                message = 'Email sudah digunakan';
              } else if (message.contains('phone')) {
                message = 'Nomor telepon sudah digunakan';
              }
            }
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(message),
                backgroundColor: Colors.redAccent,
              ),
            );
          }

          if (state is AuthRegisterSuccess && _isRegistering) {
            setState(() => _isRegistering = false);
            if (_legalityDocs.isNotEmpty) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Mengunggah dokumen legalitas...'),
                  duration: Duration(seconds: 2),
                ),
              );
              _uploadDocumentsForUser(state.user.id)
                  .then((_) {
                    if (mounted) _showSuccessDialog(context);
                  })
                  .catchError((e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Gagal mengunggah beberapa dokumen.'),
                          backgroundColor: Colors.redAccent,
                        ),
                      );
                      _showSuccessDialog(context);
                    }
                  });
            } else {
              _showSuccessDialog(context);
            }
          }
        },
        child: SafeArea(
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
                        // Role Badge
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: AppTheme.primaryColor.withValues(
                                alpha: 0.2,
                              ),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                _roleIcon,
                                color: AppTheme.primaryColor,
                                size: 18,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _getRoleDisplayName(l10n),
                                style: const TextStyle(
                                  color: AppTheme.primaryColor,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Title
                        Text(
                          _getRegTitle(l10n),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _getRegSubtitle(l10n),
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 32),

                        // ── Common Fields (All Roles) ──
                        _buildLabel(_getNameLabel(l10n).toUpperCase()),
                        _buildTextField(
                          hintText: _getNameHint(l10n),
                          icon: Icons.person_outline,
                          controller: _nameController,
                          validator: (v) => v == null || v.isEmpty
                              ? l10n.buyerRegRequiredValidation
                              : null,
                        ),
                        const SizedBox(height: 20),

                        _buildLabel(l10n.loginEmailLabel.toUpperCase()),
                        _buildTextField(
                          hintText: l10n.buyerRegEmailHint,
                          icon: Icons.email_outlined,
                          keyboardType: TextInputType.emailAddress,
                          controller: _emailController,
                          validator: (v) {
                            if (v == null || v.isEmpty) {
                              return l10n.buyerRegRequiredValidation;
                            }
                            if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(v)) {
                              return 'Format email tidak valid';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),

                        _buildLabel(l10n.supplierRegPhoneLabel.toUpperCase()),
                        _buildTextField(
                          hintText: l10n.generatorRegPhoneHint,
                          iconWidget: const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 12.0),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  '+62',
                                  style: TextStyle(
                                    color: Colors.white54,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                Icon(
                                  Icons.expand_more,
                                  color: Colors.white54,
                                  size: 20,
                                ),
                              ],
                            ),
                          ),
                          keyboardType: TextInputType.phone,
                          controller: _phoneController,
                        ),
                        const SizedBox(height: 20),

                        _buildLabel(l10n.loginPasswordLabel.toUpperCase()),
                        _buildTextField(
                          hintText: l10n.buyerRegPasswordHint,
                          icon: Icons.lock_outline,
                          obscureText: _obscurePassword,
                          controller: _passwordController,
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility_off_outlined
                                  : Icons.visibility_outlined,
                              color: Colors.white38,
                              size: 20,
                            ),
                            onPressed: () {
                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });
                            },
                          ),
                          validator: (v) {
                            if (v == null || v.isEmpty) {
                              return l10n.buyerRegRequiredValidation;
                            }
                            if (v.length < 8) {
                              return 'Password minimal 8 karakter';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),

                        // ── Supplier-Specific Fields ──
                        if (widget.role == 'supplier') ...[
                          _buildLabel(
                            l10n.supplierRegCompanyNameLabel.toUpperCase(),
                          ),
                          _buildTextField(
                            hintText: l10n.supplierRegCompanyNameHint,
                            icon: Icons.factory_outlined,
                            controller: _companyController,
                          ),
                          const SizedBox(height: 20),
                          _buildAddressMap(l10n),
                          const SizedBox(height: 20),
                          _buildCertUpload(l10n),
                          const SizedBox(height: 24),
                        ],

                        // ── Generator-Specific Fields ──
                        if (widget.role == 'generator') ...[
                          _buildLabel(
                            l10n.generatorRegWorkshopName.toUpperCase(),
                          ),
                          _buildTextField(
                            hintText: l10n.generatorRegWorkshopHint,
                            icon: Icons.home_work_outlined,
                            controller: _companyController,
                          ),
                          const SizedBox(height: 20),
                          _buildAddressMap(l10n),
                          const SizedBox(height: 20),
                          _buildLabel(
                            l10n.generatorRegWasteFocus.toUpperCase(),
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              _buildSelectableChip(
                                l10n.generatorRegWasteSawdust,
                                'sawdust',
                              ),
                              _buildSelectableChip(
                                l10n.generatorRegWasteOffcuts,
                                'offcuts',
                              ),
                              _buildSelectableChip(
                                l10n.generatorRegWasteChips,
                                'chips',
                              ),
                              _buildSelectableChip(
                                l10n.generatorRegWastePallets,
                                'pallets',
                              ),
                              _buildSelectableChip(
                                l10n.generatorRegWasteBark,
                                'bark',
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          _buildLabel(l10n.generatorRegVolLabel.toUpperCase()),
                          _buildTextField(
                            hintText: l10n.generatorRegVolHint,
                            icon: Icons.scale_outlined,
                            keyboardType: TextInputType.number,
                          ),
                          const SizedBox(height: 24),
                        ],

                        // ── Aggregator-Specific Fields ──
                        if (widget.role == 'aggregator') ...[
                          _buildLabel(l10n.aggregatorRegIdCard.toUpperCase()),
                          _buildTextField(
                            hintText: l10n.aggregatorRegIdCardHint,
                            icon: Icons.badge_outlined,
                            keyboardType: TextInputType.number,
                          ),
                          const SizedBox(height: 20),
                          _buildLabel(
                            l10n.aggregatorRegVehicleType.toUpperCase(),
                          ),
                          const SizedBox(height: 8),
                          _buildVehicleSelector(l10n),
                          const SizedBox(height: 20),
                          _buildLabel(
                            l10n.aggregatorRegLicensePlate.toUpperCase(),
                          ),
                          _buildTextField(
                            hintText: l10n.aggregatorRegLicensePlateHint,
                            icon: Icons.directions_car_outlined,
                          ),
                          const SizedBox(height: 20),
                          _buildLabel(
                            l10n.aggregatorWarehouseCapacity.toUpperCase(),
                          ),
                          _buildTextField(
                            hintText: '2000',
                            icon: Icons.warehouse_outlined,
                            keyboardType: TextInputType.number,
                          ),
                          const SizedBox(height: 20),
                          _buildAddressMap(l10n),
                          const SizedBox(height: 24),
                        ],

                        // ── Converter-Specific Fields ──
                        if (widget.role == 'converter') ...[
                          _buildLabel(
                            l10n.converterRegStudioName.toUpperCase(),
                          ),
                          _buildTextField(
                            hintText: l10n.converterRegStudioNameHint,
                            icon: Icons.store_outlined,
                            controller: _companyController,
                          ),
                          const SizedBox(height: 20),
                          _buildLabel(l10n.converterRegSpecialty.toUpperCase()),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              _buildSpecialtyChip(
                                l10n.converterRegSpecEcoFurniture,
                                Icons.chair_outlined,
                              ),
                              _buildSpecialtyChip(
                                l10n.converterRegSpecHandicraft,
                                Icons.handyman_outlined,
                              ),
                              _buildSpecialtyChip(
                                l10n.converterRegSpecBriquette,
                                Icons.local_fire_department,
                              ),
                              _buildSpecialtyChip(
                                l10n.converterRegSpecCompost,
                                Icons.compost_outlined,
                              ),
                              _buildSpecialtyChip(
                                l10n.converterRegSpecOther,
                                Icons.more_horiz,
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          _buildAddressMap(l10n),
                          const SizedBox(height: 20),
                          _buildLabel(
                            l10n.converterRegRawMaterialNeed.toUpperCase(),
                          ),
                          _buildTextField(
                            hintText: l10n.converterRegRawMaterialHint,
                            icon: Icons.scale_outlined,
                            keyboardType: TextInputType.number,
                          ),
                          const SizedBox(height: 24),
                        ],

                        // ── Buyer-Specific Fields ──
                        if (widget.role == 'buyer') ...[
                          _buildAddressMap(l10n),
                          const SizedBox(height: 24),
                        ],

                        // Terms
                        Center(
                          child: RichText(
                            textAlign: TextAlign.center,
                            text: TextSpan(
                              style: const TextStyle(
                                color: Colors.white38,
                                fontSize: 12,
                              ),
                              children: [
                                TextSpan(text: l10n.supplierRegTermsPrefix),
                                TextSpan(
                                  text: l10n.supplierRegTermsLink,
                                  style: const TextStyle(
                                    color: AppTheme.primaryColor,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                                TextSpan(text: l10n.supplierRegTermsAnd),
                                TextSpan(
                                  text: l10n.supplierRegPrivacyLink,
                                  style: const TextStyle(
                                    color: AppTheme.primaryColor,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                                TextSpan(text: l10n.supplierRegTermsSuffix),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),
              ),

              // Bottom Button
              Container(
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  color: AppTheme.background,
                  border: Border(
                    top: BorderSide(
                      color: Colors.white.withValues(alpha: 0.05),
                    ),
                  ),
                ),
                child: Column(
                  children: [
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
                                    if (_formKey.currentState!.validate()) {
                                      setState(() => _isRegistering = true);
                                      context.read<AuthBloc>().add(
                                        AuthRegisterRequested({
                                          'name': _nameController.text.trim(),
                                          'email': _emailController.text.trim(),
                                          'phone': _phoneController.text.trim(),
                                          'password': _passwordController.text,
                                          'passwordConfirm':
                                              _passwordController.text,
                                          'role': widget.role,
                                          'workshop_name': _companyController
                                              .text
                                              .trim(),
                                          'address': _addressController.text,
                                          'location_lat': _lat,
                                          'location_lng': _lng,
                                        }),
                                      );
                                    }
                                  },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primaryColor,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                              elevation: 4,
                              shadowColor: AppTheme.primaryColor.withValues(
                                alpha: 0.3,
                              ),
                            ),
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
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        _getRegSubmitBtnLabel(l10n),
                                        style: const TextStyle(
                                          color: AppTheme.background,
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      const Icon(
                                        Icons.arrow_forward,
                                        color: AppTheme.background,
                                        size: 20,
                                      ),
                                    ],
                                  ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 16),
                    GestureDetector(
                      onTap: () => context.go('/login'),
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
                              style: const TextStyle(
                                color: AppTheme.primaryColor,
                                fontWeight: FontWeight.bold,
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
        ),
      ),
    );
  }

  void _showSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.green.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.mark_email_read_outlined,
                color: Colors.green,
                size: 48,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Pendaftaran Berhasil!',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            const Text(
              'Silakan cek email Anda untuk aktivasi akun.\n\nMenunggu konfirmasi admin 1x24 jam untuk verifikasi data Anda.',
              style: TextStyle(color: Colors.white70, fontSize: 14),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  // Logout to clear the session so they must wait for activation
                  context.read<AuthBloc>().add(AuthLogoutRequested());
                  // After success, go to login so they can login after activation/admin approval
                  context.go('/login');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: const Text(
                  'Selesai',
                  style: TextStyle(
                    color: AppTheme.background,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  // ── Shared Widgets ──

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white54,
          fontSize: 12,
          fontWeight: FontWeight.w600,
          letterSpacing: 1,
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String hintText,
    IconData? icon,
    Widget? iconWidget,
    TextInputType? keyboardType,
    bool obscureText = false,
    int maxLines = 1,
    TextEditingController? controller,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      style: const TextStyle(color: Colors.white),
      keyboardType: keyboardType,
      obscureText: obscureText,
      maxLines: maxLines,
      validator: validator,
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: const TextStyle(color: Colors.white38),
        prefixIcon:
            iconWidget ??
            (icon != null ? Icon(icon, color: Colors.white38, size: 20) : null),
        suffixIcon: suffixIcon,
        filled: true,
        fillColor: AppTheme.surfaceColor,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppTheme.primaryColor),
        ),
        contentPadding: const EdgeInsets.symmetric(
          vertical: 16,
          horizontal: 16,
        ),
      ),
    );
  }

  Widget _buildAddressMap(AppLocalizations l10n) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel(
          (widget.role == 'buyer'
                  ? l10n.buyerRegAddressLabel
                  : l10n.supplierRegAddressLabel)
              .toUpperCase(),
        ),
        _buildTextField(
          hintText: l10n.buyerRegAddressHint,
          icon: Icons.home_outlined,
          controller: _addressController,
          maxLines: 2,
          validator: (v) =>
              v == null || v.isEmpty ? l10n.buyerRegRequiredValidation : null,
        ),
        const SizedBox(height: 12),
        _buildLabel(
          (widget.role == 'generator'
                  ? l10n.generatorRegLocation
                  : 'TITIK LOKASI DI PETA')
              .toUpperCase(),
        ),
        GestureDetector(
          onTap: () async {
            final result = await context.pushNamed('map_picker');
            if (result != null && result is Map<String, dynamic>) {
              setState(() {
                _lat = result['lat'];
                _lng = result['lng'];
                // Auto-fill address from map only if field is still empty
                if (_addressController.text.isEmpty &&
                    result['address'] != null) {
                  _addressController.text = result['address'];
                }
              });
            }
          },
          child: Container(
            height: 120,
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppTheme.surfaceColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: _lat != null
                    ? AppTheme.primaryColor.withValues(alpha: 0.5)
                    : Colors.white.withValues(alpha: 0.1),
              ),
              image: const DecorationImage(
                image: AssetImage('assets/images/map_jepara.jpg'),
                fit: BoxFit.cover,
                opacity: 0.5,
              ),
            ),
            child: Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                        Colors.black.withValues(alpha: 0.85),
                        Colors.black.withValues(alpha: 0.2),
                      ],
                    ),
                  ),
                ),
                if (_lat == null)
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.add_location_alt_outlined,
                          color: AppTheme.primaryColor.withValues(alpha: 0.8),
                          size: 28,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          l10n.supplierRegMapHint,
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                if (_lat != null && _lng != null)
                  Positioned(
                    bottom: 10,
                    left: 14,
                    right: 14,
                    child: Row(
                      children: [
                        const Icon(
                          Icons.check_circle,
                          color: AppTheme.primaryColor,
                          size: 14,
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            '${_lat!.toStringAsFixed(5)}, ${_lng!.toStringAsFixed(5)}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        GestureDetector(
                          onTap: () async {
                            final result = await context.pushNamed(
                              'map_picker',
                            );
                            if (result != null &&
                                result is Map<String, dynamic>) {
                              setState(() {
                                _lat = result['lat'];
                                _lng = result['lng'];
                              });
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              l10n.buyerCheckoutBtnChange,
                              style: const TextStyle(
                                color: AppTheme.background,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
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
      ],
    );
  }

  Widget _buildCertUpload(AppLocalizations l10n) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildLabel(l10n.supplierRegCertLabel.toUpperCase()),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppTheme.primaryColor.withValues(alpha: 0.2),
                ),
              ),
              child: Text(
                l10n.supplierRegCertRequired,
                style: const TextStyle(
                  color: AppTheme.primaryColor,
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        if (_legalityDocs.isNotEmpty) ...[
          ..._legalityDocs.asMap().entries.map((entry) {
            final index = entry.key;
            final doc = entry.value;
            final fileName = doc['path']!.split('/').last;
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.description_outlined,
                    color: AppTheme.primaryColor,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          fileName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        // Doc type dropdown
                        DropdownButton<String>(
                          value: doc['docType'],
                          isDense: true,
                          dropdownColor: AppTheme.background,
                          style: const TextStyle(
                            color: AppTheme.primaryColor,
                            fontSize: 12,
                          ),
                          underline: const SizedBox(),
                          items: _docTypes
                              .map(
                                (t) => DropdownMenuItem(
                                  value: t,
                                  child: Text(t.replaceAll('_', ' ')),
                                ),
                              )
                              .toList(),
                          onChanged: (val) {
                            if (val != null) {
                              setState(
                                () => _legalityDocs[index]['docType'] = val,
                              );
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(
                      Icons.close,
                      color: Colors.redAccent,
                      size: 20,
                    ),
                    onPressed: () {
                      setState(() => _legalityDocs.removeAt(index));
                    },
                  ),
                ],
              ),
            );
          }),
          const SizedBox(height: 8),
        ],
        GestureDetector(
          onTap: () async {
            final result = await FilePicker.platform.pickFiles(
              allowMultiple: true,
              type: FileType.custom,
              allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
            );

            if (result != null) {
              setState(() {
                _legalityDocs.addAll(
                  result.files
                      .where((f) => f.path != null)
                      .map((f) => {'path': f.path!, 'docType': 'NIB'}),
                );
              });
            }
          },
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 24),
            decoration: BoxDecoration(
              color: AppTheme.surfaceColor.withValues(alpha: 0.5),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.1),
                width: 1.5,
              ),
            ),
            child: Column(
              children: [
                Container(
                  height: 40,
                  width: 40,
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.add_a_photo_outlined,
                    color: AppTheme.primaryColor,
                    size: 20,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  l10n.supplierRegUploadTitle,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  l10n.supplierRegUploadHint,
                  style: const TextStyle(color: Colors.white54, fontSize: 11),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSelectableChip(String label, String value) {
    final isSelected = _selectedWasteTypes.contains(value);
    return GestureDetector(
      onTap: () {
        setState(() {
          if (isSelected) {
            _selectedWasteTypes.remove(value);
          } else {
            _selectedWasteTypes.add(value);
          }
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor.withValues(alpha: 0.15)
              : AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? AppTheme.primaryColor
                : Colors.white.withValues(alpha: 0.1),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? AppTheme.primaryColor : Colors.white70,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            fontSize: 13,
          ),
        ),
      ),
    );
  }

  Widget _buildVehicleSelector(AppLocalizations l10n) {
    return Column(
      children: [
        _buildVehicleOption(
          id: 'motorcart',
          title: l10n.aggregatorRegVehicleMotorcart,
          subtitle: l10n.aggregatorRegVehicleMotorcartCap,
          icon: Icons.two_wheeler,
        ),
        const SizedBox(height: 8),
        _buildVehicleOption(
          id: 'pickup',
          title: l10n.aggregatorRegVehiclePickup,
          subtitle: l10n.aggregatorRegVehiclePickupCap,
          icon: Icons.local_shipping_outlined,
        ),
        const SizedBox(height: 8),
        _buildVehicleOption(
          id: 'truck',
          title: l10n.aggregatorRegVehicleTruck,
          subtitle: l10n.aggregatorRegVehicleTruckCap,
          icon: Icons.fire_truck_outlined,
        ),
      ],
    );
  }

  Widget _buildVehicleOption({
    required String id,
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    final isSelected = _selectedVehicle == id;
    return GestureDetector(
      onTap: () => setState(() => _selectedVehicle = id),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor.withValues(alpha: 0.1)
              : AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected
                ? AppTheme.primaryColor
                : Colors.white.withValues(alpha: 0.1),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppTheme.primaryColor.withValues(alpha: 0.2)
                    : Colors.white.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: isSelected ? AppTheme.primaryColor : Colors.white54,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: isSelected ? AppTheme.primaryColor : Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Colors.white54, fontSize: 12),
                  ),
                ],
              ),
            ),
            Icon(
              isSelected ? Icons.check_circle : Icons.radio_button_unchecked,
              color: isSelected ? AppTheme.primaryColor : Colors.white24,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSpecialtyChip(String label, IconData icon) {
    final isSelected = _selectedSpecialties.contains(label);
    return GestureDetector(
      onTap: () {
        setState(() {
          if (isSelected) {
            _selectedSpecialties.remove(label);
          } else {
            _selectedSpecialties.add(label);
          }
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor.withValues(alpha: 0.15)
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
              size: 16,
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? AppTheme.primaryColor : Colors.white70,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
