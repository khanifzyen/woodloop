import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../injection_container.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../domain/entities/raw_timber_listing.dart';
import '../bloc/supplier_inventory_cubit.dart';

class MyTimberInventoryPage extends StatelessWidget {
  const MyTimberInventoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt<SupplierInventoryCubit>();
        final authState = context.read<AuthBloc>().state;
        if (authState is Authenticated) {
          cubit.loadInventory(authState.user.id);
        }
        return cubit;
      },
      child: const _InventoryView(),
    );
  }
}

class _InventoryView extends StatelessWidget {
  const _InventoryView();

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final cubit = context.read<SupplierInventoryCubit>();

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Column(
          children: [
            // Header Section
            Container(
              padding: const EdgeInsets.only(
                top: 24,
                bottom: 8,
                left: 16,
                right: 16,
              ),
              decoration: BoxDecoration(
                color: AppTheme.background.withValues(alpha: 0.95),
                border: Border(
                  bottom: BorderSide(
                    color: Colors.white.withValues(alpha: 0.05),
                  ),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    l10n.supplierInvTitle,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.add_box, color: Colors.white),
                    onPressed: () => context.goNamed('supplier_input'),
                  ),
                ],
              ),
            ),

            // Filter Tabs & List
            Expanded(
              child:
                  BlocBuilder<SupplierInventoryCubit, SupplierInventoryState>(
                    builder: (context, state) {
                      if (state is SupplierInventoryLoading) {
                        return const Center(
                          child: CircularProgressIndicator(
                            color: AppTheme.primaryColor,
                          ),
                        );
                      }

                      if (state is SupplierInventoryError) {
                        return Center(
                          child: Text(
                            state.message,
                            style: const TextStyle(color: Colors.red),
                          ),
                        );
                      }

                      if (state is SupplierInventoryLoaded) {
                        return Column(
                          children: [
                            // Filter Pills
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 12,
                              ),
                              decoration: BoxDecoration(
                                color: AppTheme.background.withValues(
                                  alpha: 0.95,
                                ),
                                border: Border(
                                  bottom: BorderSide(
                                    color: Colors.white.withValues(alpha: 0.05),
                                  ),
                                ),
                              ),
                              child: SingleChildScrollView(
                                scrollDirection: Axis.horizontal,
                                child: Row(
                                  children: [
                                    _buildFilterPill(
                                      context,
                                      l10n.supplierInvFilterAll,
                                      'all',
                                      state.activeFilter,
                                    ),
                                    _buildFilterPill(
                                      context,
                                      l10n.supplierInvFilterAvailable,
                                      'available',
                                      state.activeFilter,
                                    ),
                                    _buildFilterPill(
                                      context,
                                      l10n.supplierInvFilterDraft,
                                      'draft',
                                      state.activeFilter,
                                    ),
                                    _buildFilterPill(
                                      context,
                                      l10n.supplierInvFilterSold,
                                      'sold',
                                      state.activeFilter,
                                    ),
                                  ],
                                ),
                              ),
                            ),

                            // List Content
                            Expanded(
                              child: RefreshIndicator(
                                color: AppTheme.primaryColor,
                                backgroundColor: AppTheme.surfaceColor,
                                onRefresh: () async {
                                  final authState = context
                                      .read<AuthBloc>()
                                      .state;
                                  if (authState is Authenticated) {
                                    await cubit.loadInventory(
                                      authState.user.id,
                                    );
                                  }
                                },
                                child: state.filteredListings.isEmpty
                                    ? _buildEmptyState(context)
                                    : ListView.builder(
                                        padding: const EdgeInsets.all(16),
                                        itemCount:
                                            state.filteredListings.length,
                                        itemBuilder: (context, index) {
                                          final listing =
                                              state.filteredListings[index];
                                          return _buildInventoryCard(
                                            context,
                                            listing,
                                          );
                                        },
                                      ),
                              ),
                            ),
                          ],
                        );
                      }

                      return const SizedBox();
                    },
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterPill(
    BuildContext context,
    String label,
    String value,
    String activeValue,
  ) {
    final isSelected = activeValue == value;

    return GestureDetector(
      onTap: () {
        context.read<SupplierInventoryCubit>().applyFilter(value);
      },
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primaryColor : AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? AppTheme.primaryColor
                : Colors.white.withValues(alpha: 0.05),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? AppTheme.background : Colors.white54,
            fontSize: 14,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inventory_2_outlined,
            size: 64,
            color: Colors.white.withValues(alpha: 0.2),
          ),
          const SizedBox(height: 16),
          Text(
            l10n.supplierInvEmptyState,
            style: const TextStyle(color: Colors.white54, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildInventoryCard(BuildContext context, RawTimberListing listing) {
    final l10n = AppLocalizations.of(context)!;
    final currencyFmt = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp',
      decimalDigits: 0,
    );

    // Status Badge Color logic
    Color statusColor = Colors.grey;
    if (listing.status == 'available') statusColor = AppTheme.primaryColor;
    if (listing.status == 'draft') statusColor = Colors.orange;
    if (listing.status == 'sold') statusColor = Colors.red;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Track ID & Status
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.2),
              border: Border(
                bottom: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.qr_code, size: 16, color: Colors.white54),
                    const SizedBox(width: 8),
                    Text(
                      listing.trackingId ?? 'ID Pending',
                      style: const TextStyle(
                        fontFamily: 'monospace',
                        color: Colors.white70,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(
                      color: statusColor.withValues(alpha: 0.5),
                    ),
                  ),
                  child: Text(
                    listing.status.toUpperCase(),
                    style: TextStyle(
                      color: statusColor,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Image Placeholder
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: Colors.black26,
                    borderRadius: BorderRadius.circular(8),
                    image: const DecorationImage(
                      image: AssetImage(
                        'assets/images/map_jepara.jpg',
                      ), // Placeholder
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(width: 16),

                // Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        listing.woodTypeName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Volume: ${listing.volume} ${listing.unit}',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Total: ${currencyFmt.format(listing.price)}',
                        style: const TextStyle(
                          color: AppTheme.primaryColor,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Action Buttons
          if (listing.status != 'sold')
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton.icon(
                    onPressed: () {
                      _confirmDelete(context, listing.id);
                    },
                    icon: const Icon(
                      Icons.delete_outline,
                      size: 16,
                      color: Colors.white54,
                    ),
                    label: Text(
                      l10n.supplierInvActionDelete,
                      style: const TextStyle(color: Colors.white54),
                    ),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton.icon(
                    onPressed: () {
                      context.pushNamed('supplier_input', extra: listing).then((
                        _,
                      ) {
                        if (!context.mounted) return;
                        final authState = context.read<AuthBloc>().state;
                        if (authState is Authenticated) {
                          context.read<SupplierInventoryCubit>().loadInventory(
                            authState.user.id,
                          );
                        }
                      });
                    },
                    icon: const Icon(
                      Icons.edit,
                      size: 16,
                      color: AppTheme.background,
                    ),
                    label: Text(
                      l10n.supplierInvActionEdit,
                      style: const TextStyle(color: AppTheme.background),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context, String listingId) {
    final l10n = AppLocalizations.of(context)!;
    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        title: Text(
          l10n.supplierInvDeleteDialogTitle,
          style: const TextStyle(color: Colors.white),
        ),
        content: Text(
          l10n.supplierInvDeleteDialogContent,
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: Text(
              l10n.supplierInvDeleteDialogCancel,
              style: const TextStyle(color: Colors.white54),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(dialogCtx);
              context.read<SupplierInventoryCubit>().deleteListing(listingId);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: Text(
              l10n.supplierInvDeleteDialogConfirm,
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
