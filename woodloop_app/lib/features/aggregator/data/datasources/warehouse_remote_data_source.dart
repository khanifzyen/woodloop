import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/warehouse_item_model.dart';

abstract class WarehouseRemoteDataSource {
  Future<List<WarehouseItemModel>> getWarehouseItems({
    String? aggregatorId,
    String? status,
    int page = 1,
    int perPage = 30,
  });

  Future<WarehouseItemModel> getWarehouseItemById(String id);
  Future<WarehouseItemModel> updateWarehouseItem(
    String id,
    Map<String, dynamic> body,
  );
}

@LazySingleton(as: WarehouseRemoteDataSource)
class WarehouseRemoteDataSourceImpl implements WarehouseRemoteDataSource {
  final PocketBase pb;

  WarehouseRemoteDataSourceImpl(this.pb);

  @override
  Future<List<WarehouseItemModel>> getWarehouseItems({
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
        .collection('warehouse_inventory')
        .getList(
          page: page,
          perPage: perPage,
          filter: filters.isNotEmpty ? filters.join(' && ') : '',
          sort: '-created',
          expand: 'wood_type',
        );

    return result.items
        .map((record) => WarehouseItemModel.fromRecord(record))
        .toList();
  }

  @override
  Future<WarehouseItemModel> getWarehouseItemById(String id) async {
    final record = await pb
        .collection('warehouse_inventory')
        .getOne(id, expand: 'wood_type');
    return WarehouseItemModel.fromRecord(record);
  }

  @override
  Future<WarehouseItemModel> updateWarehouseItem(
    String id,
    Map<String, dynamic> body,
  ) async {
    final record = await pb
        .collection('warehouse_inventory')
        .update(id, body: body);
    return WarehouseItemModel.fromRecord(record);
  }
}
