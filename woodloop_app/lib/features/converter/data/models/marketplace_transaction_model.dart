import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/marketplace_transaction.dart';

class MarketplaceTransactionModel extends MarketplaceTransaction {
  const MarketplaceTransactionModel({
    required super.id,
    required super.buyerId,
    required super.sellerId,
    required super.inventoryItemId,
    required super.quantity,
    required super.totalPrice,
    required super.status,
    super.paymentMethod,
    required super.created,
    required super.updated,
  });

  factory MarketplaceTransactionModel.fromRecord(RecordModel record) {
    return MarketplaceTransactionModel(
      id: record.id,
      buyerId: record.getStringValue('buyer'),
      sellerId: record.getStringValue('seller'),
      inventoryItemId: record.getStringValue('inventory_item'),
      quantity: record.getDoubleValue('quantity'),
      totalPrice: record.getDoubleValue('total_price'),
      status: record.getStringValue('status'),
      paymentMethod: record.getStringValue('payment_method'),
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
      updated:
          DateTime.tryParse(record.getStringValue('updated')) ?? DateTime.now(),
    );
  }

  static Map<String, dynamic> toBody({
    required String buyerId,
    required String sellerId,
    required String inventoryItemId,
    required double quantity,
    required double totalPrice,
    String paymentMethod = 'wallet',
  }) {
    return {
      'buyer': buyerId,
      'seller': sellerId,
      'inventory_item': inventoryItemId,
      'quantity': quantity,
      'total_price': totalPrice,
      'status': 'pending',
      'payment_method': paymentMethod,
    };
  }
}
