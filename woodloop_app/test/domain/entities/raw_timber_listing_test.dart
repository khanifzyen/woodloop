import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/supplier/domain/entities/raw_timber_listing.dart';

void main() {
  group('RawTimberListing', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final listing = RawTimberListing(
        id: 'rt1',
        supplierId: 'sup1',
        woodTypeId: 'wt1',
        woodTypeName: 'Jati',
        shape: 'log',
        volume: 2.5,
        price: 5000000,
        unit: 'm3',
        status: 'available',
        updatedAt: now,
      );
      expect(listing.id, 'rt1');
      expect(listing.supplierId, 'sup1');
      expect(listing.woodTypeName, 'Jati');
      expect(listing.shape, 'log');
      expect(listing.volume, 2.5);
      expect(listing.price, 5000000);
      expect(listing.unit, 'm3');
      expect(listing.status, 'available');
    });

    test('optional fields default correctly', () {
      final listing = RawTimberListing(
        id: 'rt2',
        supplierId: 'sup2',
        woodTypeId: 'wt2',
        woodTypeName: 'Mahoni',
        shape: 'sawn',
        volume: 1.0,
        price: 100000,
        unit: 'm3',
        status: 'available',
        updatedAt: now,
      );
      expect(listing.diameter, isNull);
      expect(listing.width, isNull);
      expect(listing.height, isNull);
      expect(listing.length, isNull);
      expect(listing.photos, []);
      expect(listing.legalityDoc, isNull);
      expect(listing.trackingId, isNull);
    });

    test('isSold returns true when status is sold', () {
      final listing = RawTimberListing(
        id: 'rt3',
        supplierId: 'sup3',
        woodTypeId: 'wt3',
        woodTypeName: 'Trembesi',
        shape: 'log',
        volume: 3.0,
        price: 7000000,
        unit: 'm3',
        status: 'sold',
        updatedAt: now,
      );
      expect(listing.isSold, true);
      expect(listing.isAvailable, false);
    });

    test('isAvailable returns true when status is available', () {
      final listing = RawTimberListing(
        id: 'rt4',
        supplierId: 'sup4',
        woodTypeId: 'wt4',
        woodTypeName: 'Pinus',
        shape: 'sawn',
        volume: 0.5,
        price: 500000,
        unit: 'batang',
        status: 'available',
        updatedAt: now,
      );
      expect(listing.isAvailable, true);
      expect(listing.isSold, false);
    });

    test('props includes all fields', () {
      final listing = RawTimberListing(
        id: 'rt5',
        supplierId: 'sup5',
        woodTypeId: 'wt5',
        woodTypeName: 'Akasia',
        shape: 'log',
        volume: 4.0,
        price: 8000000,
        unit: 'm3',
        status: 'available',
        diameter: 30,
        length: 200,
        photos: ['a.jpg'],
        legalityDoc: 'svlk.pdf',
        trackingId: 'LOG-SUP5X-260428-A7X',
        updatedAt: now,
      );
      expect(listing.props.length, 18);
      expect(listing.props[0], 'rt5');
      expect(listing.props[13], ['a.jpg']);
      expect(listing.props[14], 'svlk.pdf');
      expect(listing.props[15], 'LOG-SUP5X-260428-A7X');
    });

    test('equality', () {
      final a = RawTimberListing(
        id: 'x', supplierId: 's', woodTypeId: 'w', woodTypeName: 'Jati',
        shape: 'log', volume: 1, price: 1, unit: 'm3', status: 'available',
        updatedAt: DateTime(2026, 1, 1),
      );
      final b = RawTimberListing(
        id: 'x', supplierId: 's', woodTypeId: 'w', woodTypeName: 'Jati',
        shape: 'log', volume: 1, price: 1, unit: 'm3', status: 'available',
        updatedAt: DateTime(2026, 1, 1),
      );
      expect(a, b);
    });
  });
}
