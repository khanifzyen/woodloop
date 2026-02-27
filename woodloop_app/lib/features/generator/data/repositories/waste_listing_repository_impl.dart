import 'package:injectable/injectable.dart';

import '../../domain/entities/waste_listing.dart';
import '../../domain/repositories/waste_listing_repository.dart';
import '../datasources/waste_listing_remote_data_source.dart';

@LazySingleton(as: WasteListingRepository)
class WasteListingRepositoryImpl implements WasteListingRepository {
  final WasteListingRemoteDataSource remoteDataSource;

  WasteListingRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<WasteListing>> getWasteListings({
    String? generatorId,
    String? status,
    int page = 1,
    int perPage = 30,
  }) async {
    return await remoteDataSource.getWasteListings(
      generatorId: generatorId,
      status: status,
      page: page,
      perPage: perPage,
    );
  }

  @override
  Future<WasteListing> getWasteListingById(String id) async {
    return await remoteDataSource.getWasteListingById(id);
  }

  @override
  Future<WasteListing> createWasteListing(Map<String, dynamic> body) async {
    return await remoteDataSource.createWasteListing(body);
  }

  @override
  Future<WasteListing> updateWasteListing(
    String id,
    Map<String, dynamic> body,
  ) async {
    return await remoteDataSource.updateWasteListing(id, body);
  }

  @override
  Future<void> deleteWasteListing(String id) async {
    await remoteDataSource.deleteWasteListing(id);
  }
}
