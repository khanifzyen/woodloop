import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/cart_item_model.dart';

abstract class CartRemoteDataSource {
  Future<List<CartItemModel>> getCartItems({required String buyerId});
  Future<CartItemModel> addToCart(Map<String, dynamic> body);
  Future<CartItemModel> updateCartItem(String id, Map<String, dynamic> body);
  Future<void> removeFromCart(String id);
  Future<void> clearCart(String buyerId);
}

@LazySingleton(as: CartRemoteDataSource)
class CartRemoteDataSourceImpl implements CartRemoteDataSource {
  final PocketBase pb;

  CartRemoteDataSourceImpl(this.pb);

  @override
  Future<List<CartItemModel>> getCartItems({required String buyerId}) async {
    final result = await pb
        .collection('cart_items')
        .getList(
          filter: 'buyer = "$buyerId"',
          expand: 'product',
          sort: '-created',
        );
    return result.items
        .map((record) => CartItemModel.fromRecord(record))
        .toList();
  }

  @override
  Future<CartItemModel> addToCart(Map<String, dynamic> body) async {
    final record = await pb.collection('cart_items').create(body: body);
    return CartItemModel.fromRecord(record);
  }

  @override
  Future<CartItemModel> updateCartItem(
    String id,
    Map<String, dynamic> body,
  ) async {
    final record = await pb.collection('cart_items').update(id, body: body);
    return CartItemModel.fromRecord(record);
  }

  @override
  Future<void> removeFromCart(String id) async {
    await pb.collection('cart_items').delete(id);
  }

  @override
  Future<void> clearCart(String buyerId) async {
    // Fetch all cart items for this buyer and delete them one by one
    final result = await pb
        .collection('cart_items')
        .getFullList(filter: 'buyer = "$buyerId"');
    for (final item in result) {
      await pb.collection('cart_items').delete(item.id);
    }
  }
}
