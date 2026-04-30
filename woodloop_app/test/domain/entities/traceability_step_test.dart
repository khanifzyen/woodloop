import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/traceability/domain/entities/traceability_step.dart';

void main() {
  group('TraceabilityStep', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final step = TraceabilityStep(
        role: 'supplier', entityName: 'Supplier A',
        title: 'Kayu Jati Dipanen', description: 'Hutan rakyat Jepara',
        date: now,
      );
      expect(step.role, 'supplier');
      expect(step.entityName, 'Supplier A');
      expect(step.title, 'Kayu Jati Dipanen');
      expect(step.description, 'Hutan rakyat Jepara');
      expect(step.date, now);
    });

    test('optional fields default correctly', () {
      final step = TraceabilityStep(
        role: 'generator', entityName: 'Generator B',
        title: 'Pengolahan', description: 'Produksi mebel',
        date: now,
      );
      expect(step.location, isNull);
      expect(step.isVerified, false);
    });

    test('full construction with location and verified', () {
      final step = TraceabilityStep(
        role: 'aggregator', entityName: 'Aggregator C',
        title: 'Pengangkutan', description: 'Dari generator ke gudang',
        date: now, location: 'Jepara', isVerified: true,
      );
      expect(step.location, 'Jepara');
      expect(step.isVerified, true);
    });

    test('props includes all fields', () {
      final step = TraceabilityStep(
        role: 'converter', entityName: 'Converter D',
        title: 'Produk Daur Ulang', description: 'Dibuat dari limbah',
        date: now,
      );
      expect(step.props.length, 7);
    });
  });

  group('TraceabilityData', () {
    test('creates with required fields', () {
      final step = TraceabilityStep(
        role: 'supplier', entityName: 'S', title: 'A', description: 'B',
        date: DateTime(2026, 1, 1),
      );
      final data = TraceabilityData(
        productId: 'pr1', productName: 'Kursi Daur Ulang',
        steps: [step],
      );
      expect(data.productId, 'pr1');
      expect(data.productName, 'Kursi Daur Ulang');
      expect(data.steps.length, 1);
    });

    test('optional fields default correctly', () {
      final data = TraceabilityData(
        productId: 'pr2', productName: 'Produk', steps: [],
      );
      expect(data.productCategory, isNull);
      expect(data.co2Saved, isNull);
      expect(data.wasteDiverted, isNull);
    });

    test('full construction with impact data', () {
      final step = TraceabilityStep(
        role: 'converter', entityName: 'C', title: 'T', description: 'D',
        date: DateTime(2026, 1, 1),
      );
      final data = TraceabilityData(
        productId: 'pr3', productName: 'Lengkap',
        productCategory: 'furniture', co2Saved: 75.0,
        wasteDiverted: 50.0, steps: [step],
      );
      expect(data.productCategory, 'furniture');
      expect(data.co2Saved, 75.0);
      expect(data.wasteDiverted, 50.0);
    });

    test('props includes all fields', () {
      final data = TraceabilityData(
        productId: 'pr4', productName: 'X', steps: [],
      );
      expect(data.props.length, 6);
    });

    test('equality', () {
      final step = TraceabilityStep(
        role: 'supplier', entityName: 'S', title: 'T', description: 'D',
        date: DateTime(2026, 1, 1),
      );
      final a = TraceabilityData(productId: 'x', productName: 'N', steps: [step]);
      final b = TraceabilityData(productId: 'x', productName: 'N', steps: [step]);
      expect(a, b);
    });
  });
}
