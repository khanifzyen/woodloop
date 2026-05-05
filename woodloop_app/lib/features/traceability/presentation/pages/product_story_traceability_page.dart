import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../presentation/bloc/traceability_bloc.dart';
import '../../domain/entities/traceability_step.dart';
import '../../../../injection_container.dart';

class ProductStoryTraceabilityPage extends StatelessWidget {
  final String? productId;

  const ProductStoryTraceabilityPage({super.key, this.productId});

  @override
  Widget build(BuildContext context) {
    if (productId != null && productId!.isNotEmpty) {
      return BlocProvider(
        create: (context) {
          final bloc = getIt<TraceabilityBloc>();
          bloc.add(LoadTraceability(productId!));
          return bloc;
        },
        child: const _TraceabilityContent(),
      );
    }
    return const _TraceabilityContent();
  }
}

class _TraceabilityContent extends StatelessWidget {
  const _TraceabilityContent();

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final bloc = context.watch<TraceabilityBloc>();
    final state = bloc.state;

    String productName = l10n.traceabilityMockProduct;
    String productCategory = l10n.traceabilityCategoryMock;
    double co2Saved = 12.0;
    double wasteDiverted = 5.0;
    List<TraceabilityStep> steps = [];
    bool isLoading = false;
    String? errorMsg;

    if (state is TraceabilityLoading) {
      isLoading = true;
    } else if (state is TraceabilityLoaded) {
      productName = state.data.productName;
      productCategory = state.data.productCategory ?? productCategory;
      co2Saved = state.data.co2Saved ?? co2Saved;
      wasteDiverted = state.data.wasteDiverted ?? wasteDiverted;
      steps = state.data.steps;
    } else if (state is TraceabilityError) {
      errorMsg = state.message;
    }

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Stack(
        children: [
          if (isLoading)
            const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor))
          else if (errorMsg != null)
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.error_outline, color: Colors.redAccent, size: 48),
                  const SizedBox(height: 16),
                  Text(errorMsg!, style: const TextStyle(color: Colors.white70)),
                ],
              ),
            )
          else
            CustomScrollView(
              slivers: [
                // Top App Bar & Hero
                SliverAppBar(
                  expandedHeight: 280.0,
                  floating: false,
                  pinned: true,
                  leading: IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () => context.canPop() ? context.pop() : null,
                  ),
                  title: Text(l10n.traceabilityTitle,
                    style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  centerTitle: true,
                  backgroundColor: AppTheme.background.withValues(alpha: 0.8),
                  flexibleSpace: FlexibleSpaceBar(
                    background: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.asset('assets/images/map_jepara.jpg', fit: BoxFit.cover),
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                AppTheme.background.withValues(alpha: 0.0),
                                AppTheme.background.withValues(alpha: 0.5),
                                AppTheme.background,
                              ],
                              stops: const [0.5, 0.8, 1.0],
                            ),
                          ),
                        ),
                        Positioned(
                          bottom: 16, left: 24, right: 24,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryColor.withValues(alpha: 0.2),
                                  border: Border.all(color: AppTheme.primaryColor.withValues(alpha: 0.3)),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(productCategory,
                                  style: const TextStyle(color: AppTheme.primaryColor, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                              ),
                              const SizedBox(height: 8),
                              Text(productName,
                                style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold, height: 1.1)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 100.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Impact Metrics
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(children: [
                                const Icon(Icons.eco, color: AppTheme.primaryColor, size: 20),
                                const SizedBox(width: 8),
                                Text(l10n.traceabilityImpactMetrics,
                                  style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                              ]),
                              const SizedBox(height: 16),
                              Row(children: [
                                Expanded(
                                  child: _MetricCard(
                                    icon: Icons.co2,
                                    value: '${co2Saved.toStringAsFixed(1)} kg',
                                    label: l10n.traceabilityCO2Offset,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: _MetricCard(
                                    icon: Icons.recycling,
                                    value: '${wasteDiverted.toStringAsFixed(1)} kg',
                                    label: l10n.traceabilityWasteDiverted,
                                  ),
                                ),
                              ]),
                            ],
                          ),
                        ),

                        // Journey Timeline
                        Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(l10n.traceabilityJourney,
                                style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 24),
                              if (steps.isEmpty)
                                const Text('Belum ada data jejak untuk produk ini.',
                                  style: TextStyle(color: Colors.white54, fontSize: 13))
                              else
                                ...steps.asMap().entries.map((entry) {
                                  final idx = entry.key;
                                  final step = entry.value;
                                  final isLast = idx == steps.length - 1;
                                  return _TimelineStep(
                                    step: step,
                                    isLast: isLast,
                                    isActive: isLast,
                                  );
                                }),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  const _MetricCard({required this.icon, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(children: [
        Icon(icon, color: AppTheme.primaryColor, size: 32),
        const SizedBox(height: 8),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
        Text(label, style: const TextStyle(color: Colors.white54, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
      ]),
    );
  }
}

class _TimelineStep extends StatelessWidget {
  final TraceabilityStep step;
  final bool isLast;
  final bool isActive;

  const _TimelineStep({required this.step, required this.isLast, this.isActive = false});

  IconData _roleIcon() {
    switch (step.role) {
      case 'supplier': return Icons.forest;
      case 'generator': return Icons.carpenter;
      case 'aggregator': return Icons.local_shipping;
      case 'converter': return Icons.handyman;
      default: return Icons.circle;
    }
  }

  @override
  Widget build(BuildContext context) {
    final dateStr = '${step.date.year}-${step.date.month.toString().padLeft(2, '0')}-${step.date.day.toString().padLeft(2, '0')}';

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(children: [
            Container(
              width: 40, height: 40,
              decoration: BoxDecoration(
                color: isActive ? AppTheme.primaryColor : AppTheme.surfaceColor,
                shape: BoxShape.circle,
                border: Border.all(color: AppTheme.primaryColor, width: 2),
              ),
              child: Icon(_roleIcon(), color: isActive ? AppTheme.background : AppTheme.primaryColor, size: 20),
            ),
            if (!isLast)
              Expanded(
                child: Container(
                  width: 2,
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  color: AppTheme.primaryColor.withValues(alpha: 0.5),
                ),
              ),
          ]),
          const SizedBox(width: 16),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 32.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Text(step.title.toUpperCase(),
                      style: const TextStyle(color: AppTheme.primaryColor, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                    Text(dateStr, style: const TextStyle(color: Colors.white38, fontSize: 10)),
                  ]),
                  const SizedBox(height: 4),
                  Text(step.entityName,
                    style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(step.description, style: const TextStyle(color: Colors.white54, fontSize: 13, height: 1.5)),
                  if (step.location != null) ...[
                    const SizedBox(height: 4),
                    Row(children: [
                      const Icon(Icons.location_on, color: Colors.white38, size: 12),
                      const SizedBox(width: 4),
                      Text(step.location!, style: const TextStyle(color: Colors.white38, fontSize: 11)),
                    ]),
                  ],
                  if (step.isVerified)
                    Container(
                      margin: const EdgeInsets.only(top: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.green.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Row(mainAxisSize: MainAxisSize.min, children: [
                        Icon(Icons.check_circle, color: Colors.green, size: 12),
                        SizedBox(width: 4),
                        Text('Terverifikasi', style: TextStyle(color: Colors.green, fontSize: 10, fontWeight: FontWeight.w600)),
                      ]),
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
