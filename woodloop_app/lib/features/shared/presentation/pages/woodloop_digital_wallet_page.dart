import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../presentation/bloc/wallet_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../../injection_container.dart';
import 'package:intl/intl.dart'; // for DateFormat

class WoodLoopDigitalWalletPage extends StatelessWidget {
  const WoodLoopDigitalWalletPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return BlocProvider(
      create: (context) {
        final bloc = getIt<WalletBloc>();
        final authState = context.read<AuthBloc>().state;
        if (authState is Authenticated) {
          bloc.add(LoadWallet(authState.user.id));
        }
        return bloc;
      },
      child: _WoodLoopDigitalWalletView(l10n: l10n),
    );
  }
}

class _WoodLoopDigitalWalletView extends StatelessWidget {
  final AppLocalizations l10n;
  const _WoodLoopDigitalWalletView({required this.l10n});

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
          l10n.walletTitle,
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
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          l10n.walletTotalBalance,
                          style: const TextStyle(
                            color: AppTheme.background,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const Icon(
                          Icons.visibility_off_outlined,
                          color: AppTheme.background,
                          size: 20,
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    BlocBuilder<WalletBloc, WalletState>(
                      builder: (context, state) {
                        String balanceStr = 'Rp 0';
                        if (state is WalletLoaded) {
                          balanceStr =
                              'Rp ${NumberFormat('#,###', 'id').format(state.balance)}';
                        }
                        return Text(
                          balanceStr,
                          style: const TextStyle(
                            color: AppTheme.background,
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildActionIcon(Icons.add, l10n.walletTopUp),
                        _buildActionIcon(
                          Icons.arrow_upward,
                          l10n.walletTransfer,
                        ),
                        _buildActionIcon(
                          Icons.account_balance,
                          l10n.walletWithdraw,
                        ),
                        _buildActionIcon(Icons.history, l10n.walletHistoryIcon),
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
                    Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Text(
                        l10n.walletRecentTransactions,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Expanded(
                      child: BlocBuilder<WalletBloc, WalletState>(
                        builder: (context, state) {
                          if (state is WalletLoading) {
                            return const Center(
                              child: CircularProgressIndicator(
                                color: AppTheme.primaryColor,
                              ),
                            );
                          }
                          if (state is WalletLoaded) {
                            if (state.transactions.isEmpty) {
                              return Center(
                                child: Text(
                                  'Belum ada transaksi',
                                  style: TextStyle(
                                    color: Colors.white54,
                                    fontSize: 13,
                                  ),
                                ),
                              );
                            }
                            return ListView.builder(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 24,
                              ),
                              itemCount: state.transactions.length,
                              itemBuilder: (context, index) {
                                final tx = state.transactions[index];
                                final isIncome = tx.type == 'credit';
                                final sign = isIncome ? '+' : '-';
                                final dateStr = DateFormat(
                                  'dd MMM yyyy, HH:mm',
                                ).format(tx.created);
                                return _buildTransactionRow(
                                  title:
                                      tx.description ??
                                      (isIncome ? 'Pemasukan' : 'Pengeluaran'),
                                  date: dateStr,
                                  amount:
                                      '$sign Rp ${NumberFormat('#,###', 'id').format(tx.amount)}',
                                  isIncome: isIncome,
                                );
                              },
                            );
                          }
                          if (state is WalletError) {
                            return Center(
                              child: Text(
                                state.message,
                                style: const TextStyle(
                                  color: Colors.redAccent,
                                  fontSize: 12,
                                ),
                              ),
                            );
                          }
                          return const SizedBox.shrink();
                        },
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
