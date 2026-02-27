import 'package:injectable/injectable.dart';

import '../../domain/entities/pickup.dart';
import '../../domain/repositories/pickup_repository.dart';
import '../datasources/pickup_remote_data_source.dart';

@LazySingleton(as: PickupRepository)
class PickupRepositoryImpl implements PickupRepository {
  final PickupRemoteDataSource remoteDataSource;

  PickupRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<Pickup>> getPickups({
    String? aggregatorId,
    String? status,
    int page = 1,
    int perPage = 30,
  }) async {
    return await remoteDataSource.getPickups(
      aggregatorId: aggregatorId,
      status: status,
      page: page,
      perPage: perPage,
    );
  }

  @override
  Future<Pickup> getPickupById(String id) async {
    return await remoteDataSource.getPickupById(id);
  }

  @override
  Future<Pickup> createPickup(Map<String, dynamic> body) async {
    return await remoteDataSource.createPickup(body);
  }

  @override
  Future<Pickup> updatePickup(String id, Map<String, dynamic> body) async {
    return await remoteDataSource.updatePickup(id, body);
  }

  @override
  Future<void> deletePickup(String id) async {
    await remoteDataSource.deletePickup(id);
  }
}
