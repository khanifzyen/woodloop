import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class ImpactAnalyticsDashboardPage extends StatelessWidget {
  const ImpactAnalyticsDashboardPage({super.key});

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
          'Impact Analytics',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: () {}, // Download Report
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // Header Selector
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Region: Jepara',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.1),
                    ),
                  ),
                  child: const Row(
                    children: [
                      Text(
                        'Bulan Ini',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                      Icon(
                        Icons.arrow_drop_down,
                        color: Colors.white70,
                        size: 16,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Main KPI Cards
            Row(
              children: [
                Expanded(
                  child: _buildKpiCard(
                    title: 'Limbah Diselamatkan',
                    value: '1.240',
                    unit: 'Ton',
                    icon: Icons.recycling,
                    trend: '+12%',
                    isPositive: true,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildKpiCard(
                    title: 'Emisi Karbon Ditekan',
                    value: '850',
                    unit: 'kg CO2e',
                    icon: Icons.cloud_outlined,
                    trend: '+5%',
                    isPositive: true,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildKpiCard(
                    title: 'Nilai Ekonomi Mutiplier',
                    value: 'Rp 45M',
                    unit: '',
                    icon: Icons.account_balance_wallet_outlined,
                    trend: '+18%',
                    isPositive: true,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildKpiCard(
                    title: 'Partikel Aktif',
                    value: '3.402',
                    unit: 'User',
                    icon: Icons.groups_outlined,
                    trend: '+2%',
                    isPositive: true,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Chart Placeholder (Traceability Volume)
            const Text(
              'Volume Kayu Terdokumentasi (Traceability)',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Container(
              height: 200,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.bar_chart,
                    color: AppTheme.primaryColor,
                    size: 64,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Grafik Pertumbuhan Volume (Mock)',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.5),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Active Aggregators/Contributors List
            const Text(
              'Top Kontributor (Minggu Ini)',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildContributorRow(
              '1',
              'Budi Logistics (Aggregator)',
              '450 Kg Kayu Terselamatkan',
            ),
            _buildContributorRow(
              '2',
              'Jepara Eco Art (Converter)',
              '120 Kg Kayu Terselamatkan',
            ),
            _buildContributorRow(
              '3',
              'UD Sukses Makmur (Generator)',
              '90 Kg Kayu Terdokumentasi',
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiCard({
    required String title,
    required String value,
    required String unit,
    required IconData icon,
    required String trend,
    required bool isPositive,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: AppTheme.primaryColor, size: 20),
              ),
              Row(
                children: [
                  Icon(
                    isPositive ? Icons.arrow_upward : Icons.arrow_downward,
                    color: isPositive ? AppTheme.primaryColor : Colors.red,
                    size: 12,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    trend,
                    style: TextStyle(
                      color: isPositive ? AppTheme.primaryColor : Colors.red,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                value,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (unit.isNotEmpty) ...[
                const SizedBox(width: 4),
                Text(
                  unit,
                  style: const TextStyle(color: Colors.white54, fontSize: 12),
                ),
              ],
            ],
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: const TextStyle(color: Colors.white54, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildContributorRow(String rank, String name, String stat) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Container(
            width: 30,
            height: 30,
            decoration: BoxDecoration(
              color: AppTheme.surfaceColor,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
            ),
            child: Center(
              child: Text(
                rank,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  stat,
                  style: const TextStyle(
                    color: AppTheme.primaryColor,
                    fontSize: 12,
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
