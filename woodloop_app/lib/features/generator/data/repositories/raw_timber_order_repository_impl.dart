import 'package:injectable/injectable.dart';
import '../../domain/entities/raw_timber_order.dart';
import '../../domain/repositories/raw_timber_order_repository.dart';
import '../datasources/raw_timber_order_remote_data_source.dart';

@LazySingleton(as: RawTimberOrderRepository)
class RawTimberOrderRepositoryImpl implements RawTimberOrderRepository {
  final RawTimberOrderRemoteDataSource remote;
  RawTimberOrderRepositoryImpl(this.remote);

  @override
  Future<List<RawTimberOrder>> getOrders({String? buyerId, String? sellerId, String? status}) =>
      remote.getOrders(buyerId: buyerId, sellerId: sellerId, status: status);

  @override
  Future<RawTimberOrder> getOrderById(String id) => remote.getOrderById(id);

  @override
  Future<RawTimberOrder> createOrder(Map<String, dynamic> body) => remote.createOrder(body);

  @override
  Future<RawTimberOrder> updateOrder(String id, Map<String, dynamic> body) => remote.updateOrder(id, body);
}
