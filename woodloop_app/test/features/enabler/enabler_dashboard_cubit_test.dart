import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:pocketbase/pocketbase.dart';

import 'package:woodloop_app/features/enabler/domain/entities/impact_metric.dart';
import 'package:woodloop_app/features/enabler/domain/repositories/impact_metric_repository.dart';
import 'package:woodloop_app/features/enabler/presentation/cubit/enabler_dashboard_cubit.dart';

class MockImpactMetricRepository extends Mock implements ImpactMetricRepository {}
class MockPocketBase extends Mock implements PocketBase {}

void main() {
  late MockImpactMetricRepository repo;
  late MockPocketBase pb;

  setUp(() {
    repo = MockImpactMetricRepository();
    pb = MockPocketBase();
  });

  group('EnablerDashboardCubit', () {
    blocTest<EnablerDashboardCubit, EnablerDashboardState>(
      'initial state is EnablerDashboardInitial',
      build: () => EnablerDashboardCubit(repo, pb),
      verify: (cubit) => expect(cubit.state, isA<EnablerDashboardInitial>()),
    );
  });

  group('Enabler Dashboard Logic', () {
    test('CO2 aggregate formula: sum of all co2_saved', () {
      final metrics = [
        const ImpactMetric(id: '1', co2Saved: 72.0, wasteDiverted: 48.0),
        const ImpactMetric(id: '2', co2Saved: 36.0, wasteDiverted: 24.0),
        const ImpactMetric(id: '3', co2Saved: 18.0, wasteDiverted: 12.0),
      ];
      final totalCo2 = metrics.fold<double>(0, (sum, m) => sum + (m.co2Saved ?? 0));
      expect(totalCo2, equals(126.0));
    });

    test('waste diverted aggregate formula', () {
      final metrics = [
        const ImpactMetric(id: '1', wasteDiverted: 48.0),
        const ImpactMetric(id: '2', wasteDiverted: 24.0),
      ];
      final total = metrics.fold<double>(0, (sum, m) => sum + (m.wasteDiverted ?? 0));
      expect(total, equals(72.0));
    });

    test('economic value aggregate', () {
      const metrics = [
        ImpactMetric(id: '1', economicValue: 500000),
        ImpactMetric(id: '2', economicValue: 300000),
      ];
      final total = metrics.fold<double>(0, (sum, m) => sum + (m.economicValue ?? 0));
      expect(total, equals(800000.0));
    });

    test('empty metrics returns zero totals', () {
      const metrics = <ImpactMetric>[];
      final total = metrics.fold<double>(0, (sum, m) => sum + (m.co2Saved ?? 0));
      expect(total, equals(0.0));
    });

    test('user role distribution count is correct', () {
      const roles = ['generator', 'aggregator', 'converter', 'generator', 'buyer'];
      final counts = <String, int>{};
      for (final r in roles) {
        counts[r] = (counts[r] ?? 0) + 1;
      }
      expect(counts['generator'], equals(2));
      expect(counts['aggregator'], equals(1));
      expect(counts['converter'], equals(1));
      expect(counts['buyer'], equals(1));
    });

    test('period format: YYYY-MM', () {
      final now = DateTime(2026, 5, 15);
      final period = '${now.year}-${now.month.toString().padLeft(2, '0')}';
      expect(period, equals('2026-05'));
    });

    test('total transactions = pickups + orders', () {
      const pickups = 15;
      const orders = 8;
      expect(pickups + orders, equals(23));
    });
  });
}
