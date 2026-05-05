import '../../domain/entities/raw_timber_order.dart';
import 'package:pocketbase/pocketbase.dart';

class RawTimberOrderModel extends RawTimberOrder {
  const RawTimberOrderModel({
    required super.id, required super.buyerId, required super.sellerId,
    required super.listingId, required super.quantity, required super.totalPrice,
    super.status, super.notes, required super.created, required super.updated,
  });

  factory RawTimberOrderModel.fromRecord(RecordModel r) {
    return RawTimberOrderModel(
      id: r.id,
      buyerId: r.getStringValue('buyer'),
      sellerId: r.getStringValue('seller'),
      listingId: r.getStringValue('listing'),
      quantity: r.getDoubleValue('quantity'),
      totalPrice: r.getDoubleValue('total_price'),
      status: r.getStringValue('status'),
      notes: r.getStringValue('notes'),
      created: DateTime.tryParse(r.getStringValue('created')) ?? DateTime.now(),
      updated: DateTime.tryParse(r.getStringValue('updated')) ?? DateTime.now(),
    );
  }
}
