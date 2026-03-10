import 'dart:io';
import '../entities/supplier_dashboard_data.dart';
import '../entities/raw_timber_listing.dart';

abstract class SupplierRepository {
  Future<SupplierDashboardData> getDashboardData(
    String supplierId,
    String supplierName,
    String workshopName,
  );

  Future<List<RawTimberListing>> getListingsBySupplier(String supplierId);

  Future<void> updateListing(
    String id,
    Map<String, dynamic> body, {
    List<File>? newPhotos,
    File? newLegalityDoc,
  });

  Future<void> deleteListing(String listingId);

  Future<List<Map<String, dynamic>>> getWoodTypes();
}
