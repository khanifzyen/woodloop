import '../entities/cart_item.dart';

abstract class CartRepository {
  Future<List<CartItem>> getCartItems({required String buyerId});
  Future<CartItem> addToCart(Map<String, dynamic> body);
  Future<CartItem> updateCartItem(String id, Map<String, dynamic> body);
  Future<void> removeFromCart(String id);
  Future<void> clearCart(String buyerId);
}
