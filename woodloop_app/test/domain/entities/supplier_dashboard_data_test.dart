import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/supplier/domain/entities/supplier_dashboard_data.dart';
import 'package:woodloop_app/features/supplier/domain/entities/raw_timber_listing.dart';

void main() {
  group('SupplierDashboardData', () {
    final now = DateTime(2026, 4, 28);
    final listing = RawTimberListing(
      id: 'rt', supplierId: 's', woodTypeId: 'w', woodTypeName: 'Jati',
      shape: 'log', volume: 2, price: 5000000, unit: 'm3', status: 'available',
      updatedAt: now,
    );

    test('creates with required fields', () {
      const data = SupplierDashboardData(
        supplierName: 'Supplier A',
        workshopName: 'Workshop A',
        monthlyRevenue: 50000000,
        totalStock: 10.5,
        activeListings: 5,
        recentSales: [],
      );
      expect(data.supplierName, 'Supplier A');
      expect(data.workshopName, 'Workshop A');
      expect(data.monthlyRevenue, 50000000);
      expect(data.totalStock, 10.5);
      expect(data.activeListings, 5);
      expect(data.recentSales, []);
    });

    test('creates with recent sales list', () {
      final data = SupplierDashboardData(
        supplierName: 'B',
        workshopName: 'WB',
        monthlyRevenue: 10000000,
        totalStock: 3.0,
        activeListings: 2,
        recentSales: [listing],
      );
      expect(data.recentSales.length, 1);
      expect(data.recentSales.first, listing);
    });

    test('props includes recentSales', () {
      final data = SupplierDashboardData(
        supplierName: 'C', workshopName: 'WC', monthlyRevenue: 0,
        totalStock: 0, activeListings: 0, recentSales: [listing],
      );
      expect(data.props[5], [listing]);
    });

    test('equality', () {
      const a = SupplierDashboardData(
        supplierName: 'X', workshopName: 'Y', monthlyRevenue: 1,
        totalStock: 2, activeListings: 3, recentSales: [],
      );
      const b = SupplierDashboardData(
        supplierName: 'X', workshopName: 'Y', monthlyRevenue: 1,
        totalStock: 2, activeListings: 3, recentSales: [],
      );
      expect(a, b);
    });
  });
}
