import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/raw_timber_listing.dart';
import '../../domain/entities/supplier_dashboard_data.dart';
import '../models/raw_timber_listing_model.dart';

abstract class SupplierRemoteDataSource {
  Future<SupplierDashboardData> getDashboardData(
    String supplierId,
    String supplierName,
    String workshopName,
  );
}

@LazySingleton(as: SupplierRemoteDataSource)
class SupplierRemoteDataSourceImpl implements SupplierRemoteDataSource {
  final PocketBase pb;

  SupplierRemoteDataSourceImpl(this.pb);

  @override
  Future<SupplierDashboardData> getDashboardData(
    String supplierId,
    String supplierName,
    String workshopName,
  ) async {
    // Fetch all listings for this supplier (max 200 for aggregation)
    final result = await pb
        .collection('raw_timber_listings')
        .getList(
          page: 1,
          perPage: 200,
          filter: 'supplier = "$supplierId"',
          expand: 'wood_type',
          sort: '-updated',
        );

    final allListings = result.items
        .map((r) => RawTimberListingModel.fromRecord(r))
        .toList();

    // Calculate metrics
    final now = DateTime.now();
    final startOfMonth = DateTime(now.year, now.month, 1);

    double monthlyRevenue = 0;
    double totalStock = 0;
    int activeListings = 0;
    final List<RawTimberListing> recentSales = [];

    for (final listing in allListings) {
      if (listing.isAvailable) {
        totalStock += listing.volume;
        activeListings++;
      } else if (listing.isSold) {
        // Revenue from this month
        if (listing.updatedAt.isAfter(startOfMonth)) {
          monthlyRevenue += listing.price;
        }
        // Recent sales (max 10)
        if (recentSales.length < 10) {
          recentSales.add(listing);
        }
      }
    }

    return SupplierDashboardData(
      supplierName: supplierName,
      workshopName: workshopName,
      monthlyRevenue: monthlyRevenue,
      totalStock: totalStock,
      activeListings: activeListings,
      recentSales: recentSales,
    );
  }
}
