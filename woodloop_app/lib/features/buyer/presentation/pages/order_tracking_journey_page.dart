import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class OrderTrackingJourneyPage extends StatelessWidget {
  const OrderTrackingJourneyPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(), // Pop back to dashboard/home
        ),
        title: const Text(
          'Lacak Pengiriman',
          style: TextStyle(
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
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Kursi Palet Estetik (+1 lain)',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Jepara Eco Art',
                          style: TextStyle(color: Colors.white54, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Traceability Badge
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppTheme.primaryColor.withValues(alpha: 0.3),
                ),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.qr_code_scanner, color: AppTheme.primaryColor),
                      SizedBox(width: 12),
                      Text(
                        'Lacak Asal Usul Limbah Kayu',
                        style: TextStyle(
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
            const SizedBox(height: 32),

            // Delivery Status Timeline
            const Text(
              'Status Pengiriman',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            _buildTimelineStep(
              title: 'Pesanan Diterima',
              date: '12 Nov 2023, 10:00',
              description: 'Pembayaran terverifikasi.',
              isActive: true,
              isCompleted: true,
            ),
            _buildTimelineStep(
              title: 'Dikemas oleh Studio',
              date: '13 Nov 2023, 14:30',
              description: 'Menunggu penjemputan mitra logistik.',
              isActive: true,
              isCompleted: true,
            ),
            _buildTimelineStep(
              title: 'Dalam Perjalanan Menuju Anda',
              date: '14 Nov 2023, 08:15',
              description: 'Kurir menuju lokasi Anda (Resi: WX-998821).',
              isActive: true,
              isCompleted: false, // Arrived at this step
              isLast: false,
            ),
            _buildTimelineStep(
              title: 'Pesanan Selesai',
              date: '-',
              description: 'Barang telah diterima dengan baik.',
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
                child: const Text(
                  'Konfirmasi Pesanan Diterima',
                  style: TextStyle(
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
