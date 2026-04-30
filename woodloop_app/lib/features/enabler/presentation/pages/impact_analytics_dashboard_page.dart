import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../cubit/enabler_dashboard_cubit.dart';
import '../../../../injection_container.dart';
import '../../../shared/presentation/widgets/loading_widget.dart';

class ImpactAnalyticsDashboardPage extends StatelessWidget {
  const ImpactAnalyticsDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return BlocProvider(
      create: (context) {
        final cubit = getIt<EnablerDashboardCubit>();
        cubit.loadDashboard();
        return cubit;
      },
      child: _ImpactAnalyticsDashboardView(l10n: l10n),
    );
  }
}

class _ImpactAnalyticsDashboardView extends StatelessWidget {
  final AppLocalizations l10n;
  const _ImpactAnalyticsDashboardView({required this.l10n});

  @override
  Widget build(BuildContext context) {
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
            onPressed: () {},
          ),
        ],
      ),
      body: SafeArea(
        child: BlocBuilder<EnablerDashboardCubit, EnablerDashboardState>(
          builder: (context, state) {
            if (state is EnablerDashboardLoading) {
              return const Center(child: LoadingWidget());
            }
            if (state is EnablerDashboardError) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Text(
                    state.message,
                    style: const TextStyle(color: Colors.redAccent),
                  ),
                ),
              );
            }
            if (state is EnablerDashboardLoaded) {
              return _buildDashboardContent(context, state);
            }
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  Widget _buildDashboardContent(BuildContext context, EnablerDashboardLoaded state) {
    return ListView(
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
                value: _formatNumber(state.totalWasteDiverted),
                unit: 'kg',
                icon: Icons.recycling,
                trend: '+${_formatNumber(state.totalWasteDiverted)}',
                isPositive: true,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildKpiCard(
                title: l10n.enablerAnalyticsKpiCarbon,
                value: _formatNumber(state.totalCo2Saved),
                unit: 'kg',
                icon: Icons.cloud_outlined,
                trend: '+${_formatNumber(state.totalCo2Saved)}',
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
                value: 'Rp ${_formatNumber(state.totalEconomicValue)}',
                unit: '',
                icon: Icons.account_balance_wallet_outlined,
                trend: '+${_formatNumber(state.totalEconomicValue)}',
                isPositive: true,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildKpiCard(
                title: l10n.enablerAnalyticsKpiActiveUsers,
                value: '${state.totalUsers}',
                unit: l10n.enablerAnalyticsKpiActiveUsersMockUnit,
                icon: Icons.groups_outlined,
                trend: '+${state.totalUsers}',
                isPositive: true,
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),

        // Real Bar Chart (Traceability Volume)
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
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    _buildBar(
                      label: 'Generator',
                      value: state.generatorCount.toDouble(),
                      maxValue: state.totalUsers.toDouble(),
                      color: Colors.amber,
                    ),
                    const SizedBox(width: 12),
                    _buildBar(
                      label: 'Converter',
                      value: state.converterCount.toDouble(),
                      maxValue: state.totalUsers.toDouble(),
                      color: AppTheme.primaryColor,
                    ),
                    const SizedBox(width: 12),
                    _buildBar(
                      label: 'Aggregator',
                      value: state.aggregatorCount.toDouble(),
                      maxValue: state.totalUsers.toDouble(),
                      color: Colors.blue,
                    ),
                    const SizedBox(width: 12),
                    _buildBar(
                      label: 'Buyer',
                      value: state.buyerCount.toDouble(),
                      maxValue: state.totalUsers.toDouble(),
                      color: Colors.orange,
                    ),
                    const SizedBox(width: 12),
                    _buildBar(
                      label: 'Waste',
                      value: state.wasteListingCount.toDouble(),
                      maxValue: state.wasteListingCount.toDouble() * 1.5,
                      color: Colors.purple,
                    ),
                  ],
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
          'Generator',
          '${state.generatorCount} users',
        ),
        _buildContributorRow(
          '2',
          'Converter',
          '${state.converterCount} users',
        ),
        _buildContributorRow(
          '3',
          'Aggregator',
          '${state.aggregatorCount} users',
        ),
        _buildContributorRow(
          '4',
          'Buyer',
          '${state.buyerCount} users',
        ),
        const SizedBox(height: 8),
        _buildContributorRow(
          '~',
          'Total Transactions',
          '${state.transactionCount} transactions',
        ),

        const SizedBox(height: 32),
      ],
    );
  }

  Widget _buildBar({
    required String label,
    required double value,
    required double maxValue,
    required Color color,
  }) {
    final height = maxValue > 0 ? (value / maxValue) * 140 : 0.0;
    return Expanded(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Text(
            value.toStringAsFixed(0),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Container(
            height: height.clamp(4.0, 140.0),
            width: double.infinity,
            decoration: BoxDecoration(
              color: color,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(6),
              ),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white54,
              fontSize: 9,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
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
              Flexible(
                child: Text(
                  value,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                  overflow: TextOverflow.ellipsis,
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

  String _formatNumber(double value) {
    if (value >= 1000000) {
      return '${(value / 1000000).toStringAsFixed(1)}jt';
    } else if (value >= 1000) {
      return '${(value / 1000).toStringAsFixed(1)}rb';
    }
    return value.toStringAsFixed(0);
  }
}
