import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/aggregator/domain/entities/warehouse_item.dart';

void main() {
  group('WarehouseItem', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final item = WarehouseItem(
        id: 'wi1', aggregatorId: 'agg1', pickupId: 'p1',
        form: 'offcut_large', weight: 100, status: 'in_stock',
        created: now, updated: now,
      );
      expect(item.id, 'wi1');
      expect(item.aggregatorId, 'agg1');
      expect(item.pickupId, 'p1');
      expect(item.form, 'offcut_large');
      expect(item.weight, 100);
      expect(item.status, 'in_stock');
    });

    test('optional fields default correctly', () {
      final item = WarehouseItem(
        id: 'wi2', aggregatorId: 'agg2', pickupId: 'p2',
        form: 'sawdust', weight: 10, status: 'in_stock',
        created: now, updated: now,
      );
      expect(item.woodTypeId, isNull);
      expect(item.woodTypeName, isNull);
      expect(item.pricePerKg, isNull);
      expect(item.photos, []);
    });

    test('full construction with all optionals', () {
      final item = WarehouseItem(
        id: 'wi3', aggregatorId: 'agg3', pickupId: 'p3',
        woodTypeId: 'wt3', woodTypeName: 'Jati', form: 'offcut_small',
        weight: 45, pricePerKg: 5000, status: 'reserved',
        photos: ['warehouse.jpg'], created: now, updated: now,
      );
      expect(item.woodTypeName, 'Jati');
      expect(item.pricePerKg, 5000);
      expect(item.status, 'reserved');
      expect(item.photos, ['warehouse.jpg']);
    });

    test('props includes all fields', () {
      final item = WarehouseItem(
        id: 'wi4', aggregatorId: 'agg4', pickupId: 'p4',
        form: 'shaving', weight: 20, status: 'sold',
        created: now, updated: now,
      );
      expect(item.props.length, 12);
      expect(item.props[6], 20); // weight
      expect(item.props[8], 'sold'); // status
    });

    test('equality', () {
      final a = WarehouseItem(
        id: 'x', aggregatorId: 'a', pickupId: 'p', form: 'offcut_large',
        weight: 1, status: 'in_stock', created: DateTime(2026, 1, 1),
        updated: DateTime(2026, 1, 1),
      );
      final b = WarehouseItem(
        id: 'x', aggregatorId: 'a', pickupId: 'p', form: 'offcut_large',
        weight: 1, status: 'in_stock', created: DateTime(2026, 1, 1),
        updated: DateTime(2026, 1, 1),
      );
      expect(a, b);
    });
  });
}
