import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_theme.dart';
import '../bloc/raw_timber_order_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../../injection_container.dart';

/// Generator melihat pesanan kayu mentah mereka
class GeneratorTimberOrdersPage extends StatelessWidget {
  const GeneratorTimberOrdersPage({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthBloc>().state;
    final userId = auth is Authenticated ? auth.user.id : '';

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () {}),
        title: const Text('Pesanan Bahan Baku', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        centerTitle: true, backgroundColor: Colors.transparent, elevation: 0,
      ),
      body: BlocProvider(
        create: (_) => getIt<RawTimberOrderBloc>()..add(LoadRawTimberOrders(buyerId: userId)),
        child: BlocBuilder<RawTimberOrderBloc, RawTimberOrderState>(
          builder: (context, state) {
            if (state is RawTimberOrderLoading) return const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor));
            if (state is RawTimberOrdersLoaded) {
              if (state.orders.isEmpty) {
                return const Center(child: Text('Belum ada pesanan', style: TextStyle(color: Colors.white54)));
              }
              return ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: state.orders.length,
                itemBuilder: (_, i) {
                  final o = state.orders[i];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(color: AppTheme.surfaceColor, borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.05))),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(children: [
                        Expanded(child: Text('Order #${o.id.substring(0, 8)}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                        _statusBadge(o.status),
                      ]),
                      const SizedBox(height: 8),
                      Text('${o.quantity} unit — Rp ${NumberFormat("#,###", "id").format(o.totalPrice)}',
                        style: const TextStyle(color: Colors.white70, fontSize: 14)),
                      Text(DateFormat('dd MMM yyyy, HH:mm').format(o.created), style: const TextStyle(color: Colors.white38, fontSize: 11)),
                    ]),
                  );
                },
              );
            }
            if (state is RawTimberOrderError) return Center(child: Text(state.message, style: const TextStyle(color: Colors.redAccent)));
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }
}

Widget _statusBadge(String status) {
  final colors = {'pending': Colors.orange, 'accepted': AppTheme.primaryColor, 'rejected': Colors.redAccent, 'completed': Colors.green};
  final labels = {'pending': 'Menunggu', 'accepted': 'Diterima', 'rejected': 'Ditolak', 'completed': 'Selesai'};
  return Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
    decoration: BoxDecoration(color: (colors[status] ?? Colors.grey).withValues(alpha: 0.2), borderRadius: BorderRadius.circular(8)),
    child: Text(labels[status] ?? status, style: TextStyle(color: colors[status] ?? Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
  );
}
