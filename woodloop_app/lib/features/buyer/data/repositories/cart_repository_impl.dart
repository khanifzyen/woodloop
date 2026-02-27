import 'package:injectable/injectable.dart';

import '../../domain/entities/cart_item.dart';
import '../../domain/repositories/cart_repository.dart';
import '../datasources/cart_remote_data_source.dart';

@LazySingleton(as: CartRepository)
class CartRepositoryImpl implements CartRepository {
  final CartRemoteDataSource remoteDataSource;

  CartRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<CartItem>> getCartItems({required String buyerId}) async {
    return await remoteDataSource.getCartItems(buyerId: buyerId);
  }

  @override
  Future<CartItem> addToCart(Map<String, dynamic> body) async {
    return await remoteDataSource.addToCart(body);
  }

  @override
  Future<CartItem> updateCartItem(String id, Map<String, dynamic> body) async {
    return await remoteDataSource.updateCartItem(id, body);
  }

  @override
  Future<void> removeFromCart(String id) async {
    await remoteDataSource.removeFromCart(id);
  }

  @override
  Future<void> clearCart(String buyerId) async {
    await remoteDataSource.clearCart(buyerId);
  }
}
