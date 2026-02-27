import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../bloc/auth_bloc.dart';

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

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _companyController.dispose();
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
          'Daftar sebagai ${_getRoleDisplayName(l10n)}',
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
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.redAccent,
              ),
            );
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
                        const Text(
                          'Buat Akun Baru',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Bergabung dengan jaringan ekonomi sirkular kayu Jepara.',
                          style: TextStyle(color: Colors.white54, fontSize: 14),
                        ),
                        const SizedBox(height: 32),

                        // ── Common Fields (All Roles) ──
                        _buildLabel('NAMA LENGKAP'),
                        _buildTextField(
                          hintText: 'John Doe',
                          icon: Icons.person_outline,
                          controller: _nameController,
                          validator: (v) => v == null || v.isEmpty
                              ? 'Nama wajib diisi'
                              : null,
                        ),
                        const SizedBox(height: 20),

                        _buildLabel('EMAIL'),
                        _buildTextField(
                          hintText: 'email@domain.com',
                          icon: Icons.email_outlined,
                          keyboardType: TextInputType.emailAddress,
                          controller: _emailController,
                          validator: (v) {
                            if (v == null || v.isEmpty)
                              return 'Email wajib diisi';
                            if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(v))
                              return 'Format email tidak valid';
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),

                        _buildLabel('NOMOR TELEPON'),
                        _buildTextField(
                          hintText: '812 3456 7890',
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

                        _buildLabel('PASSWORD'),
                        _buildTextField(
                          hintText: 'Minimal 8 karakter',
                          icon: Icons.lock_outline,
                          obscureText: true,
                          controller: _passwordController,
                          validator: (v) {
                            if (v == null || v.isEmpty)
                              return 'Password wajib diisi';
                            if (v.length < 8)
                              return 'Password minimal 8 karakter';
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),

                        // ── Supplier-Specific Fields ──
                        if (widget.role == 'supplier') ...[
                          _buildLabel('NAMA PERUSAHAAN'),
                          _buildTextField(
                            hintText: 'Jepara Teak Mill',
                            icon: Icons.factory_outlined,
                          ),
                          const SizedBox(height: 20),
                          _buildAddressMap(),
                          const SizedBox(height: 20),
                          _buildCertUpload(),
                          const SizedBox(height: 24),
                        ],

                        // ── Generator-Specific Fields ──
                        if (widget.role == 'generator') ...[
                          _buildLabel('NAMA WORKSHOP'),
                          _buildTextField(
                            hintText: 'Jepara Artisans',
                            icon: Icons.home_work_outlined,
                          ),
                          const SizedBox(height: 20),
                          _buildAddressMap(),
                          const SizedBox(height: 20),
                          _buildLabel('JENIS LIMBAH YANG DIHASILKAN'),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              _buildSelectableChip('Serbuk Kayu', 'sawdust'),
                              _buildSelectableChip('Potongan', 'offcuts'),
                              _buildSelectableChip('Wood Chips', 'chips'),
                              _buildSelectableChip('Pallet', 'pallets'),
                              _buildSelectableChip('Kulit Kayu', 'bark'),
                            ],
                          ),
                          const SizedBox(height: 20),
                          _buildLabel('EST. VOLUME BULANAN (KG)'),
                          _buildTextField(
                            hintText: 'contoh: 500',
                            icon: Icons.scale_outlined,
                            keyboardType: TextInputType.number,
                          ),
                          const SizedBox(height: 24),
                        ],

                        // ── Aggregator-Specific Fields ──
                        if (widget.role == 'aggregator') ...[
                          _buildLabel('NO. KTP (NIK)'),
                          _buildTextField(
                            hintText: '3320...',
                            icon: Icons.badge_outlined,
                            keyboardType: TextInputType.number,
                          ),
                          const SizedBox(height: 20),
                          _buildLabel('JENIS KENDARAAN'),
                          const SizedBox(height: 8),
                          _buildVehicleSelector(),
                          const SizedBox(height: 20),
                          _buildLabel('PLAT NOMOR KENDARAAN'),
                          _buildTextField(
                            hintText: 'K 1234 XY',
                            icon: Icons.directions_car_outlined,
                          ),
                          const SizedBox(height: 20),
                          _buildLabel('KAPASITAS GUDANG (KG)'),
                          _buildTextField(
                            hintText: 'contoh: 2000',
                            icon: Icons.warehouse_outlined,
                            keyboardType: TextInputType.number,
                          ),
                          const SizedBox(height: 24),
                        ],

                        // ── Converter-Specific Fields ──
                        if (widget.role == 'converter') ...[
                          _buildLabel('NAMA STUDIO / BISNIS'),
                          _buildTextField(
                            hintText: 'Jepara Eco Art',
                            icon: Icons.store_outlined,
                          ),
                          const SizedBox(height: 20),
                          _buildLabel('SPESIALISASI'),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              _buildSpecialtyChip(
                                'Eco-Furniture',
                                Icons.chair_outlined,
                              ),
                              _buildSpecialtyChip(
                                'Handicraft',
                                Icons.handyman_outlined,
                              ),
                              _buildSpecialtyChip(
                                'Briket Kayu',
                                Icons.local_fire_department,
                              ),
                              _buildSpecialtyChip(
                                'Kompos',
                                Icons.compost_outlined,
                              ),
                              _buildSpecialtyChip('Lainnya', Icons.more_horiz),
                            ],
                          ),
                          const SizedBox(height: 20),
                          _buildAddressMap(),
                          const SizedBox(height: 20),
                          _buildLabel('KEBUTUHAN BAHAN BAKU (KG/BULAN)'),
                          _buildTextField(
                            hintText: 'contoh: 1000',
                            icon: Icons.scale_outlined,
                            keyboardType: TextInputType.number,
                          ),
                          const SizedBox(height: 24),
                        ],

                        // ── Buyer-Specific Fields ──
                        if (widget.role == 'buyer') ...[
                          _buildLabel('ALAMAT PENGIRIMAN'),
                          _buildTextField(
                            hintText: 'Alamat rumah atau kantor',
                            icon: Icons.home_outlined,
                            maxLines: 3,
                          ),
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
                                const TextSpan(
                                  text: 'Dengan mendaftar, Anda menyetujui ',
                                ),
                                TextSpan(
                                  text: 'Syarat & Ketentuan',
                                  style: const TextStyle(
                                    color: AppTheme.primaryColor,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                                const TextSpan(text: '\ndan '),
                                TextSpan(
                                  text: 'Kebijakan Privasi',
                                  style: const TextStyle(
                                    color: AppTheme.primaryColor,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                                const TextSpan(text: '.'),
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
                                      context.read<AuthBloc>().add(
                                        AuthRegisterRequested({
                                          'name': _nameController.text.trim(),
                                          'email': _emailController.text.trim(),
                                          'phone': _phoneController.text.trim(),
                                          'password': _passwordController.text,
                                          'passwordConfirm':
                                              _passwordController.text,
                                          'role': widget.role,
                                          'company_name': _companyController
                                              .text
                                              .trim(),
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
                                      const Text(
                                        'Daftar Sekarang',
                                        style: TextStyle(
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
                        text: const TextSpan(
                          style: TextStyle(color: Colors.white54, fontSize: 14),
                          children: [
                            TextSpan(text: 'Sudah punya akun? '),
                            TextSpan(
                              text: 'Login',
                              style: TextStyle(
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

  Widget _buildAddressMap() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel('ALAMAT BISNIS'),
        GestureDetector(
          onTap: () {},
          child: Container(
            height: 140,
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppTheme.surfaceColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
              image: const DecorationImage(
                image: AssetImage('assets/images/map_jepara.jpg'),
                fit: BoxFit.cover,
                opacity: 0.6,
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
                        Colors.black.withValues(alpha: 0.8),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
                Positioned(
                  bottom: 12,
                  left: 16,
                  right: 16,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Jl. Raya Jepara-Kudus No. 45',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              'Jepara, Central Java',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(
                          Icons.pin_drop,
                          color: AppTheme.background,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(top: 8, left: 4),
          child: const Text(
            'Ketuk peta untuk menandai lokasi Anda.',
            style: TextStyle(color: Colors.white38, fontSize: 12),
          ),
        ),
      ],
    );
  }

  Widget _buildCertUpload() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildLabel('SERTIFIKASI LEGAL'),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppTheme.primaryColor.withValues(alpha: 0.2),
                ),
              ),
              child: const Text(
                'Required',
                style: TextStyle(
                  color: AppTheme.primaryColor,
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: () {},
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 32),
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
                  height: 48,
                  width: 48,
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.upload_file,
                    color: AppTheme.primaryColor,
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Upload SVLK atau FSC',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'PDF, JPG atau PNG (Max 5MB)',
                  style: TextStyle(color: Colors.white54, fontSize: 12),
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

  Widget _buildVehicleSelector() {
    return Column(
      children: [
        _buildVehicleOption(
          id: 'motorcart',
          title: 'Motor Gerobak',
          subtitle: '< 100 kg',
          icon: Icons.two_wheeler,
        ),
        const SizedBox(height: 8),
        _buildVehicleOption(
          id: 'pickup',
          title: 'Pick-up Truck',
          subtitle: '100 - 800 kg',
          icon: Icons.local_shipping_outlined,
        ),
        const SizedBox(height: 8),
        _buildVehicleOption(
          id: 'truck',
          title: 'Light Truck',
          subtitle: '> 800 kg',
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
