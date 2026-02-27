import 'package:injectable/injectable.dart';

import '../../domain/entities/warehouse_item.dart';
import '../../domain/repositories/warehouse_repository.dart';
import '../datasources/warehouse_remote_data_source.dart';

@LazySingleton(as: WarehouseRepository)
class WarehouseRepositoryImpl implements WarehouseRepository {
  final WarehouseRemoteDataSource remoteDataSource;

  WarehouseRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<WarehouseItem>> getWarehouseItems({
    String? aggregatorId,
    String? status,
    int page = 1,
    int perPage = 30,
  }) async {
    return await remoteDataSource.getWarehouseItems(
      aggregatorId: aggregatorId,
      status: status,
      page: page,
      perPage: perPage,
    );
  }

  @override
  Future<WarehouseItem> getWarehouseItemById(String id) async {
    return await remoteDataSource.getWarehouseItemById(id);
  }

  @override
  Future<WarehouseItem> updateWarehouseItem(
    String id,
    Map<String, dynamic> body,
  ) async {
    return await remoteDataSource.updateWarehouseItem(id, body);
  }
}
