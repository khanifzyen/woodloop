import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/aggregator/domain/entities/pickup.dart';

void main() {
  group('Pickup', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final pickup = Pickup(
        id: 'p1', aggregatorId: 'agg1', wasteListingId: 'wl1',
        status: 'pending', created: now, updated: now,
      );
      expect(pickup.id, 'p1');
      expect(pickup.aggregatorId, 'agg1');
      expect(pickup.wasteListingId, 'wl1');
      expect(pickup.status, 'pending');
    });

    test('optional fields default correctly', () {
      final pickup = Pickup(
        id: 'p2', aggregatorId: 'agg2', wasteListingId: 'wl2',
        status: 'completed', created: now, updated: now,
      );
      expect(pickup.scheduledDate, isNull);
      expect(pickup.actualDate, isNull);
      expect(pickup.weightVerified, isNull);
      expect(pickup.pickupPhotos, []);
      expect(pickup.notes, isNull);
    });

    test('full construction with date and weight', () {
      final schedule = DateTime(2026, 5, 1);
      final pickup = Pickup(
        id: 'p3', aggregatorId: 'agg3', wasteListingId: 'wl3',
        scheduledDate: schedule, actualDate: now,
        status: 'completed', weightVerified: 45.5,
        pickupPhotos: ['proof.jpg'], notes: 'OK',
        created: now, updated: now,
      );
      expect(pickup.scheduledDate, schedule);
      expect(pickup.weightVerified, 45.5);
      expect(pickup.pickupPhotos, ['proof.jpg']);
      expect(pickup.notes, 'OK');
    });

    test('props includes all fields', () {
      final pickup = Pickup(
        id: 'p4', aggregatorId: 'agg4', wasteListingId: 'wl4',
        status: 'on_the_way', created: now, updated: now,
        pickupPhotos: ['a.jpg'],
      );
      expect(pickup.props.length, 11);
      expect(pickup.props[7], ['a.jpg']); // pickupPhotos
      expect(pickup.props[8], isNull); // notes
    });

    test('equality', () {
      final a = Pickup(
        id: 'x', aggregatorId: 'a', wasteListingId: 'w', status: 'pending',
        created: DateTime(2026, 1, 1), updated: DateTime(2026, 1, 1),
      );
      final b = Pickup(
        id: 'x', aggregatorId: 'a', wasteListingId: 'w', status: 'pending',
        created: DateTime(2026, 1, 1), updated: DateTime(2026, 1, 1),
      );
      expect(a, b);
    });
  });
}
