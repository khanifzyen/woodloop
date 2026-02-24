import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class GeneratorOrderManagementPage extends StatelessWidget {
  const GeneratorOrderManagementPage({super.key});

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
          l10n.generatorOrderMgmtTitle,
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
            // Tabs
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.1),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          l10n.generatorOrderMgmtTabActive,
                          style: const TextStyle(
                            color: AppTheme.primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        alignment: Alignment.center,
                        child: Text(
                          l10n.generatorOrderMgmtTabCompleted,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Order List
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  _buildOrderCard(
                    context,
                    l10n: l10n,
                    statusText: l10n.generatorOrderMgmtStatusWaiting,
                    statusColor: Colors.orange,
                    targetDate: '10 Nov 2023',
                    title: 'Serbuk Kayu Jati',
                    quantity: '50 Kg',
                    price: 'Rp 25.000',
                    pickupCode: 'PKP-8921-A',
                    driverName: 'Aggregator: Budi Logistics',
                    isActionable: true,
                  ),
                  _buildOrderCard(
                    context,
                    l10n: l10n,
                    statusText: l10n.generatorOrderMgmtStatusEnRoute,
                    statusColor: Colors.blue,
                    targetDate: '09 Nov 2023',
                    title: 'Potongan Mahoni',
                    quantity: '120 Kg',
                    price: 'Rp 100.000',
                    pickupCode: 'PKP-8920-B',
                    driverName: 'Aggregator: AntarCepat',
                    isActionable: false,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderCard(
    BuildContext context, {
    required AppLocalizations l10n,
    required String statusText,
    required Color statusColor,
    required String targetDate,
    required String title,
    required String quantity,
    required String price,
    required String pickupCode,
    required String driverName,
    required bool isActionable,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Column(
        children: [
          // Header Status
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.1),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: statusColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      statusText,
                      style: TextStyle(
                        color: statusColor,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                Text(
                  targetDate,
                  style: TextStyle(
                    color: statusColor.withValues(alpha: 0.8),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),

          // Body
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '$quantity • $price',
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.background,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.1),
                        ),
                      ),
                      child: Text(
                        pickupCode,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontFamily: 'monospace',
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Driver/Aggregator Info
                Row(
                  children: [
                    const Icon(
                      Icons.local_shipping_outlined,
                      color: Colors.white38,
                      size: 16,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      driverName,
                      style: const TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),

                if (isActionable) ...[
                  const SizedBox(height: 16),
                  const Divider(color: Colors.white10),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () {
                        // TODO: Scan Aggregator QR code to confirm pickup
                      },
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppTheme.primaryColor),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.qr_code_scanner,
                            color: AppTheme.primaryColor,
                            size: 18,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            l10n.generatorOrderMgmtScanQRBtn,
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
              ],
            ),
          ),
        ],
      ),
    );
  }
}
