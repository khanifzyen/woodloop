import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/waste_listing_model.dart';

abstract class WasteListingRemoteDataSource {
  Future<List<WasteListingModel>> getWasteListings({
    String? generatorId,
    String? status,
    int page = 1,
    int perPage = 30,
  });

  Future<WasteListingModel> getWasteListingById(String id);

  Future<WasteListingModel> createWasteListing(Map<String, dynamic> body);

  Future<WasteListingModel> updateWasteListing(
    String id,
    Map<String, dynamic> body,
  );

  Future<void> deleteWasteListing(String id);
}

@LazySingleton(as: WasteListingRemoteDataSource)
class WasteListingRemoteDataSourceImpl implements WasteListingRemoteDataSource {
  final PocketBase pb;

  WasteListingRemoteDataSourceImpl(this.pb);

  @override
  Future<List<WasteListingModel>> getWasteListings({
    String? generatorId,
    String? status,
    int page = 1,
    int perPage = 30,
  }) async {
    String filter = '';
    final filters = <String>[];

    if (generatorId != null && generatorId.isNotEmpty) {
      filters.add('generator = "$generatorId"');
    }
    if (status != null && status.isNotEmpty) {
      filters.add('status = "$status"');
    }

    if (filters.isNotEmpty) {
      filter = filters.join(' && ');
    }

    final result = await pb
        .collection('waste_listings')
        .getList(
          page: page,
          perPage: perPage,
          filter: filter,
          sort: '-created',
          expand: 'wood_type',
        );

    return result.items
        .map((record) => WasteListingModel.fromRecord(record))
        .toList();
  }

  @override
  Future<WasteListingModel> getWasteListingById(String id) async {
    final record = await pb
        .collection('waste_listings')
        .getOne(id, expand: 'wood_type');
    return WasteListingModel.fromRecord(record);
  }

  @override
  Future<WasteListingModel> createWasteListing(
    Map<String, dynamic> body,
  ) async {
    final record = await pb.collection('waste_listings').create(body: body);
    return WasteListingModel.fromRecord(record);
  }

  @override
  Future<WasteListingModel> updateWasteListing(
    String id,
    Map<String, dynamic> body,
  ) async {
    final record = await pb.collection('waste_listings').update(id, body: body);
    return WasteListingModel.fromRecord(record);
  }

  @override
  Future<void> deleteWasteListing(String id) async {
    await pb.collection('waste_listings').delete(id);
  }
}
