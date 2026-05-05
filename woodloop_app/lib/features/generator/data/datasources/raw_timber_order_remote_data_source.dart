import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';
import '../models/raw_timber_order_model.dart';

abstract class RawTimberOrderRemoteDataSource {
  Future<List<RawTimberOrderModel>> getOrders({String? buyerId, String? sellerId, String? status});
  Future<RawTimberOrderModel> getOrderById(String id);
  Future<RawTimberOrderModel> createOrder(Map<String, dynamic> body);
  Future<RawTimberOrderModel> updateOrder(String id, Map<String, dynamic> body);
}

@LazySingleton(as: RawTimberOrderRemoteDataSource)
class RawTimberOrderRemoteDataSourceImpl implements RawTimberOrderRemoteDataSource {
  final PocketBase pb;
  RawTimberOrderRemoteDataSourceImpl(this.pb);

  @override
  Future<List<RawTimberOrderModel>> getOrders({String? buyerId, String? sellerId, String? status}) async {
    final filters = <String>[];
    if (buyerId != null) filters.add('buyer = "$buyerId"');
    if (sellerId != null) filters.add('seller = "$sellerId"');
    if (status != null) filters.add('status = "$status"');
    final result = await pb.collection('raw_timber_orders').getList(
      filter: filters.join(' && '), sort: '-created', perPage: 100,
      expand: 'listing,buyer,seller',
    );
    return result.items.map((r) => RawTimberOrderModel.fromRecord(r)).toList();
  }

  @override
  Future<RawTimberOrderModel> getOrderById(String id) async {
    final r = await pb.collection('raw_timber_orders').getOne(id, expand: 'listing,buyer,seller');
    return RawTimberOrderModel.fromRecord(r);
  }

  @override
  Future<RawTimberOrderModel> createOrder(Map<String, dynamic> body) async {
    final r = await pb.collection('raw_timber_orders').create(body: body);
    return RawTimberOrderModel.fromRecord(r);
  }

  @override
  Future<RawTimberOrderModel> updateOrder(String id, Map<String, dynamic> body) async {
    final r = await pb.collection('raw_timber_orders').update(id, body: body);
    return RawTimberOrderModel.fromRecord(r);
  }
}
