import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../presentation/bloc/order_bloc.dart';
import '../../domain/entities/order.dart';
import '../../../../injection_container.dart';

/// Order Tracking Journey page -- shows real-time order status
/// and delivery timeline. Loads order data via OrderBloc.
class OrderTrackingJourneyPage extends StatelessWidget {
  final String? orderId;

  const OrderTrackingJourneyPage({super.key, this.orderId});

  @override
  Widget build(BuildContext context) {
    final id =
        orderId ?? (GoRouterState.of(context).extra as String?);

    if (id == null || id.isEmpty) {
      return Scaffold(
        backgroundColor: AppTheme.background,
        body: Center(
          child: Text(
            'Order ID tidak tersedia',
            style: const TextStyle(color: Colors.white54, fontSize: 14),
          ),
        ),
      );
    }

    return BlocProvider(
      create: (_) => getIt<OrderBloc>()..add(LoadOrderDetail(id)),
      child: const _OrderTrackingBody(),
    );
  }
}

class _OrderTrackingBody extends StatelessWidget {
  const _OrderTrackingBody();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<OrderBloc, OrderState>(
      builder: (context, state) {
        if (state is OrderLoading || state is OrderInitial) {
          return Scaffold(
            backgroundColor: AppTheme.background,
            appBar: _buildAppBar(context),
            body: const Center(
              child:
                  CircularProgressIndicator(color: AppTheme.primaryColor),
            ),
          );
        }
        if (state is OrderDetailLoaded) {
          return _OrderTrackingView(order: state.order);
        }
        if (state is OrderError) {
          return Scaffold(
            backgroundColor: AppTheme.background,
            appBar: _buildAppBar(context),
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  state.message,
                  style:
                      const TextStyle(color: Colors.redAccent, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          );
        }
        return const SizedBox.shrink();
      },
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return AppBar(
      leading: IconButton(
        icon: const Icon(Icons.arrow_back),
        onPressed: () => context.pop(),
      ),
      title: Text(
        l10n.buyerOrderTrackTitle,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      centerTitle: true,
      backgroundColor: Colors.transparent,
      elevation: 0,
    );
  }
}

/// Maps order status to timeline step index.
/// Returns -1 if status is not recognized.
int _statusToStepIndex(String status) {
  const steps = [
    'payment_pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
  ];
  return steps.indexOf(status);
}

class _OrderTrackingView extends StatelessWidget {
  final Order order;

  const _OrderTrackingView({required this.order});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final status = order.status;
    final currentStep = _statusToStepIndex(status);
    final productName = order.productName ?? 'Produk';
    final createdAt = order.created;
    final updatedAt = order.updated;

    String formatDate(DateTime? dt) {
      if (dt == null) return '-';
      return '${dt.day} ${_monthName(dt.month)} ${dt.year}, '
          '${dt.hour.toString().padLeft(2, '0')}:'
          '${dt.minute.toString().padLeft(2, '0')}';
    }

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l10n.buyerOrderTrackTitle,
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
        child: ListView(
          padding: const EdgeInsets.all(24.0),
          children: [
            // Order Info Header
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(20),
                border:
                    Border.all(color: Colors.white.withValues(alpha: 0.1)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      image: const DecorationImage(
                        image: AssetImage(
                          'assets/images/map_jepara.jpg',
                        ),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          productName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Qty: ${order.quantity} | Rp ${order.totalPrice.toStringAsFixed(0)}',
                          style: const TextStyle(
                            color: AppTheme.primaryColor,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Pesanan #${order.id.substring(0, 8)}',
                          style: const TextStyle(
                            color: Colors.white38,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Status badge
            Container(
              padding: const EdgeInsets.symmetric(
                  horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: _statusColor(status).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: _statusColor(status).withValues(alpha: 0.3),
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    _statusIcon(status),
                    color: _statusColor(status),
                    size: 16,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    _statusLabel(status, l10n),
                    style: TextStyle(
                      color: _statusColor(status),
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Traceability Badge
            GestureDetector(
              onTap: () =>
                  context.pushNamed('product_story_traceability'),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color:
                        AppTheme.primaryColor.withValues(alpha: 0.3),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.qr_code_scanner,
                          color: AppTheme.primaryColor,
                        ),
                        const SizedBox(width: 12),
                        Text(
                          l10n.buyerOrderTrackOrigin,
                          style: const TextStyle(
                            color: AppTheme.primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    Icon(
                      Icons.arrow_forward_ios,
                      color: AppTheme.primaryColor,
                      size: 16,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Delivery Status Timeline
            Text(
              l10n.buyerOrderTrackStatusHeader,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),

            // Timeline steps built from order status
            ..._buildTimelineSteps(currentStep, formatDate, createdAt, updatedAt, l10n),
            const SizedBox(height: 48),

            // Confirm Reception Button
            if (status == 'shipped' || status == 'delivered')
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {
                    context.go('/buyer-dashboard');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  child: Text(
                    l10n.buyerOrderTrackBtnConfirm,
                    style: const TextStyle(
                      color: AppTheme.background,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildTimelineSteps(
    int currentStep,
    String Function(DateTime?) formatDate,
    DateTime? createdAt,
    DateTime? updatedAt,
    AppLocalizations l10n,
  ) {
    // Define timeline steps based on order statuses
    final steps = <_TimelineStepDef>[
      _TimelineStepDef(
        title: l10n.buyerOrderTrackStep1Title,
        description: l10n.buyerOrderTrackStep1Desc,
      ),
      _TimelineStepDef(
        title: l10n.buyerOrderTrackStep2Title,
        description: l10n.buyerOrderTrackStep2Desc,
      ),
      _TimelineStepDef(
        title: l10n.buyerOrderTrackStep3Title,
        description: l10n.buyerOrderTrackStep3Desc,
      ),
      _TimelineStepDef(
        title: l10n.buyerOrderTrackStep4Title,
        description: l10n.buyerOrderTrackStep4Desc,
      ),
    ];

    final list = <Widget>[];
    for (int i = 0; i < steps.length; i++) {
      final isCompleted = currentStep >= 0 && i < currentStep;
      final isActive = currentStep >= 0 && i == currentStep;
      final isLast = i == steps.length - 1;

      // Determine date for this step
      String dateStr;
      if (isCompleted) {
        dateStr = formatDate(createdAt);
      } else if (isActive) {
        dateStr = formatDate(updatedAt);
      } else {
        dateStr = '-';
      }

      list.add(
        _buildTimelineStep(
          title: steps[i].title,
          date: dateStr,
          description: steps[i].description,
          isActive: isActive,
          isCompleted: isCompleted,
          isLast: isLast,
        ),
      );
    }
    return list;
  }

  Widget _buildTimelineStep({
    required String title,
    required String date,
    required String description,
    required bool isActive,
    required bool isCompleted,
    bool isLast = false,
  }) {
    Color nodeColor = isCompleted
        ? AppTheme.primaryColor
        : (isActive ? AppTheme.primaryColor : Colors.white24);

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline Node & Line
          Column(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: isActive && !isCompleted
                      ? AppTheme.primaryColor.withValues(alpha: 0.2)
                      : Colors.transparent,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: nodeColor,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: isCompleted
                        ? AppTheme.primaryColor
                        : Colors.white24,
                    margin: const EdgeInsets.symmetric(vertical: 4),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 16),
          // Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 32.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: TextStyle(
                            color:
                                isActive ? Colors.white : Colors.white54,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Text(
                        date,
                        style: TextStyle(
                          color: isActive
                              ? AppTheme.primaryColor
                              : Colors.white24,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    description,
                    style: const TextStyle(
                        color: Colors.white54, height: 1.5),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'payment_pending':
        return Colors.orangeAccent;
      case 'confirmed':
        return Colors.blueAccent;
      case 'processing':
        return AppTheme.primaryColor;
      case 'shipped':
        return Colors.lightBlueAccent;
      case 'delivered':
        return AppTheme.primaryColor;
      default:
        return Colors.white54;
    }
  }

  IconData _statusIcon(String status) {
    switch (status) {
      case 'payment_pending':
        return Icons.payment_outlined;
      case 'confirmed':
        return Icons.check_circle_outline;
      case 'processing':
        return Icons.inventory_2_outlined;
      case 'shipped':
        return Icons.local_shipping_outlined;
      case 'delivered':
        return Icons.check_circle;
      default:
        return Icons.info_outline;
    }
  }

  String _statusLabel(String status, AppLocalizations l10n) {
    switch (status) {
      case 'payment_pending':
        return 'Menunggu Pembayaran';
      case 'confirmed':
        return 'Pesanan Dikonfirmasi';
      case 'processing':
        return 'Sedang Diproses';
      case 'shipped':
        return 'Dalam Perjalanan';
      case 'delivered':
        return 'Pesanan Selesai';
      default:
        return status;
    }
  }

  String _monthName(int month) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
    ];
    return months[month - 1];
  }
}

class _TimelineStepDef {
  final String title;
  final String description;

  const _TimelineStepDef({
    required this.title,
    required this.description,
  });
}
