import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../presentation/bloc/wallet_bloc.dart';
import '../../domain/entities/wallet_transaction.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../../injection_container.dart';
import 'package:intl/intl.dart'; // for DateFormat

class WoodLoopDigitalWalletPage extends StatefulWidget {
  const WoodLoopDigitalWalletPage({super.key});

  @override
  State<WoodLoopDigitalWalletPage> createState() =>
      _WoodLoopDigitalWalletPageState();
}

class _WoodLoopDigitalWalletPageState extends State<WoodLoopDigitalWalletPage> {
  String? _userId;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final authState = context.read<AuthBloc>().state;
    if (authState is Authenticated) {
      _userId = authState.user.id;
    }
  }

  void _refresh() {
    if (_userId != null) {
      context.read<WalletBloc>().add(RefreshWalletBalance(_userId!));
    }
  }

  void _showTransactionDetail(WalletTransaction tx, AppLocalizations l10n) {
    final refLabels = {
      'pickup': 'Penjemputan',
      'marketplace_transaction': 'Transaksi Pasar',
      'order': 'Pesanan',
      'topup': 'Top Up',
      'withdrawal': 'Penarikan',
    };
    final refLabel = refLabels[tx.referenceType] ?? tx.referenceType ?? '-';
    final refId = tx.referenceId ?? '-';
    final balanceStr =
        tx.balanceAfter != null
            ? 'Rp ${NumberFormat("#,###", "id").format(tx.balanceAfter)}'
            : '-';

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40, height: 4,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(tx.description ?? (tx.type == 'credit' ? 'Pemasukan' : 'Pengeluaran'),
              style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _detailRow('Tipe', tx.type == 'credit' ? 'Kredit (Masuk)' : 'Debit (Keluar)',
              valueColor: tx.type == 'credit' ? AppTheme.primaryColor : Colors.redAccent),
            _detailRow('Jumlah', 'Rp ${NumberFormat("#,###", "id").format(tx.amount)}'),
            _detailRow('Saldo Setelah', balanceStr),
            _detailRow('Referensi', '$refLabel ($refId)'),
            _detailRow('Tanggal', DateFormat('dd MMMM yyyy, HH:mm').format(tx.created)),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return BlocProvider(
      create: (context) {
        final bloc = getIt<WalletBloc>();
        if (_userId != null) {
          bloc.add(LoadWallet(_userId!));
        }
        return bloc;
      },
      child: _WalletView(
        l10n: l10n,
        onRefresh: _refresh,
        onTransactionTap: (tx) => _showTransactionDetail(tx, l10n),
      ),
    );
  }
}

class _WalletView extends StatelessWidget {
  final AppLocalizations l10n;
  final VoidCallback onRefresh;
  final Function(WalletTransaction) onTransactionTap;
  const _WalletView({
    required this.l10n,
    required this.onRefresh,
    required this.onTransactionTap,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: Text(l10n.walletTitle,
          style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async => onRefresh(),
          color: AppTheme.primaryColor,
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
                          Text(l10n.walletTotalBalance,
                            style: const TextStyle(color: AppTheme.background, fontSize: 14, fontWeight: FontWeight.w600)),
                          const Icon(Icons.visibility_off_outlined, color: AppTheme.background, size: 20),
                        ],
                      ),
                      const SizedBox(height: 16),
                      BlocBuilder<WalletBloc, WalletState>(
                        builder: (context, state) {
                          String balanceStr = 'Rp 0';
                          if (state is WalletLoaded) {
                            balanceStr = 'Rp ${NumberFormat("#,###", "id").format(state.balance)}';
                          }
                          return Text(balanceStr,
                            style: const TextStyle(color: AppTheme.background, fontSize: 36, fontWeight: FontWeight.bold));
                        },
                      ),
                      const SizedBox(height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildActionIcon(Icons.add, l10n.walletTopUp),
                          _buildActionIcon(Icons.arrow_upward, l10n.walletTransfer),
                          _buildActionIcon(Icons.account_balance, l10n.walletWithdraw),
                          _buildActionIcon(Icons.history, l10n.walletHistoryIcon),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Transaction History
              Expanded(
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceColor,
                    borderRadius: const BorderRadius.only(topLeft: Radius.circular(32), topRight: Radius.circular(32)),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(l10n.walletRecentTransactions,
                              style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                            GestureDetector(
                              onTap: onRefresh,
                              child: const Icon(Icons.refresh, color: AppTheme.primaryColor, size: 20),
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: BlocBuilder<WalletBloc, WalletState>(
                          builder: (context, state) {
                            if (state is WalletLoading) {
                              return const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor));
                            }
                            if (state is WalletLoaded) {
                              if (state.transactions.isEmpty) {
                                return Center(
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(Icons.receipt_long_outlined, color: Colors.white24, size: 64),
                                      const SizedBox(height: 16),
                                      const Text('Belum ada transaksi',
                                        style: TextStyle(color: Colors.white54, fontSize: 13)),
                                      const SizedBox(height: 8),
                                      Text('Transaksi akan muncul setelah ada aktivitas',
                                        style: TextStyle(color: Colors.white30, fontSize: 11)),
                                    ],
                                  ),
                                );
                              }
                              return ListView.builder(
                                padding: const EdgeInsets.symmetric(horizontal: 24),
                                itemCount: state.transactions.length,
                                itemBuilder: (context, index) {
                                  final tx = state.transactions[index];
                                  final isIncome = tx.type == 'credit';
                                  final sign = isIncome ? '+' : '-';
                                  final dateStr = DateFormat('dd MMM yyyy, HH:mm').format(tx.created);
                                  final refBadge = _refBadge(tx.referenceType);
                                  return GestureDetector(
                                    onTap: () => onTransactionTap(tx),
                                    child: _buildTransactionRow(
                                      title: tx.description ?? (isIncome ? 'Pemasukan' : 'Pengeluaran'),
                                      date: dateStr,
                                      amount: '$sign Rp ${NumberFormat("#,###", "id").format(tx.amount)}',
                                      isIncome: isIncome,
                                      refBadge: refBadge,
                                    ),
                                  );
                                },
                              );
                            }
                            if (state is WalletError) {
                              return Center(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.error_outline, color: Colors.redAccent, size: 48),
                                    const SizedBox(height: 16),
                                    Text(state.message, style: const TextStyle(color: Colors.redAccent, fontSize: 12)),
                                    const SizedBox(height: 16),
                                    TextButton(onPressed: onRefresh, child: const Text('Coba Lagi')),
                                  ],
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
      ),
    );
  }

  Widget _buildActionIcon(IconData icon, String label) {
    return Column(children: [
      Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(color: AppTheme.background.withValues(alpha: 0.2), shape: BoxShape.circle),
        child: Icon(icon, color: AppTheme.background, size: 24),
      ),
      const SizedBox(height: 8),
      Text(label, style: const TextStyle(color: AppTheme.background, fontSize: 12, fontWeight: FontWeight.w600)),
    ]);
  }

  Widget _refBadge(String? refType) {
    if (refType == null) return const SizedBox.shrink();
    final colors = {
      'pickup': AppTheme.primaryColor,
      'marketplace_transaction': Colors.orange,
      'order': Colors.blue,
      'topup': Colors.green,
      'withdrawal': Colors.redAccent,
    };
    final labels = {
      'pickup': 'Pickup',
      'marketplace_transaction': 'Market',
      'order': 'Order',
      'topup': 'Top Up',
      'withdrawal': 'Tarik',
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: (colors[refType] ?? Colors.grey).withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(labels[refType] ?? refType,
        style: TextStyle(color: colors[refType] ?? Colors.grey, fontSize: 9, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildTransactionRow({
    required String title, required String date, required String amount,
    required bool isIncome, Widget? refBadge,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20.0),
      child: Row(children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: AppTheme.background, shape: BoxShape.circle,
            border: Border.all(color: Colors.white.withValues(alpha: 0.05))),
          child: Icon(isIncome ? Icons.south_west : Icons.north_east,
            color: isIncome ? AppTheme.primaryColor : Colors.redAccent, size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Expanded(child: Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
              if (refBadge != null) ...[const SizedBox(width: 8), refBadge],
            ]),
            const SizedBox(height: 4),
            Text(date, style: const TextStyle(color: Colors.white54, fontSize: 12)),
          ]),
        ),
        Text(amount, style: TextStyle(color: isIncome ? AppTheme.primaryColor : Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
      ]),
    );
  }
}

void _detailRow(String label, String value, {Color? valueColor}) {
  // This is a top-level function used inside showModalBottomSheet builder
}

extension _DetailRow on _WalletView {
  Widget _detailRow(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.white54, fontSize: 13)),
          Text(value, style: TextStyle(color: valueColor ?? Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

