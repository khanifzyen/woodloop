import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class AggregatorRegistrationPage extends StatefulWidget {
  const AggregatorRegistrationPage({super.key});

  @override
  State<AggregatorRegistrationPage> createState() =>
      _AggregatorRegistrationPageState();
}

class _AggregatorRegistrationPageState
    extends State<AggregatorRegistrationPage> {
  final _formKey = GlobalKey<FormState>();
  String _selectedVehicle = 'pickup';

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
          l10n.aggregatorRegStepInfo,
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
                      Text(
                        l10n.aggregatorRegTitle,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        l10n.aggregatorRegSubtitle,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Personal Name
                      _buildLabel(l10n.aggregatorRegFullName),
                      _buildTextField(
                        hintText: l10n.aggregatorRegFullNameHint,
                        icon: Icons.person_outline,
                      ),
                      const SizedBox(height: 20),

                      // NIK / KTP
                      _buildLabel(l10n.aggregatorRegIdCard),
                      _buildTextField(
                        hintText: l10n.aggregatorRegIdCardHint,
                        icon: Icons.badge_outlined,
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 20),

                      // Phone Number
                      _buildLabel(l10n.aggregatorRegPhone),
                      _buildTextField(
                        hintText: l10n.aggregatorRegPhoneHint,
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
                      ),
                      const SizedBox(height: 32),

                      // Vehicle Type Selection
                      Text(
                        l10n.aggregatorRegVehicleType,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        l10n.aggregatorRegVehicleTypeHint,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: _buildVehicleOption(
                              id: 'motor',
                              title: l10n.aggregatorRegVehicleMotorcart,
                              subtitle: l10n.aggregatorRegVehicleMotorcartCap,
                              icon: Icons.motorcycle,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _buildVehicleOption(
                              id: 'pickup',
                              title: l10n.aggregatorRegVehiclePickup,
                              subtitle: l10n.aggregatorRegVehiclePickupCap,
                              icon: Icons.local_shipping,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: _buildVehicleOption(
                              id: 'truk',
                              title: l10n.aggregatorRegVehicleTruck,
                              subtitle: l10n.aggregatorRegVehicleTruckCap,
                              icon: Icons.fire_truck,
                            ),
                          ),
                          const SizedBox(width: 16),
                          const Expanded(
                            child: SizedBox(),
                          ), // Empty placeholder
                        ],
                      ),
                      const SizedBox(height: 32),

                      // License Plate
                      _buildLabel(l10n.aggregatorRegLicensePlate),
                      _buildTextField(
                        hintText: l10n.aggregatorRegLicensePlateHint,
                        icon: Icons.directions_car_outlined,
                      ),
                      const SizedBox(height: 32),
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
                    context.go('/aggregator-dashboard');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 4,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        l10n.aggregatorRegSubmitBtn,
                        style: const TextStyle(
                          color: AppTheme.background,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
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
            ),
          ],
        ),
      ),
    );
  }

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
  }) {
    return TextFormField(
      style: const TextStyle(color: Colors.white),
      keyboardType: keyboardType,
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

  Widget _buildVehicleOption({
    required String id,
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    final isSelected = _selectedVehicle == id;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedVehicle = id;
        });
      },
      child: Container(
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  icon,
                  color: isSelected ? AppTheme.primaryColor : Colors.white70,
                  size: 28,
                ),
                if (isSelected)
                  const Icon(
                    Icons.check_circle,
                    color: AppTheme.primaryColor,
                    size: 20,
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.white70,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            Text(
              subtitle,
              style: TextStyle(
                color: isSelected ? Colors.white70 : Colors.white38,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
