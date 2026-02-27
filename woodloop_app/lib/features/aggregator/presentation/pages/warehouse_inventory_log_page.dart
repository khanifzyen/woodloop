import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../presentation/bloc/warehouse_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../../injection_container.dart';

class WarehouseInventoryLogPage extends StatelessWidget {
  const WarehouseInventoryLogPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return BlocProvider(
      create: (context) {
        final bloc = getIt<WarehouseBloc>();
        final authState = context.read<AuthBloc>().state;
        String? aggregatorId;
        if (authState is Authenticated) {
          aggregatorId = authState.user.id;
        }
        bloc.add(LoadWarehouseItems(aggregatorId: aggregatorId));
        return bloc;
      },
      child: _WarehouseInventoryLogView(l10n: l10n),
    );
  }
}

class _WarehouseInventoryLogView extends StatelessWidget {
  final AppLocalizations l10n;
  const _WarehouseInventoryLogView({required this.l10n});

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
          l10n.aggregatorWarehouseTitle,
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
          IconButton(icon: const Icon(Icons.history), onPressed: () {}),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Total Capacity Summary
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.1),
                  ),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          l10n.aggregatorWarehouseCapacity,
                          style: const TextStyle(
                            color: Colors.white70,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          l10n.aggregatorWarehouseMockCapacity,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: 0.425, // 850 / 2000
                        backgroundColor: Colors.white.withValues(alpha: 0.1),
                        color: AppTheme.primaryColor,
                        minHeight: 8,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Tabs / Filters
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _buildFilterChip(l10n.aggregatorWarehouseFilterAll, true),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    l10n.aggregatorWarehouseFilterSawdust,
                    false,
                  ),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    l10n.aggregatorWarehouseFilterOffcuts,
                    false,
                  ),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    l10n.aggregatorWarehouseFilterPallets,
                    false,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Inventory List
            Expanded(
              child: BlocBuilder<WarehouseBloc, WarehouseState>(
                builder: (context, state) {
                  if (state is WarehouseLoading) {
                    return const Center(
                      child: CircularProgressIndicator(
                        color: AppTheme.primaryColor,
                      ),
                    );
                  }
                  if (state is WarehouseItemsLoaded) {
                    if (state.items.isEmpty) {
                      return Center(
                        child: Text(
                          'Gudang kosong',
                          style: TextStyle(color: Colors.white54, fontSize: 13),
                        ),
                      );
                    }
                    return ListView.builder(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 8,
                      ),
                      itemCount: state.items.length,
                      itemBuilder: (context, index) {
                        final item = state.items[index];
                        final colors = [
                          Colors.orange,
                          Colors.blue,
                          Colors.green,
                          Colors.purple,
                          Colors.red,
                        ];
                        return _buildInventoryItem(
                          title: item.woodTypeName ?? item.form,
                          subtitle: 'Status: ${item.status}',
                          weight: '${item.weight.toStringAsFixed(0)} kg',
                          colorId: colors[index % colors.length],
                        );
                      },
                    );
                  }
                  if (state is WarehouseError) {
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // TODO: Forward to Converter Marketplace logic
        },
        backgroundColor: AppTheme.primaryColor,
        icon: const Icon(Icons.storefront, color: AppTheme.background),
        label: Text(
          l10n.aggregatorWarehouseSellBtn,
          style: const TextStyle(
            color: AppTheme.background,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected
            ? AppTheme.primaryColor.withValues(alpha: 0.1)
            : AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isSelected
              ? AppTheme.primaryColor
              : Colors.white.withValues(alpha: 0.1),
        ),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? AppTheme.primaryColor : Colors.white70,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _buildInventoryItem({
    required String title,
    required String subtitle,
    required String weight,
    required Color colorId,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 80,
            decoration: BoxDecoration(
              color: colorId,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                bottomLeft: Radius.circular(16),
              ),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          subtitle,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                    ),
                    child: Text(
                      weight,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
