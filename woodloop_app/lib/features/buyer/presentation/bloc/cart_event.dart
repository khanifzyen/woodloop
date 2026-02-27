part of 'cart_bloc.dart';

abstract class CartEvent extends Equatable {
  const CartEvent();

  @override
  List<Object?> get props => [];
}

class LoadCart extends CartEvent {
  final String buyerId;

  const LoadCart(this.buyerId);

  @override
  List<Object?> get props => [buyerId];
}

class AddToCart extends CartEvent {
  final Map<String, dynamic> body;

  const AddToCart(this.body);

  @override
  List<Object?> get props => [body];
}

class UpdateCartItemQuantity extends CartEvent {
  final String id;
  final int quantity;

  const UpdateCartItemQuantity({required this.id, required this.quantity});

  @override
  List<Object?> get props => [id, quantity];
}

class RemoveFromCart extends CartEvent {
  final String id;

  const RemoveFromCart(this.id);

  @override
  List<Object?> get props => [id];
}

class ClearCart extends CartEvent {
  final String buyerId;

  const ClearCart(this.buyerId);

  @override
  List<Object?> get props => [buyerId];
}
