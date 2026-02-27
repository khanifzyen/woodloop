import '../entities/waste_listing.dart';

abstract class WasteListingRepository {
  Future<List<WasteListing>> getWasteListings({
    String? generatorId,
    String? status,
    int page,
    int perPage,
  });

  Future<WasteListing> getWasteListingById(String id);

  Future<WasteListing> createWasteListing(Map<String, dynamic> body);

  Future<WasteListing> updateWasteListing(String id, Map<String, dynamic> body);

  Future<void> deleteWasteListing(String id);
}
