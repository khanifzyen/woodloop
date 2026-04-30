import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/generator/domain/entities/waste_listing.dart';

void main() {
  group('WasteListing', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final listing = WasteListing(
        id: 'wl1', generatorId: 'gen1', woodTypeId: 'wt1',
        form: 'offcut_large', condition: 'dry', volume: 50,
        unit: 'kg', status: 'available', created: now, updated: now,
      );
      expect(listing.id, 'wl1');
      expect(listing.generatorId, 'gen1');
      expect(listing.form, 'offcut_large');
      expect(listing.condition, 'dry');
      expect(listing.volume, 50);
      expect(listing.unit, 'kg');
      expect(listing.status, 'available');
    });

    test('optional fields default correctly', () {
      final listing = WasteListing(
        id: 'wl2', generatorId: 'gen2', woodTypeId: 'wt2',
        form: 'sawdust', condition: 'wet', volume: 5,
        unit: 'sack', status: 'booked', created: now, updated: now,
      );
      expect(listing.woodTypeName, isNull);
      expect(listing.photos, []);
      expect(listing.priceEstimate, 0);
      expect(listing.description, isNull);
    });

    test('supports full construction with all optionals', () {
      final listing = WasteListing(
        id: 'wl3', generatorId: 'gen3', woodTypeId: 'wt3',
        woodTypeName: 'Jati', form: 'offcut_small', condition: 'oiled',
        volume: 10, unit: 'kg', photos: ['waste.jpg'],
        priceEstimate: 50000, status: 'collected',
        description: 'Sisa produksi kursi', created: now, updated: now,
      );
      expect(listing.woodTypeName, 'Jati');
      expect(listing.photos, ['waste.jpg']);
      expect(listing.priceEstimate, 50000);
      expect(listing.description, 'Sisa produksi kursi');
      expect(listing.status, 'collected');
    });

    test('props includes all fields', () {
      final listing = WasteListing(
        id: 'wl4', generatorId: 'gen4', woodTypeId: 'wt4',
        form: 'logs_end', condition: 'mixed', volume: 100,
        unit: 'm3', status: 'sold', created: now, updated: now,
        woodTypeName: 'Mahoni', photos: ['a.jpg', 'b.jpg'],
        priceEstimate: 200000, description: 'Log ends',
      );
      expect(listing.props.length, 14);
      expect(listing.props[0], 'wl4');
      expect(listing.props[8], ['a.jpg', 'b.jpg']);
      expect(listing.props[9], 200000);
      expect(listing.props[10], 'sold');
    });

    test('equality', () {
      final now = DateTime(2026, 1, 1);
      final a = WasteListing(
        id: 'x', generatorId: 'g', woodTypeId: 'w', form: 'offcut_large',
        condition: 'dry', volume: 1, unit: 'kg', status: 'available',
        created: now, updated: now,
      );
      final b = WasteListing(
        id: 'x', generatorId: 'g', woodTypeId: 'w', form: 'offcut_large',
        condition: 'dry', volume: 1, unit: 'kg', status: 'available',
        created: now, updated: now,
      );
      expect(a, b);
    });
  });
}
