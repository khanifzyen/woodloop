import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class NotificationCenterPage extends StatelessWidget {
  const NotificationCenterPage({super.key});

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
          l10n.notificationTitle,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: () {},
            child: Text(
              l10n.notificationMarkRead,
              style: const TextStyle(color: AppTheme.primaryColor),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          children: [
            Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Text(
                l10n.notificationNew,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            _buildNotificationItem(
              title: 'Pesanan Diterima!',
              message:
                  'Pesanan Kursi Palet Estetik Anda telah tiba di tujuan. Konfirmasi penerimaan?',
              time: '12m yang lalu',
              icon: Icons.local_shipping_outlined,
              color: Colors.orange,
              isUnread: true,
            ),
            _buildNotificationItem(
              title: 'Saldo Masuk: Rp 45.000',
              message:
                  'Pembayaran dari penjualan Serbuk Kayu (50kg) telah masuk ke dompet Anda.',
              time: '1j yang lalu',
              icon: Icons.account_balance_wallet_outlined,
              color: AppTheme.primaryColor,
              isUnread: true,
            ),

            Padding(
              padding: const EdgeInsets.only(top: 24.0, bottom: 16.0),
              child: Text(
                l10n.notificationEarlier,
                style: const TextStyle(
                  color: Colors.white54,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            _buildNotificationItem(
              title: 'Tawaran Harga Baru',
              message:
                  'Jepara Eco Art menawarkan harga Rp 30.000 untuk limbah palet Anda.',
              time: 'Kemarin',
              icon: Icons.local_offer_outlined,
              color: Colors.blue,
              isUnread: false,
            ),
            _buildNotificationItem(
              title: 'Materi Baru di Design Clinic',
              message:
                  'Inspirasi desain rak buku dari sisa ranting kini tersedia.',
              time: '3 hari yang lalu',
              icon: Icons.lightbulb_outline,
              color: Colors.amber,
              isUnread: false,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationItem({
    required String title,
    required String message,
    required String time,
    required IconData icon,
    required Color color,
    required bool isUnread,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isUnread ? color.withValues(alpha: 0.1) : AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isUnread
              ? color.withValues(alpha: 0.3)
              : Colors.white.withValues(alpha: 0.05),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
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
                          color: Colors.white,
                          fontWeight: isUnread
                              ? FontWeight.bold
                              : FontWeight.w600,
                          fontSize: 14,
                        ),
                      ),
                    ),
                    Text(
                      time,
                      style: TextStyle(
                        color: isUnread
                            ? AppTheme.primaryColor
                            : Colors.white38,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  message,
                  style: const TextStyle(
                    color: Colors.white54,
                    fontSize: 12,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
