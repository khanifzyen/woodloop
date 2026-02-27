import '../entities/order.dart';

abstract class OrderRepository {
  Future<List<Order>> getOrders({
    String? buyerId,
    String? status,
    int page,
    int perPage,
  });

  Future<Order> getOrderById(String id);
  Future<Order> createOrder(Map<String, dynamic> body);
  Future<Order> updateOrder(String id, Map<String, dynamic> body);
}
