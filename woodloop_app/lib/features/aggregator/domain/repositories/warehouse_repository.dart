import '../entities/warehouse_item.dart';

abstract class WarehouseRepository {
  Future<List<WarehouseItem>> getWarehouseItems({
    String? aggregatorId,
    String? status,
    int page,
    int perPage,
  });

  Future<WarehouseItem> getWarehouseItemById(String id);
  Future<WarehouseItem> updateWarehouseItem(
    String id,
    Map<String, dynamic> body,
  );
}
