import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../../domain/entities/impact_metric.dart';
import '../../domain/repositories/impact_metric_repository.dart';

part 'enabler_dashboard_state.dart';

@injectable
class EnablerDashboardCubit extends Cubit<EnablerDashboardState> {
  final ImpactMetricRepository _impactMetricRepository;
  final PocketBase _pb;

  EnablerDashboardCubit(
    this._impactMetricRepository,
    this._pb,
  ) : super(EnablerDashboardInitial());

  Future<void> loadDashboard() async {
    emit(EnablerDashboardLoading());
    try {
      // Fetch impact metrics (aggregate)
      final metrics = await _impactMetricRepository.getImpactMetrics();

      // Aggregate totals
      double totalCo2Saved = 0;
      double totalWasteDiverted = 0;
      double totalEconomicValue = 0;
      for (final m in metrics) {
        totalCo2Saved += (m.co2Saved ?? 0);
        totalWasteDiverted += (m.wasteDiverted ?? 0);
        totalEconomicValue += (m.economicValue ?? 0);
      }

      // Count users by role
      int generatorCount = 0;
      int converterCount = 0;
      int aggregatorCount = 0;
      int buyerCount = 0;

      try {
        final usersResult = await _pb.collection('users').getList(
              perPage: 200,
              filter: '',
            );
        for (final record in usersResult.items) {
          final role = record.getStringValue('role');
          switch (role) {
            case 'generator':
              generatorCount++;
              break;
            case 'converter':
              converterCount++;
              break;
            case 'aggregator':
              aggregatorCount++;
              break;
            case 'buyer':
              buyerCount++;
              break;
          }
        }
      } catch (_) {
        // Ignore user count errors
      }

      // Count total transactions (pickups + orders)
      int transactionCount = 0;
      try {
        final pickupsResult = await _pb.collection('pickups').getList(
              perPage: 1,
              filter: '',
            );
        transactionCount += pickupsResult.totalItems;
      } catch (_) {}
      try {
        final ordersResult = await _pb.collection('orders').getList(
              perPage: 1,
              filter: '',
            );
        transactionCount += ordersResult.totalItems;
      } catch (_) {}

      // Count waste listings
      int wasteListingCount = 0;
      try {
        final wasteResult = await _pb.collection('waste_listings').getList(
              perPage: 1,
              filter: '',
            );
        wasteListingCount = wasteResult.totalItems;
      } catch (_) {}

      emit(EnablerDashboardLoaded(
        totalCo2Saved: totalCo2Saved,
        totalWasteDiverted: totalWasteDiverted,
        totalEconomicValue: totalEconomicValue,
        generatorCount: generatorCount,
        converterCount: converterCount,
        aggregatorCount: aggregatorCount,
        buyerCount: buyerCount,
        transactionCount: transactionCount,
        wasteListingCount: wasteListingCount,
        metrics: metrics,
      ));
    } catch (e) {
      emit(EnablerDashboardError(e.toString()));
    }
  }
}
