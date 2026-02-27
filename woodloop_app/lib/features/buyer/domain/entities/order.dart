import 'package:equatable/equatable.dart';

class Order extends Equatable {
  final String id;
  final String buyerId;
  final String productId;
  final int quantity;
  final double totalPrice;
  final String status;
  final String shippingAddress;
  final String? snapToken;
  final String? snapRedirectUrl;
  final String? paymentMethod;
  final DateTime created;
  final DateTime updated;

  // Expanded fields
  final String? productName;

  const Order({
    required this.id,
    required this.buyerId,
    required this.productId,
    required this.quantity,
    required this.totalPrice,
    required this.status,
    required this.shippingAddress,
    this.snapToken,
    this.snapRedirectUrl,
    this.paymentMethod,
    required this.created,
    required this.updated,
    this.productName,
  });

  @override
  List<Object?> get props => [
    id,
    buyerId,
    productId,
    quantity,
    totalPrice,
    status,
    shippingAddress,
    snapToken,
    snapRedirectUrl,
    paymentMethod,
    created,
    updated,
    productName,
  ];
}
