import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class GeneratorRegistrationPage extends StatefulWidget {
  const GeneratorRegistrationPage({super.key});

  @override
  State<GeneratorRegistrationPage> createState() =>
      _GeneratorRegistrationPageState();
}

class _GeneratorRegistrationPageState extends State<GeneratorRegistrationPage> {
  final _formKey = GlobalKey<FormState>();
  final List<String> _selectedWasteTypes = [];

  void _toggleWasteType(String type) {
    setState(() {
      if (_selectedWasteTypes.contains(type)) {
        _selectedWasteTypes.remove(type);
      } else {
        _selectedWasteTypes.add(type);
      }
    });
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
          l10n.generatorRegStep,
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
                        l10n.generatorRegTitle,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        l10n.generatorRegSubtitle,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Business/Workshop Name
                      _buildLabel(l10n.generatorRegWorkshopName),
                      _buildTextField(
                        hintText: l10n.generatorRegWorkshopHint,
                        icon: Icons.handyman_outlined,
                      ),
                      const SizedBox(height: 20),

                      // Owner Name
                      _buildLabel(l10n.generatorRegOwnerName),
                      _buildTextField(
                        hintText: l10n.generatorRegOwnerHint,
                        icon: Icons.person_outline,
                      ),
                      const SizedBox(height: 20),

                      // Phone Number
                      _buildLabel(l10n.generatorRegPhone),
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
                      ),
                      const SizedBox(height: 32),

                      // Location
                      _buildLabel(l10n.generatorRegLocation),
                      GestureDetector(
                        onTap: () {
                          // TODO: Implement map selection
                        },
                        child: Container(
                          height: 140,
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
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            l10n.generatorRegSetMap,
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 14,
                                              fontWeight: FontWeight.w600,
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          Text(
                                            l10n.generatorRegMapSub,
                                            style: const TextStyle(
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
                      const SizedBox(height: 32),

                      // Waste Output Focus
                      Text(
                        l10n.generatorRegWasteFocus,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        l10n.generatorRegWasteSub,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 8,
                        runSpacing: 12,
                        children: [
                          _buildWasteChip(l10n.generatorRegWasteSawdust),
                          _buildWasteChip(l10n.generatorRegWasteOffcuts),
                          _buildWasteChip(l10n.generatorRegWasteChips),
                          _buildWasteChip(l10n.generatorRegWastePallets),
                          _buildWasteChip(l10n.generatorRegWasteBark),
                        ],
                      ),
                      const SizedBox(height: 32),

                      // Output volume
                      _buildLabel(l10n.generatorRegVolLabel),
                      _buildTextField(
                        hintText: l10n.generatorRegVolHint,
                        keyboardType: TextInputType.number,
                        iconWidget: const Padding(
                          padding: EdgeInsets.only(left: 16, right: 8),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'KG',
                                style: TextStyle(
                                  color: Colors.white54,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
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
                    context.go('/generator-dashboard');
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
                        l10n.generatorRegCompleteBtn,
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

  Widget _buildWasteChip(String label) {
    final isSelected = _selectedWasteTypes.contains(label);
    return GestureDetector(
      onTap: () => _toggleWasteType(label),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
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
            if (isSelected) ...[
              const Icon(Icons.check, color: AppTheme.primaryColor, size: 16),
              const SizedBox(width: 6),
            ],
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
