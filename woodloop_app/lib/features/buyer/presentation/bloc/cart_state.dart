part of 'cart_bloc.dart';

abstract class CartState extends Equatable {
  const CartState();

  @override
  List<Object?> get props => [];
}

class CartInitial extends CartState {}

class CartLoading extends CartState {}

class CartLoaded extends CartState {
  final List<CartItem> items;

  const CartLoaded(this.items);

  double get totalPrice {
    double total = 0;
    for (final item in items) {
      total += (item.productPrice ?? 0) * item.quantity;
    }
    return total;
  }

  int get totalItems => items.length;

  @override
  List<Object?> get props => [items];
}

class CartItemAdded extends CartState {}

class CartItemRemoved extends CartState {}

class CartCleared extends CartState {}

class CartError extends CartState {
  final String message;

  const CartError(this.message);

  @override
  List<Object?> get props => [message];
}
