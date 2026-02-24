import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class ConfirmPickupCollectionPage extends StatelessWidget {
  const ConfirmPickupCollectionPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l10n.aggregatorPickupTitle,
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
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // QR Scanner Placeholder
                    Container(
                      height: 240,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: AppTheme.primaryColor.withValues(alpha: 0.3),
                          width: 2,
                        ),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Icon(
                            Icons.qr_code_scanner,
                            size: 100,
                            color: AppTheme.primaryColor.withValues(alpha: 0.2),
                          ),
                          Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryColor.withValues(
                                    alpha: 0.1,
                                  ),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.camera_alt_outlined,
                                  color: AppTheme.primaryColor,
                                  size: 32,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                l10n.aggregatorPickupCameraHint,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Detail Information
                    Text(
                      l10n.aggregatorPickupDetailInfo,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildDetailRow(
                      l10n.aggregatorPickupTicketCode,
                      l10n.aggregatorPickupMockTicket,
                      isHighlight: true,
                    ),
                    const Divider(color: Colors.white10, height: 24),
                    _buildDetailRow(
                      l10n.aggregatorPickupGenerator,
                      l10n.aggregatorPickupMockGenName,
                    ),
                    const Divider(color: Colors.white10, height: 24),
                    _buildDetailRow(
                      l10n.aggregatorPickupMaterial,
                      l10n.aggregatorPickupMockMaterial,
                    ),
                    const Divider(color: Colors.white10, height: 24),
                    _buildDetailRow(
                      l10n.aggregatorPickupEstWeight,
                      l10n.aggregatorPickupMockWeight,
                    ),
                    const Divider(color: Colors.white10, height: 24),

                    // Final Profit info
                    Container(
                      margin: const EdgeInsets.only(top: 16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: AppTheme.primaryColor.withValues(alpha: 0.2),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            l10n.aggregatorPickupEstPayment,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            l10n.aggregatorPickupMockPayment,
                            style: const TextStyle(
                              color: AppTheme.primaryColor,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Manual overrides
                    Center(
                      child: TextButton.icon(
                        icon: const Icon(
                          Icons.edit_note,
                          color: Colors.white54,
                          size: 18,
                        ),
                        label: Text(
                          l10n.aggregatorPickupManualInput,
                          style: const TextStyle(
                            color: Colors.white54,
                            decoration: TextDecoration.underline,
                          ),
                        ),
                        onPressed: () {
                          // TODO: Input manual logic
                        },
                      ),
                    ),
                  ],
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
                        l10n.aggregatorPickupConfirmBtn,
                        style: const TextStyle(
                          color: AppTheme.background,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(
                        Icons.check_circle,
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

  Widget _buildDetailRow(
    String label,
    String value, {
    bool isHighlight = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white54, fontSize: 14),
        ),
        Text(
          value,
          style: TextStyle(
            color: isHighlight ? AppTheme.primaryColor : Colors.white,
            fontSize: 14,
            fontWeight: isHighlight ? FontWeight.bold : FontWeight.w600,
            fontFamily: isHighlight ? 'monospace' : null,
          ),
        ),
      ],
    );
  }
}
