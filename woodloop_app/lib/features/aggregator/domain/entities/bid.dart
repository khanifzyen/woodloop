import 'package:equatable/equatable.dart';

class Bid extends Equatable {
  final String id;
  final String bidderId;
  final String wasteListingId;
  final double bidAmount;
  final String? message;
  final String status;
  final DateTime created;
  final DateTime updated;

  const Bid({
    required this.id,
    required this.bidderId,
    required this.wasteListingId,
    required this.bidAmount,
    this.message,
    this.status = 'pending',
    required this.created,
    required this.updated,
  });

  @override
  List<Object?> get props => [
        id,
        bidderId,
        wasteListingId,
        bidAmount,
        message,
        status,
        created,
        updated,
      ];
}
