import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class WoodLoopDigitalWalletPage extends StatelessWidget {
  const WoodLoopDigitalWalletPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Dompet WoodLoop',
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
        child: Column(
          children: [
            // Balance Card
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppTheme.primaryColor, Color(0xFF0F9B3D)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Total Saldo Aktif',
                          style: TextStyle(
                            color: AppTheme.background,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Icon(
                          Icons.visibility_off_outlined,
                          color: AppTheme.background,
                          size: 20,
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Rp 4.250.000',
                      style: TextStyle(
                        color: AppTheme.background,
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildActionIcon(Icons.add, 'Top Up'),
                        _buildActionIcon(Icons.arrow_upward, 'Transfer'),
                        _buildActionIcon(Icons.account_balance, 'Tarik Dana'),
                        _buildActionIcon(Icons.history, 'Riwayat'),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Tabs and Transaction History
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppTheme.surfaceColor,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(32),
                    topRight: Radius.circular(32),
                  ),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.05),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Padding(
                      padding: EdgeInsets.all(24.0),
                      child: Text(
                        'Riwayat Transaksi Terakhir',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Expanded(
                      child: ListView(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        children: [
                          _buildTransactionRow(
                            title: 'Penjualan Serbuk Jati',
                            date: '10 Nov 2023, 14:30',
                            amount: '+ Rp 45.000',
                            isIncome: true,
                          ),
                          _buildTransactionRow(
                            title: 'Penarikan Dana ke BCA',
                            date: '08 Nov 2023, 09:15',
                            amount: '- Rp 1.500.000',
                            isIncome: false,
                          ),
                          _buildTransactionRow(
                            title: 'Penjualan Potongan Kayu',
                            date: '02 Nov 2023, 11:20',
                            amount: '+ Rp 120.000',
                            isIncome: true,
                          ),
                          _buildTransactionRow(
                            title: 'Biaya Layanan Aggregator',
                            date: '02 Nov 2023, 11:20',
                            amount: '- Rp 12.000',
                            isIncome: false,
                          ),
                          const SizedBox(height: 32),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionIcon(IconData icon, String label) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppTheme.background.withValues(alpha: 0.2),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: AppTheme.background, size: 24),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            color: AppTheme.background,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildTransactionRow({
    required String title,
    required String date,
    required String amount,
    required bool isIncome,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.background,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
            ),
            child: Icon(
              isIncome ? Icons.south_west : Icons.north_east,
              color: isIncome ? AppTheme.primaryColor : Colors.redAccent,
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  date,
                  style: const TextStyle(color: Colors.white54, fontSize: 12),
                ),
              ],
            ),
          ),
          Text(
            amount,
            style: TextStyle(
              color: isIncome ? AppTheme.primaryColor : Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}
