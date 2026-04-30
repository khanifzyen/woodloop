part of 'enabler_dashboard_cubit.dart';

abstract class EnablerDashboardState extends Equatable {
  const EnablerDashboardState();

  @override
  List<Object?> get props => [];
}

class EnablerDashboardInitial extends EnablerDashboardState {}

class EnablerDashboardLoading extends EnablerDashboardState {}

class EnablerDashboardLoaded extends EnablerDashboardState {
  final double totalCo2Saved;
  final double totalWasteDiverted;
  final double totalEconomicValue;
  final int generatorCount;
  final int converterCount;
  final int aggregatorCount;
  final int buyerCount;
  final int transactionCount;
  final int wasteListingCount;
  final List<ImpactMetric> metrics;

  const EnablerDashboardLoaded({
    required this.totalCo2Saved,
    required this.totalWasteDiverted,
    required this.totalEconomicValue,
    required this.generatorCount,
    required this.converterCount,
    required this.aggregatorCount,
    required this.buyerCount,
    required this.transactionCount,
    required this.wasteListingCount,
    required this.metrics,
  });

  int get totalUsers =>
      generatorCount + converterCount + aggregatorCount + buyerCount;

  @override
  List<Object?> get props => [
        totalCo2Saved,
        totalWasteDiverted,
        totalEconomicValue,
        generatorCount,
        converterCount,
        aggregatorCount,
        buyerCount,
        transactionCount,
        wasteListingCount,
        metrics,
      ];
}

class EnablerDashboardError extends EnablerDashboardState {
  final String message;

  const EnablerDashboardError(this.message);

  @override
  List<Object?> get props => [message];
}
