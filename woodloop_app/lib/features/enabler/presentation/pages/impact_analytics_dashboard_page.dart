import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class ImpactAnalyticsDashboardPage extends StatelessWidget {
  const ImpactAnalyticsDashboardPage({super.key});

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
          l10n.enablerAnalyticsTitle,
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
                Text(
                  l10n.enablerAnalyticsRegion,
                  style: const TextStyle(
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
                  child: Row(
                    children: [
                      Text(
                        l10n.enablerAnalyticsFilterMonth,
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                      const Icon(
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
                    title: l10n.enablerAnalyticsKpiWaste,
                    value: l10n.enablerAnalyticsKpiWasteMockValue,
                    unit: l10n.enablerAnalyticsKpiWasteMockUnit,
                    icon: Icons.recycling,
                    trend: l10n.enablerAnalyticsKpiWasteMockTrend,
                    isPositive: true,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildKpiCard(
                    title: l10n.enablerAnalyticsKpiCarbon,
                    value: l10n.enablerAnalyticsKpiCarbonMockValue,
                    unit: l10n.enablerAnalyticsKpiCarbonMockUnit,
                    icon: Icons.cloud_outlined,
                    trend: l10n.enablerAnalyticsKpiCarbonMockTrend,
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
                    title: l10n.enablerAnalyticsKpiEconomy,
                    value: l10n.enablerAnalyticsKpiEconomyMockValue,
                    unit: '',
                    icon: Icons.account_balance_wallet_outlined,
                    trend: l10n.enablerAnalyticsKpiEconomyMockTrend,
                    isPositive: true,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildKpiCard(
                    title: l10n.enablerAnalyticsKpiActiveUsers,
                    value: l10n.enablerAnalyticsKpiActiveUsersMockValue,
                    unit: l10n.enablerAnalyticsKpiActiveUsersMockUnit,
                    icon: Icons.groups_outlined,
                    trend: l10n.enablerAnalyticsKpiActiveUsersMockTrend,
                    isPositive: true,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Chart Placeholder (Traceability Volume)
            Text(
              l10n.enablerAnalyticsChartTitle,
              style: const TextStyle(
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
                    l10n.enablerAnalyticsChartMockLegend,
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.5),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Active Aggregators/Contributors List
            Text(
              l10n.enablerAnalyticsTopContributors,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildContributorRow(
              '1',
              l10n.enablerAnalyticsTopMockName1,
              l10n.enablerAnalyticsTopMockStat1,
            ),
            _buildContributorRow(
              '2',
              l10n.enablerAnalyticsTopMockName2,
              l10n.enablerAnalyticsTopMockStat2,
            ),
            _buildContributorRow(
              '3',
              l10n.enablerAnalyticsTopMockName3,
              l10n.enablerAnalyticsTopMockStat3,
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
