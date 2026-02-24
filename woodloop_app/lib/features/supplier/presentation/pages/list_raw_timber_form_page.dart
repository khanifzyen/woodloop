import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class ListRawTimberFormPage extends StatefulWidget {
  const ListRawTimberFormPage({super.key});

  @override
  State<ListRawTimberFormPage> createState() => _ListRawTimberFormPageState();
}

class _ListRawTimberFormPageState extends State<ListRawTimberFormPage> {
  final _formKey = GlobalKey<FormState>();
  String _selectedGrade = 'A';

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: TextButton(
          onPressed: () => context.pop(),
          child: Text(
            l10n.supplierListTimberCancel,
            style: const TextStyle(
              color: Colors.white54,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        leadingWidth: 80,
        title: Text(
          l10n.supplierListTimberTitle,
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
                padding: const EdgeInsets.all(20.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Photo Upload
                      GestureDetector(
                        onTap: () {
                          // TODO: Implement camera capture
                        },
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 40),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceColor.withValues(alpha: 0.5),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: AppTheme.primaryColor.withValues(
                                alpha: 0.3,
                              ),
                              width: 2,
                            ),
                          ),
                          child: Column(
                            children: [
                              Container(
                                height: 56,
                                width: 56,
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryColor.withValues(
                                    alpha: 0.1,
                                  ),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.add_a_photo_outlined,
                                  color: AppTheme.primaryColor,
                                  size: 28,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                l10n.supplierListTimberCaptureTitle,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                l10n.supplierListTimberCaptureSubtitle,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  color: Colors.white54,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Specifications Section
                      _buildSectionTitle(
                        l10n.supplierListTimberSpecsTitle,
                        Icons.forest,
                      ),
                      const SizedBox(height: 16),
                      _buildLabel(l10n.supplierListTimberSpecsSpecies),
                      DropdownButtonFormField<String>(
                        dropdownColor: AppTheme.surfaceColor,
                        style: const TextStyle(color: Colors.white),
                        decoration: _inputDecoration(),
                        icon: const Icon(
                          Icons.expand_more,
                          color: Colors.white54,
                        ),
                        hint: Text(
                          l10n.supplierListTimberSpecsSpeciesHint,
                          style: const TextStyle(color: Colors.white38),
                        ),
                        items: [
                          DropdownMenuItem(
                            value: 'jati',
                            child: Text(l10n.supplierListTimberSpeciesJati),
                          ),
                          DropdownMenuItem(
                            value: 'mahoni',
                            child: Text(l10n.supplierListTimberSpeciesMahoni),
                          ),
                          DropdownMenuItem(
                            value: 'merbau',
                            child: Text(l10n.supplierListTimberSpeciesMerbau),
                          ),
                          DropdownMenuItem(
                            value: 'sengon',
                            child: Text(l10n.supplierListTimberSpeciesSengon),
                          ),
                          DropdownMenuItem(
                            value: 'ulin',
                            child: Text(l10n.supplierListTimberSpeciesUlin),
                          ),
                        ],
                        onChanged: (value) {},
                      ),
                      const SizedBox(height: 16),
                      _buildLabel(l10n.supplierListTimberSpecsGrade),
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.05),
                          ),
                        ),
                        child: Row(
                          children: [
                            _buildGradeOption('A'),
                            _buildGradeOption('B'),
                            _buildGradeOption('C'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Dimensions Section
                      _buildSectionTitle(
                        l10n.supplierListTimberDimTitle,
                        Icons.straighten,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildLabel(l10n.supplierListTimberDimDiameter),
                                _buildNumberField(suffix: 'CM'),
                              ],
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildLabel(l10n.supplierListTimberDimLength),
                                _buildNumberField(suffix: 'M'),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: AppTheme.primaryColor.withValues(alpha: 0.2),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  l10n.supplierListTimberDimEstVolume,
                                  style: TextStyle(
                                    color: AppTheme.primaryColor.withValues(
                                      alpha: 0.8,
                                    ),
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    letterSpacing: 1,
                                  ),
                                ),
                                const Text(
                                  '0.00',
                                  style: TextStyle(
                                    color: AppTheme.primaryColor,
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              'm³',
                              style: TextStyle(
                                color: AppTheme.primaryColor.withValues(
                                  alpha: 0.8,
                                ),
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Financials Section
                      _buildSectionTitle(
                        l10n.supplierListTimberFinTitle,
                        Icons.payments,
                      ),
                      const SizedBox(height: 16),
                      _buildLabel(l10n.supplierListTimberFinPrice),
                      TextFormField(
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                        ),
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          hintText: '0',
                          hintStyle: const TextStyle(color: Colors.white38),
                          prefixIcon: const Padding(
                            padding: EdgeInsets.only(left: 16, right: 8),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Rp',
                                  style: TextStyle(
                                    color: Colors.white54,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          filled: true,
                          fillColor: AppTheme.surfaceColor,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color: Colors.white.withValues(alpha: 0.1),
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color: Colors.white.withValues(alpha: 0.1),
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(
                              color: AppTheme.primaryColor,
                            ),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(left: 8, top: 8),
                        child: Text(
                          l10n.supplierListTimberFinTotalApprox,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Compliance Section
                      _buildSectionTitle(
                        l10n.supplierListTimberCompTitle,
                        Icons.verified,
                      ),
                      const SizedBox(height: 16),
                      Container(
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                        ),
                        child: Column(
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        height: 40,
                                        width: 40,
                                        decoration: BoxDecoration(
                                          color: Colors.white.withValues(
                                            alpha: 0.05,
                                          ),
                                          borderRadius: BorderRadius.circular(
                                            20,
                                          ),
                                        ),
                                        child: const Icon(
                                          Icons.description_outlined,
                                          color: Colors.white54,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            l10n.supplierListTimberCompLegalCert,
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 14,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          Text(
                                            l10n.supplierListTimberCompSvlkorFsc,
                                            style: const TextStyle(
                                              color: Colors.white54,
                                              fontSize: 12,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: const BoxDecoration(
                                      color: Colors.yellow,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.05),
                                borderRadius: const BorderRadius.only(
                                  bottomLeft: Radius.circular(16),
                                  bottomRight: Radius.circular(16),
                                ),
                              ),
                              child: TextButton.icon(
                                onPressed: () {
                                  // TODO: Upload document
                                },
                                style: TextButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 12,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    side: BorderSide(
                                      color: Colors.white.withValues(
                                        alpha: 0.2,
                                      ),
                                    ),
                                  ),
                                ),
                                icon: const Icon(
                                  Icons.upload_file,
                                  color: Colors.white54,
                                ),
                                label: Text(
                                  l10n.supplierListTimberCompUpload,
                                  style: const TextStyle(color: Colors.white54),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Action
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: AppTheme.background,
                border: Border(
                  top: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
                ),
              ),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () {
                    // TODO: Submit form
                    context.pop();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 4,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        l10n.supplierListTimberPublishBtn,
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

  Widget _buildSectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: AppTheme.primaryColor, size: 16),
        const SizedBox(width: 8),
        Text(
          title.toUpperCase(),
          style: const TextStyle(
            color: AppTheme.primaryColor,
            fontSize: 12,
            fontWeight: FontWeight.bold,
            letterSpacing: 1,
          ),
        ),
      ],
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white70,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  InputDecoration _inputDecoration() {
    return InputDecoration(
      filled: true,
      fillColor: AppTheme.surfaceColor,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppTheme.primaryColor),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    );
  }

  Widget _buildGradeOption(String grade) {
    final isSelected = _selectedGrade == grade;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedGrade = grade;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.background : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.2),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : [],
          ),
          alignment: Alignment.center,
          child: Text(
            AppLocalizations.of(context)!.supplierListTimberGrade(grade),
            style: TextStyle(
              color: isSelected ? AppTheme.primaryColor : Colors.white54,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNumberField({required String suffix}) {
    return TextFormField(
      style: const TextStyle(color: Colors.white, fontFamily: 'monospace'),
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: _inputDecoration().copyWith(
        hintText: '0',
        hintStyle: const TextStyle(color: Colors.white38),
        suffixIcon: Padding(
          padding: const EdgeInsets.only(right: 12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                suffix,
                style: const TextStyle(
                  color: Colors.white54,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
