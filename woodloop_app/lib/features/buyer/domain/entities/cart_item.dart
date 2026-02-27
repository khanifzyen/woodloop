import 'package:equatable/equatable.dart';

class CartItem extends Equatable {
  final String id;
  final String buyerId;
  final String productId;
  final int quantity;
  final DateTime created;
  final DateTime updated;

  // Expanded fields (optional, populated when expand is used)
  final String? productName;
  final double? productPrice;
  final String? productPhoto;

  const CartItem({
    required this.id,
    required this.buyerId,
    required this.productId,
    required this.quantity,
    required this.created,
    required this.updated,
    this.productName,
    this.productPrice,
    this.productPhoto,
  });

  @override
  List<Object?> get props => [
    id,
    buyerId,
    productId,
    quantity,
    created,
    updated,
    productName,
    productPrice,
    productPhoto,
  ];
}
