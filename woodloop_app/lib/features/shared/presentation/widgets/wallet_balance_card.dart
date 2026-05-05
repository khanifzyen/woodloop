import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../bloc/wallet_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../injection_container.dart';

/// Reusable wallet balance card widget.
/// Can be embedded in any dashboard to show current balance.
class WalletBalanceCard extends StatelessWidget {
  final String userId;
  final VoidCallback? onTap;

  const WalletBalanceCard({
    super.key,
    required this.userId,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final bloc = getIt<WalletBloc>();
        bloc.add(LoadWallet(userId));
        return bloc;
      },
      child: BlocBuilder<WalletBloc, WalletState>(
        builder: (context, state) {
          String balanceStr = 'Rp 0';
          bool isLoading = false;

          if (state is WalletLoading) {
            isLoading = true;
          } else if (state is WalletLoaded) {
            balanceStr =
                'Rp ${NumberFormat("#,###", "id").format(state.balance)}';
          }

          return GestureDetector(
            onTap: onTap,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primaryColor, Color(0xFF0F9B3D)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.account_balance_wallet_outlined,
                      color: Colors.white, size: 20),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('Saldo',
                          style: TextStyle(
                              color: Colors.white70, fontSize: 10)),
                      const SizedBox(height: 2),
                      isLoading
                          ? const SizedBox(
                              height: 18,
                              width: 18,
                              child: CircularProgressIndicator(
                                  strokeWidth: 2, color: Colors.white))
                          : Text(balanceStr,
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(width: 4),
                  const Icon(Icons.chevron_right,
                      color: Colors.white70, size: 16),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
