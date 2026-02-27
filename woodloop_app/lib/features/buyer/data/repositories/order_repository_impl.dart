import 'package:injectable/injectable.dart' hide Order;

import '../../domain/entities/order.dart';
import '../../domain/repositories/order_repository.dart';
import '../datasources/order_remote_data_source.dart';

@LazySingleton(as: OrderRepository)
class OrderRepositoryImpl implements OrderRepository {
  final OrderRemoteDataSource remoteDataSource;

  OrderRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<Order>> getOrders({
    String? buyerId,
    String? status,
    int page = 1,
    int perPage = 30,
  }) async {
    return await remoteDataSource.getOrders(
      buyerId: buyerId,
      status: status,
      page: page,
      perPage: perPage,
    );
  }

  @override
  Future<Order> getOrderById(String id) async {
    return await remoteDataSource.getOrderById(id);
  }

  @override
  Future<Order> createOrder(Map<String, dynamic> body) async {
    return await remoteDataSource.createOrder(body);
  }

  @override
  Future<Order> updateOrder(String id, Map<String, dynamic> body) async {
    return await remoteDataSource.updateOrder(id, body);
  }
}
