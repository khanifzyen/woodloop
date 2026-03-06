import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../../injection_container.dart';
import '../bloc/supplier_dashboard_cubit.dart';
import '../../domain/entities/raw_timber_listing.dart';

class SupplierDashboardPage extends StatelessWidget {
  const SupplierDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt<SupplierDashboardCubit>();
        // Get user from AuthBloc
        final authState = context.read<AuthBloc>().state;
        if (authState is Authenticated) {
          final user = authState.user;
          cubit.load(user.id, user.name, user.workshopName ?? '');
        }
        return cubit;
      },
      child: const _SupplierDashboardView(),
    );
  }
}

class _SupplierDashboardView extends StatelessWidget {
  const _SupplierDashboardView();

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final currencyFmt = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );

    return BlocBuilder<SupplierDashboardCubit, SupplierDashboardState>(
      builder: (context, state) {
        String displayName = 'WoodLoop Supply';
        if (state is SupplierDashboardLoaded) {
          displayName = state.data.workshopName.isNotEmpty
              ? state.data.workshopName
              : state.data.supplierName;
        }

        return Scaffold(
          backgroundColor: AppTheme.background,
          body: RefreshIndicator(
            color: AppTheme.primaryColor,
            backgroundColor: AppTheme.surfaceColor,
            onRefresh: () async {
              final authState = context.read<AuthBloc>().state;
              if (authState is Authenticated) {
                final user = authState.user;
                await context.read<SupplierDashboardCubit>().load(
                  user.id,
                  user.name,
                  user.workshopName ?? '',
                );
              }
            },
            child: SafeArea(
              child: CustomScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                slivers: [
                  // ── Header ──
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: Colors.white.withValues(alpha: 0.1),
                                  ),
                                  image: const DecorationImage(
                                    image: AssetImage(
                                      'assets/images/supplier_profile.jpg',
                                    ),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    l10n.supplierDashWelcome,
                                    style: const TextStyle(
                                      color: Colors.white54,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  Text(
                                    displayName,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          GestureDetector(
                            onTap: () =>
                                context.pushNamed('notification_center'),
                            child: Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: AppTheme.surfaceColor,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.1),
                                ),
                              ),
                              child: const Icon(
                                Icons.notifications_none,
                                color: Colors.white54,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // ── Title ──
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      child: Text(
                        l10n.supplierDashOverviewTitle,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SliverToBoxAdapter(child: SizedBox(height: 16)),

                  // ── Metric Cards ──
                  SliverToBoxAdapter(
                    child: SizedBox(
                      height: 144,
                      child: _buildMetricRow(context, state, currencyFmt, l10n),
                    ),
                  ),
                  const SliverToBoxAdapter(child: SizedBox(height: 24)),

                  // ── Primary Action ──
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      child: SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: () => context.pushNamed('list_raw_timber'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            elevation: 8,
                            shadowColor: AppTheme.primaryColor.withValues(
                              alpha: 0.3,
                            ),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.add,
                                color: AppTheme.background,
                                size: 24,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                l10n.supplierDashListNewTimber,
                                style: const TextStyle(
                                  color: AppTheme.background,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SliverToBoxAdapter(child: SizedBox(height: 24)),

                  // ── Recent Sales Header ──
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            l10n.supplierDashRecentSales,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          TextButton(
                            onPressed: () =>
                                context.pushNamed('supplier_sales_history'),
                            child: Text(
                              l10n.supplierDashViewAll,
                              style: const TextStyle(
                                color: AppTheme.primaryColor,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // ── Recent Sales List ──
                  if (state is SupplierDashboardLoading)
                    const SliverToBoxAdapter(
                      child: Center(
                        child: Padding(
                          padding: EdgeInsets.all(40),
                          child: CircularProgressIndicator(
                            color: AppTheme.primaryColor,
                          ),
                        ),
                      ),
                    )
                  else if (state is SupplierDashboardError)
                    SliverToBoxAdapter(
                      child: Center(
                        child: Padding(
                          padding: const EdgeInsets.all(32),
                          child: Column(
                            children: [
                              const Icon(
                                Icons.wifi_off,
                                color: Colors.white38,
                                size: 48,
                              ),
                              const SizedBox(height: 12),
                              Text(
                                'Gagal memuat data',
                                style: const TextStyle(color: Colors.white54),
                              ),
                            ],
                          ),
                        ),
                      ),
                    )
                  else if (state is SupplierDashboardLoaded &&
                      state.data.recentSales.isEmpty)
                    const SliverToBoxAdapter(
                      child: Center(
                        child: Padding(
                          padding: EdgeInsets.all(32),
                          child: Column(
                            children: [
                              Icon(
                                Icons.sell_outlined,
                                color: Colors.white24,
                                size: 48,
                              ),
                              SizedBox(height: 12),
                              Text(
                                'Belum ada penjualan',
                                style: TextStyle(color: Colors.white38),
                              ),
                            ],
                          ),
                        ),
                      ),
                    )
                  else if (state is SupplierDashboardLoaded)
                    SliverPadding(
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                      sliver: SliverList(
                        delegate: SliverChildBuilderDelegate((context, index) {
                          final sale = state.data.recentSales[index];
                          return _buildSaleItem(sale, currencyFmt);
                        }, childCount: state.data.recentSales.length),
                      ),
                    )
                  else
                    const SliverToBoxAdapter(child: SizedBox(height: 40)),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildMetricRow(
    BuildContext context,
    SupplierDashboardState state,
    NumberFormat currencyFmt,
    AppLocalizations l10n,
  ) {
    final revenue = state is SupplierDashboardLoaded
        ? currencyFmt.format(state.data.monthlyRevenue)
        : '—';
    final stock = state is SupplierDashboardLoaded
        ? '${state.data.totalStock.toStringAsFixed(1)} m³'
        : '—';
    final listings = state is SupplierDashboardLoaded
        ? '${state.data.activeListings}'
        : '—';

    return ListView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      children: [
        _buildMetricCard(
          icon: Icons.attach_money,
          iconBgColor: Colors.green.withValues(alpha: 0.2),
          iconColor: AppTheme.primaryColor,
          title: l10n.supplierDashMonthlyRevenue,
          value: revenue,
          bgIcon: Icons.payments_outlined,
          isLoading: state is SupplierDashboardLoading,
        ),
        const SizedBox(width: 16),
        _buildMetricCard(
          icon: Icons.inventory_2,
          iconBgColor: Colors.blue.withValues(alpha: 0.2),
          iconColor: Colors.blue[400]!,
          title: l10n.supplierDashTotalStock,
          value: stock,
          bgIcon: Icons.forest_outlined,
          isLoading: state is SupplierDashboardLoading,
        ),
        const SizedBox(width: 16),
        _buildMetricCard(
          icon: Icons.view_list,
          iconBgColor: Colors.orange.withValues(alpha: 0.2),
          iconColor: Colors.orange[400]!,
          title: l10n.supplierDashActiveListings,
          value: listings,
          bgIcon: Icons.list_alt,
          isLoading: state is SupplierDashboardLoading,
        ),
      ],
    );
  }

  Widget _buildMetricCard({
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required String title,
    required String value,
    required IconData bgIcon,
    required bool isLoading,
  }) {
    return Container(
      width: 160,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Stack(
        children: [
          Positioned(
            right: -8,
            top: -8,
            child: Icon(
              bgIcon,
              size: 48,
              color: Colors.white.withValues(alpha: 0.05),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: iconBgColor,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(color: Colors.white54, fontSize: 12),
                  ),
                  const SizedBox(height: 4),
                  isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: AppTheme.primaryColor,
                          ),
                        )
                      : Text(
                          value,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            letterSpacing: -0.5,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSaleItem(RawTimberListing sale, NumberFormat currencyFmt) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.forest, color: Colors.white54),
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
                        sale.woodTypeName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      currencyFmt.format(sale.price),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${sale.volume} ${sale.unit}',
                      style: const TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: AppTheme.primaryColor.withValues(alpha: 0.2),
                        ),
                      ),
                      child: const Text(
                        'SOLD',
                        style: TextStyle(
                          color: AppTheme.primaryColor,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
