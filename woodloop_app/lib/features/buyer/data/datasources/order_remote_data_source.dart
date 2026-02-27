import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/order_model.dart';

abstract class OrderRemoteDataSource {
  Future<List<OrderModel>> getOrders({
    String? buyerId,
    String? status,
    int page = 1,
    int perPage = 30,
  });

  Future<OrderModel> getOrderById(String id);
  Future<OrderModel> createOrder(Map<String, dynamic> body);
  Future<OrderModel> updateOrder(String id, Map<String, dynamic> body);
}

@LazySingleton(as: OrderRemoteDataSource)
class OrderRemoteDataSourceImpl implements OrderRemoteDataSource {
  final PocketBase pb;

  OrderRemoteDataSourceImpl(this.pb);

  @override
  Future<List<OrderModel>> getOrders({
    String? buyerId,
    String? status,
    int page = 1,
    int perPage = 30,
  }) async {
    final filters = <String>[];
    if (buyerId != null && buyerId.isNotEmpty) {
      filters.add('buyer = "$buyerId"');
    }
    if (status != null && status.isNotEmpty) {
      filters.add('status = "$status"');
    }

    final result = await pb
        .collection('orders')
        .getList(
          page: page,
          perPage: perPage,
          filter: filters.isNotEmpty ? filters.join(' && ') : '',
          sort: '-created',
          expand: 'product',
        );

    return result.items.map((record) => OrderModel.fromRecord(record)).toList();
  }

  @override
  Future<OrderModel> getOrderById(String id) async {
    final record = await pb
        .collection('orders')
        .getOne(id, expand: 'product,buyer');
    return OrderModel.fromRecord(record);
  }

  @override
  Future<OrderModel> createOrder(Map<String, dynamic> body) async {
    final record = await pb.collection('orders').create(body: body);
    return OrderModel.fromRecord(record);
  }

  @override
  Future<OrderModel> updateOrder(String id, Map<String, dynamic> body) async {
    final record = await pb.collection('orders').update(id, body: body);
    return OrderModel.fromRecord(record);
  }
}
