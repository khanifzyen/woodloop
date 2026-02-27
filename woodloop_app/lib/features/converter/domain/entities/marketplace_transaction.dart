import 'package:equatable/equatable.dart';

/// Represents a marketplace transaction between Converter and Aggregator
class MarketplaceTransaction extends Equatable {
  final String id;
  final String buyerId;
  final String sellerId;
  final String inventoryItemId;
  final double quantity;
  final double totalPrice;
  final String status;
  final String? paymentMethod;
  final DateTime created;
  final DateTime updated;

  const MarketplaceTransaction({
    required this.id,
    required this.buyerId,
    required this.sellerId,
    required this.inventoryItemId,
    required this.quantity,
    required this.totalPrice,
    required this.status,
    this.paymentMethod,
    required this.created,
    required this.updated,
  });

  @override
  List<Object?> get props => [
    id,
    buyerId,
    sellerId,
    inventoryItemId,
    quantity,
    totalPrice,
    status,
    paymentMethod,
    created,
    updated,
  ];
}
