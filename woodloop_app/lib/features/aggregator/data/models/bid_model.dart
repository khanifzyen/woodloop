import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/bid.dart';

class BidModel extends Bid {
  const BidModel({
    required super.id,
    required super.bidderId,
    required super.wasteListingId,
    required super.bidAmount,
    super.message,
    super.status,
    required super.created,
    required super.updated,
  });

  factory BidModel.fromRecord(RecordModel record) {
    return BidModel(
      id: record.id,
      bidderId: record.getStringValue('bidder'),
      wasteListingId: record.getStringValue('waste_listing'),
      bidAmount: record.getDoubleValue('bid_amount'),
      message: record.getStringValue('message'),
      status: record.getStringValue('status'),
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
      updated:
          DateTime.tryParse(record.getStringValue('updated')) ?? DateTime.now(),
    );
  }

  static Map<String, dynamic> toBody({
    required String bidderId,
    required String wasteListingId,
    required double bidAmount,
    String? message,
    String? status,
  }) {
    return {
      'bidder': bidderId,
      'waste_listing': wasteListingId,
      'bid_amount': bidAmount,
      if (message != null) 'message': message,
      if (status != null) 'status': status,
    };
  }
}
