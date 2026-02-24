import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class OrderTrackingJourneyPage extends StatelessWidget {
  const OrderTrackingJourneyPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(), // Pop back to dashboard/home
        ),
        title: Text(
          l10n.buyerOrderTrackTitle,
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
        child: ListView(
          padding: const EdgeInsets.all(24.0),
          children: [
            // Order Info Header
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      image: const DecorationImage(
                        image: AssetImage(
                          'assets/images/map_jepara.jpg',
                        ), // Placeholder
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.buyerOrderTrackMockProduct,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          l10n.buyerOrderTrackMockStore,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Traceability Badge
            GestureDetector(
              onTap: () => context.pushNamed('product_story_traceability'),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: AppTheme.primaryColor.withValues(alpha: 0.3),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.qr_code_scanner,
                          color: AppTheme.primaryColor,
                        ),
                        SizedBox(width: 12),
                        Text(
                          l10n.buyerOrderTrackOrigin,
                          style: const TextStyle(
                            color: AppTheme.primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    Icon(
                      Icons.arrow_forward_ios,
                      color: AppTheme.primaryColor,
                      size: 16,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Delivery Status Timeline
            Text(
              l10n.buyerOrderTrackStatusHeader,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            _buildTimelineStep(
              title: l10n.buyerOrderTrackStep1Title,
              date: '12 Nov 2023, 10:00',
              description: l10n.buyerOrderTrackStep1Desc,
              isActive: true,
              isCompleted: true,
            ),
            _buildTimelineStep(
              title: l10n.buyerOrderTrackStep2Title,
              date: '13 Nov 2023, 14:30',
              description: l10n.buyerOrderTrackStep2Desc,
              isActive: true,
              isCompleted: true,
            ),
            _buildTimelineStep(
              title: l10n.buyerOrderTrackStep3Title,
              date: '14 Nov 2023, 08:15',
              description: l10n.buyerOrderTrackStep3Desc,
              isActive: true,
              isCompleted: false, // Arrived at this step
              isLast: false,
            ),
            _buildTimelineStep(
              title: l10n.buyerOrderTrackStep4Title,
              date: '-',
              description: l10n.buyerOrderTrackStep4Desc,
              isActive: false,
              isCompleted: false,
              isLast: true,
            ),
            const SizedBox(height: 48),

            // Arrived Action (Mock)
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: () {
                  // Confirm reception action
                  context.go('/buyer-dashboard');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
                child: Text(
                  l10n.buyerOrderTrackBtnConfirm,
                  style: const TextStyle(
                    color: AppTheme.background,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimelineStep({
    required String title,
    required String date,
    required String description,
    required bool isActive,
    required bool isCompleted,
    bool isLast = false,
  }) {
    Color nodeColor = isCompleted
        ? AppTheme.primaryColor
        : (isActive ? AppTheme.primaryColor : Colors.white24);

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline Node & Line
          Column(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: isActive && !isCompleted
                      ? AppTheme.primaryColor.withValues(alpha: 0.2)
                      : Colors.transparent,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: nodeColor,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: isCompleted ? AppTheme.primaryColor : Colors.white24,
                    margin: const EdgeInsets.symmetric(vertical: 4),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 16),
          // Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 32.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: TextStyle(
                            color: isActive ? Colors.white : Colors.white54,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Text(
                        date,
                        style: TextStyle(
                          color: isActive
                              ? AppTheme.primaryColor
                              : Colors.white24,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    description,
                    style: const TextStyle(color: Colors.white54, height: 1.5),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
