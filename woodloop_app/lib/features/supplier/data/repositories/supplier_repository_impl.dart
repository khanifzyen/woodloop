import 'dart:io';
import 'package:injectable/injectable.dart';
import '../../domain/entities/supplier_dashboard_data.dart';
import '../../domain/entities/raw_timber_listing.dart';
import '../../domain/repositories/supplier_repository.dart';
import '../datasources/supplier_remote_data_source.dart';

@LazySingleton(as: SupplierRepository)
class SupplierRepositoryImpl implements SupplierRepository {
  final SupplierRemoteDataSource remoteDataSource;

  SupplierRepositoryImpl(this.remoteDataSource);

  @override
  Future<SupplierDashboardData> getDashboardData(
    String supplierId,
    String supplierName,
    String workshopName,
  ) async {
    return await remoteDataSource.getDashboardData(
      supplierId,
      supplierName,
      workshopName,
    );
  }

  @override
  Future<List<RawTimberListing>> getListingsBySupplier(
    String supplierId,
  ) async {
    return await remoteDataSource.getListingsBySupplier(supplierId);
  }

  @override
  Future<void> updateListing(
    String id,
    Map<String, dynamic> body, {
    List<File>? newPhotos,
    File? newLegalityDoc,
  }) async {
    return await remoteDataSource.updateListing(
      id,
      body,
      newPhotos: newPhotos,
      newLegalityDoc: newLegalityDoc,
    );
  }

  @override
  Future<void> deleteListing(String listingId) async {
    return await remoteDataSource.deleteListing(listingId);
  }

  @override
  Future<List<Map<String, dynamic>>> getWoodTypes() async {
    return await remoteDataSource.getWoodTypes();
  }
}
