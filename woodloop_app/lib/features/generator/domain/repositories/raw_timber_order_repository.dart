import '../../domain/entities/raw_timber_order.dart';

abstract class RawTimberOrderRepository {
  Future<List<RawTimberOrder>> getOrders({String? buyerId, String? sellerId, String? status});
  Future<RawTimberOrder> getOrderById(String id);
  Future<RawTimberOrder> createOrder(Map<String, dynamic> body);
  Future<RawTimberOrder> updateOrder(String id, Map<String, dynamic> body);
}
