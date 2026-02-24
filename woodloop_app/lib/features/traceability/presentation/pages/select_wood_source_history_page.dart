import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class SelectWoodSourceHistoryPage extends StatelessWidget {
  const SelectWoodSourceHistoryPage({super.key});

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
          l10n.traceabilitySelectSourceTitle,
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
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Container(
                decoration: BoxDecoration(
                  color: AppTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.1),
                  ),
                ),
                child: TextField(
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: l10n.traceabilitySelectSourceSearchHint,
                    hintStyle: const TextStyle(color: Colors.white38),
                    prefixIcon: const Icon(Icons.search, color: Colors.white54),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ),

            // Transaction List
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _buildSourceItem(
                    context: context,
                    date: l10n.traceabilitySelectSourceMockDate1,
                    type: l10n.traceabilitySelectSourceMockType1,
                    volume: l10n.traceabilitySelectSourceMockVol1,
                    supplier: l10n.traceabilitySelectSourceMockSupplier1,
                    batchId: l10n.traceabilitySelectSourceMockBatch1,
                    isSelected: true,
                    l10n: l10n,
                  ),
                  const SizedBox(height: 12),
                  _buildSourceItem(
                    context: context,
                    date: l10n.traceabilitySelectSourceMockDate2,
                    type: l10n.traceabilitySelectSourceMockType2,
                    volume: l10n.traceabilitySelectSourceMockVol2,
                    supplier: l10n.traceabilitySelectSourceMockSupplier2,
                    batchId: l10n.traceabilitySelectSourceMockBatch2,
                    isSelected: false,
                    l10n: l10n,
                  ),
                  const SizedBox(height: 12),
                  _buildSourceItem(
                    context: context,
                    date: l10n.traceabilitySelectSourceMockDate3,
                    type: l10n.traceabilitySelectSourceMockType3,
                    volume: l10n.traceabilitySelectSourceMockVol3,
                    supplier: l10n.traceabilitySelectSourceMockSupplier3,
                    batchId: l10n.traceabilitySelectSourceMockBatch3,
                    isSelected: false,
                    l10n: l10n,
                  ),
                ],
              ),
            ),

            // Confirm Button
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
                    context.pop(); // typically pass data back
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  child: Text(
                    l10n.traceabilitySelectSourceBtnUse,
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

  Widget _buildSourceItem({
    required BuildContext context,
    required String date,
    required String type,
    required String volume,
    required String supplier,
    required String batchId,
    required bool isSelected,
    required AppLocalizations l10n,
  }) {
    return GestureDetector(
      onTap: () {
        // Toggle selection state logic
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
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceColor,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                        ),
                        child: Text(
                          date,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 10,
                          ),
                        ),
                      ),
                      Text(
                        volume,
                        style: const TextStyle(
                          color: AppTheme.primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    type,
                    style: TextStyle(
                      color: isSelected ? AppTheme.primaryColor : Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(
                        Icons.storefront,
                        color: Colors.white54,
                        size: 14,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        supplier,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    l10n.traceabilitySelectSourceIdFormat(batchId),
                    style: const TextStyle(color: Colors.white38, fontSize: 10),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 16),
            if (isSelected)
              const Icon(Icons.check_circle, color: AppTheme.primaryColor)
            else
              const Icon(Icons.radio_button_unchecked, color: Colors.white24),
          ],
        ),
      ),
    );
  }
}
