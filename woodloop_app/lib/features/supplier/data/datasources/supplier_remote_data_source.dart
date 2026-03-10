import 'dart:io';
import 'package:http/http.dart' as http;
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

  Future<RawTimberListing> createListing({
    required String supplierId,
    required String woodTypeId,
    required String shape,
    double? diameter,
    double? thickness,
    double? width,
    double? length,
    required double volume,
    required double price,
    required String unit,
    required String status, // 'draft' or 'published'
    required List<File> photos,
    File? legalityDoc,
  });

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

  @override
  Future<RawTimberListing> createListing({
    required String supplierId,
    required String woodTypeId,
    required String shape,
    double? diameter,
    double? thickness,
    double? width,
    double? length,
    required double volume,
    required double price,
    required String unit,
    required String status,
    required List<File> photos,
    File? legalityDoc,
  }) async {
    final body = <String, dynamic>{
      'supplier': supplierId,
      'wood_type': woodTypeId,
      'shape': shape,
      'diameter': diameter,
      'height': thickness, // maps to `height` in DB
      'width': width,
      'length': length,
      'volume': volume,
      'price': price,
      'unit': unit,
      'status': status,
    };

    final files = <http.MultipartFile>[
      for (final f in photos)
        await http.MultipartFile.fromPath('photos', f.path),
      if (legalityDoc != null)
        await http.MultipartFile.fromPath('legality_doc', legalityDoc.path),
    ];

    final record = await pb
        .collection('raw_timber_listings')
        .create(body: body, files: files);

    return RawTimberListingModel.fromRecord(record);
  }

  @override
  Future<List<RawTimberListing>> getListingsBySupplier(
    String supplierId,
  ) async {
    final result = await pb
        .collection('raw_timber_listings')
        .getList(
          page: 1,
          perPage: 500,
          filter: 'supplier = "$supplierId"',
          expand: 'wood_type',
          sort: '-updated',
        );

    return result.items
        .map((r) => RawTimberListingModel.fromRecord(r))
        .toList();
  }

  @override
  Future<void> deleteListing(String listingId) async {
    await pb.collection('raw_timber_listings').delete(listingId);
  }

  @override
  Future<void> updateListing(
    String id,
    Map<String, dynamic> body, {
    List<File>? newPhotos,
    File? newLegalityDoc,
  }) async {
    final authRecord = pb.authStore.record;
    if (authRecord == null) {
      throw Exception('User is not authenticated');
    }

    final files = <http.MultipartFile>[];
    if (newPhotos != null) {
      for (final f in newPhotos) {
        files.add(await http.MultipartFile.fromPath('photos', f.path));
      }
    }
    if (newLegalityDoc != null) {
      files.add(
        await http.MultipartFile.fromPath('legality_doc', newLegalityDoc.path),
      );
    }

    await pb
        .collection('raw_timber_listings')
        .update(id, body: body, files: files);
  }

  @override
  Future<List<Map<String, dynamic>>> getWoodTypes() async {
    final result = await pb.collection('wood_types').getFullList(sort: 'name');
    return result.map((r) => r.toJson()).toList();
  }
}
