import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/pickup_model.dart';

abstract class PickupRemoteDataSource {
  Future<List<PickupModel>> getPickups({
    String? aggregatorId,
    String? status,
    int page = 1,
    int perPage = 30,
  });

  Future<PickupModel> getPickupById(String id);
  Future<PickupModel> createPickup(Map<String, dynamic> body);
  Future<PickupModel> updatePickup(String id, Map<String, dynamic> body);
  Future<void> deletePickup(String id);
}

@LazySingleton(as: PickupRemoteDataSource)
class PickupRemoteDataSourceImpl implements PickupRemoteDataSource {
  final PocketBase pb;

  PickupRemoteDataSourceImpl(this.pb);

  @override
  Future<List<PickupModel>> getPickups({
    String? aggregatorId,
    String? status,
    int page = 1,
    int perPage = 30,
  }) async {
    final filters = <String>[];
    if (aggregatorId != null && aggregatorId.isNotEmpty) {
      filters.add('aggregator = "$aggregatorId"');
    }
    if (status != null && status.isNotEmpty) {
      filters.add('status = "$status"');
    }

    final result = await pb
        .collection('pickups')
        .getList(
          page: page,
          perPage: perPage,
          filter: filters.isNotEmpty ? filters.join(' && ') : '',
          sort: '-created',
          expand: 'waste_listing',
        );

    return result.items
        .map((record) => PickupModel.fromRecord(record))
        .toList();
  }

  @override
  Future<PickupModel> getPickupById(String id) async {
    final record = await pb
        .collection('pickups')
        .getOne(id, expand: 'waste_listing');
    return PickupModel.fromRecord(record);
  }

  @override
  Future<PickupModel> createPickup(Map<String, dynamic> body) async {
    final record = await pb.collection('pickups').create(body: body);
    return PickupModel.fromRecord(record);
  }

  @override
  Future<PickupModel> updatePickup(String id, Map<String, dynamic> body) async {
    final record = await pb.collection('pickups').update(id, body: body);
    return PickupModel.fromRecord(record);
  }

  @override
  Future<void> deletePickup(String id) async {
    await pb.collection('pickups').delete(id);
  }
}
