import 'package:equatable/equatable.dart';

class RawTimberOrder extends Equatable {
  final String id;
  final String buyerId;
  final String sellerId;
  final String listingId;
  final double quantity;
  final double totalPrice;
  final String status;
  final String? notes;
  final DateTime created;
  final DateTime updated;

  const RawTimberOrder({
    required this.id,
    required this.buyerId,
    required this.sellerId,
    required this.listingId,
    required this.quantity,
    required this.totalPrice,
    this.status = 'pending',
    this.notes,
    required this.created,
    required this.updated,
  });

  @override
  List<Object?> get props => [id, buyerId, sellerId, listingId, quantity, totalPrice, status, notes, created, updated];
}
