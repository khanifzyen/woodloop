import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class ReportWoodWasteFormPage extends StatefulWidget {
  const ReportWoodWasteFormPage({super.key});

  @override
  State<ReportWoodWasteFormPage> createState() =>
      _ReportWoodWasteFormPageState();
}

class _ReportWoodWasteFormPageState extends State<ReportWoodWasteFormPage> {
  String? _selectedForm;
  String? _selectedCondition;
  String _selectedUnit = 'kg';

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    _selectedForm ??= l10n.generatorReportFormOffcut;
    _selectedCondition ??= l10n.generatorReportConditionDry;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l10n.generatorReportTitle,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        actions: [
          TextButton(
            onPressed: () => context.pop(),
            child: Text(
              l10n.generatorReportCancel,
              style: const TextStyle(
                color: Colors.white54,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ─── Step 1: Capture Waste ────────────────────────────
                  _buildSectionHeader(
                    l10n.generatorReportStep1,
                    l10n.generatorReportStep1Title,
                  ),
                  const SizedBox(height: 12),
                  GestureDetector(
                    onTap: () {
                      // Handle photo upload
                    },
                    child: Container(
                      height: 120,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.2),
                          style: BorderStyle.solid,
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.add_a_photo,
                            color: Colors.white54,
                            size: 32,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            l10n.generatorReportUploadPhoto,
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // ─── Step 2: Waste Information ────────────────────────
                  _buildSectionHeader(
                    l10n.generatorReportStep2,
                    l10n.generatorReportStep2Title,
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.08),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.generatorReportWasteForm,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        GridView.count(
                          crossAxisCount: 2,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                          childAspectRatio: 2.5,
                          children: [
                            _buildWasteFormOption(
                              l10n.generatorReportFormOffcut,
                              Icons.content_cut,
                            ),
                            _buildWasteFormOption(
                              l10n.generatorReportFormSawdust,
                              Icons.grain,
                            ),
                            _buildWasteFormOption(
                              l10n.generatorReportFormShaving,
                              Icons.carpenter,
                            ),
                            _buildWasteFormOption(
                              l10n.generatorReportFormLogEnd,
                              Icons.forest,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.08),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.generatorReportWoodCondition,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: _buildConditionOption(
                                l10n.generatorReportConditionDry,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: _buildConditionOption(
                                l10n.generatorReportConditionWet,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: _buildConditionOption(
                                l10n.generatorReportConditionMixed,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),

                  // ─── Step 3: Waste Details ────────────────────────────
                  _buildSectionHeader(
                    l10n.generatorReportStep3,
                    l10n.generatorReportStep3Title,
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.08),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              flex: 3,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    l10n.generatorReportQuantity,
                                    style: const TextStyle(
                                      color: Colors.white54,
                                      fontSize: 13,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Container(
                                    height: 52,
                                    decoration: BoxDecoration(
                                      color: AppTheme.background,
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: Colors.white.withValues(
                                          alpha: 0.08,
                                        ),
                                      ),
                                    ),
                                    child: const TextField(
                                      keyboardType: TextInputType.number,
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      decoration: InputDecoration(
                                        hintText: '0',
                                        hintStyle: TextStyle(
                                          color: Colors.white38,
                                          fontWeight: FontWeight.normal,
                                        ),
                                        border: InputBorder.none,
                                        contentPadding: EdgeInsets.symmetric(
                                          horizontal: 16,
                                          vertical: 14,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              flex: 2,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    l10n.generatorReportUnit,
                                    style: const TextStyle(
                                      color: Colors.white54,
                                      fontSize: 13,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Container(
                                    height: 52,
                                    padding: const EdgeInsets.all(4),
                                    decoration: BoxDecoration(
                                      color: AppTheme.background,
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: Colors.white.withValues(
                                          alpha: 0.08,
                                        ),
                                      ),
                                    ),
                                    child: Row(
                                      children: [
                                        Expanded(
                                          child: _buildUnitOption('kg', 'Kg'),
                                        ),
                                        Expanded(
                                          child: _buildUnitOption('m3', 'M³'),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            const Icon(
                              Icons.info_outline,
                              color: Colors.white38,
                              size: 14,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              l10n.generatorReportDensityHint,
                              style: const TextStyle(
                                color: Colors.white38,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),

                  // ─── Step 4: Pickup Location ──────────────────────────
                  _buildSectionHeader('4', 'Pickup Location'),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.only(right: 8),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.08),
                      ),
                    ),
                    child: Row(
                      children: [
                        const SizedBox(
                          width: 52,
                          height: 52,
                          child: Icon(
                            Icons.location_on,
                            color: AppTheme.primaryColor,
                          ),
                        ),
                        Container(
                          width: 1,
                          height: 36,
                          color: Colors.white.withValues(alpha: 0.08),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                l10n.generatorReportCurrentLocation,
                                style: const TextStyle(
                                  color: AppTheme.primaryColor,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                l10n.generatorReportMockLocation,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 13,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(
                            Icons.my_location,
                            color: Colors.white54,
                          ),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 48),
                ],
              ),
            ),
          ),

          // ─── Sticky Footer ──────────────────────────────────────────
          Container(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
            decoration: BoxDecoration(
              color: AppTheme.background,
              border: Border(
                top: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
              ),
            ),
            child: Column(
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Expanded(
                      flex: 2,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            l10n.generatorReportEstValue,
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            height: 44,
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceColor,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.08),
                              ),
                            ),
                            child: Row(
                              children: [
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                  ),
                                  child: Text(
                                    l10n.generatorReportCurrency,
                                    style: const TextStyle(
                                      color: Colors.white54,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                  ),
                                ),
                                const Expanded(
                                  child: TextField(
                                    keyboardType: TextInputType.number,
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    decoration: InputDecoration(
                                      hintText: '0',
                                      hintStyle: TextStyle(
                                        color: Colors.white38,
                                        fontWeight: FontWeight.normal,
                                      ),
                                      border: InputBorder.none,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      flex: 1,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            l10n.generatorReportPoints,
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            height: 44,
                            alignment: Alignment.centerRight,
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.loyalty,
                                  color: AppTheme.primaryColor,
                                  size: 16,
                                ),
                                SizedBox(width: 4),
                                Text(
                                  '+0',
                                  style: TextStyle(
                                    color: AppTheme.primaryColor,
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(l10n.generatorReportSuccessMsg)),
                      );
                      context.pop();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      foregroundColor: AppTheme.background,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          l10n.generatorReportSubmitBtn,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Icon(Icons.send, size: 20),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String number, String title) {
    return Row(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            color: AppTheme.primaryColor,
            shape: BoxShape.circle,
          ),
          alignment: Alignment.center,
          child: Text(
            number,
            style: const TextStyle(
              color: AppTheme.background,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(width: 10),
        Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildWasteFormOption(String label, IconData icon) {
    final isSelected = _selectedForm == label;
    return GestureDetector(
      onTap: () => setState(() => _selectedForm = label),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor.withValues(alpha: 0.1)
              : AppTheme.background,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected ? AppTheme.primaryColor : Colors.transparent,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? AppTheme.primaryColor : Colors.white54,
              size: 20,
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.white70,
                  fontSize: 13,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                ),
              ),
            ),
            if (isSelected)
              const Icon(
                Icons.check_circle,
                color: AppTheme.primaryColor,
                size: 20,
              )
            else
              const Icon(
                Icons.radio_button_unchecked,
                color: Colors.white24,
                size: 20,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildConditionOption(String condition) {
    final isSelected = _selectedCondition == condition;
    return GestureDetector(
      onTap: () => setState(() => _selectedCondition = condition),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor.withValues(alpha: 0.1)
              : AppTheme.background,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected ? AppTheme.primaryColor : Colors.transparent,
          ),
        ),
        alignment: Alignment.center,
        child: Text(
          condition,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.white70,
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _buildUnitOption(String val, String label) {
    final isSelected = _selectedUnit == val;
    return GestureDetector(
      onTap: () => setState(() => _selectedUnit = val),
      child: Container(
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primaryColor : Colors.transparent,
          borderRadius: BorderRadius.circular(6),
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? AppTheme.background : Colors.white54,
            fontSize: 13,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
