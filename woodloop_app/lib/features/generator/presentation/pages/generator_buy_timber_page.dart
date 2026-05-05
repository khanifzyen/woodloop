import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../supplier/presentation/bloc/supplier_inventory_cubit.dart';
import '../../../supplier/domain/entities/raw_timber_listing.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../bloc/raw_timber_order_bloc.dart';
import '../../../../injection_container.dart';
import 'package:intl/intl.dart';

/// Generator browsing raw timber marketplace to order from Supplier
class GeneratorBuyTimberPage extends StatelessWidget {
  const GeneratorBuyTimberPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.pop()),
        title: const Text('Beli Bahan Baku', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        centerTitle: true, backgroundColor: Colors.transparent, elevation: 0,
      ),
      body: BlocProvider(
        create: (_) => getIt<SupplierInventoryCubit>()..loadListings(),
        child: BlocBuilder<SupplierInventoryCubit, SupplierInventoryState>(
          builder: (context, state) {
            if (state is SupplierInventoryLoading) {
              return const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor));
            }
            if (state is SupplierInventoryLoaded) {
              final available = state.listings.where((l) => l.isAvailable).toList();
              if (available.isEmpty) {
                return const Center(child: Text('Belum ada kayu tersedia', style: TextStyle(color: Colors.white54)));
              }
              return ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: available.length,
                itemBuilder: (_, i) => _TimberCard(listing: available[i]),
              );
            }
            if (state is SupplierInventoryError) {
              return Center(child: Text(state.message, style: const TextStyle(color: Colors.redAccent)));
            }
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }
}

class _TimberCard extends StatelessWidget {
  final RawTimberListing listing;
  const _TimberCard({required this.listing});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppTheme.surfaceColor, borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Expanded(child: Text(listing.woodTypeName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16))),
          Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: AppTheme.primaryColor.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(8)),
            child: const Text('Available', style: TextStyle(color: AppTheme.primaryColor, fontSize: 10, fontWeight: FontWeight.bold))),
        ]),
        const SizedBox(height: 8),
        Text('${listing.volume} ${listing.unit}', style: const TextStyle(color: Colors.white70, fontSize: 14)),
        const SizedBox(height: 4),
        Text('Rp ${NumberFormat("#,###", "id").format(listing.price)}', style: const TextStyle(color: AppTheme.primaryColor, fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        SizedBox(width: double.infinity, child: ElevatedButton(
          onPressed: () => _placeOrder(context),
          style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryColor,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
          child: const Text('Pesan', style: TextStyle(color: AppTheme.background, fontWeight: FontWeight.bold)),
        )),
      ]),
    );
  }

  void _placeOrder(BuildContext context) {
    final auth = context.read<AuthBloc>().state;
    if (auth is! Authenticated) return;

    final bloc = context.read<RawTimberOrderBloc>();
    bloc.add(CreateRawTimberOrder({
      'buyer': auth.user.id,
      'seller': listing.supplierId,
      'listing': listing.id,
      'quantity': listing.volume,
      'total_price': listing.price,
      'status': 'pending',
    }));
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Pesanan dikirim ke Supplier!'), backgroundColor: AppTheme.primaryColor),
    );
  }
}
