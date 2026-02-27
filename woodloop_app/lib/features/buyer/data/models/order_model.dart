import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/order.dart';

class OrderModel extends Order {
  const OrderModel({
    required super.id,
    required super.buyerId,
    required super.productId,
    required super.quantity,
    required super.totalPrice,
    required super.status,
    required super.shippingAddress,
    super.snapToken,
    super.snapRedirectUrl,
    super.paymentMethod,
    required super.created,
    required super.updated,
    super.productName,
  });

  factory OrderModel.fromRecord(RecordModel record) {
    String? productName;
    final expandedProduct = record.get<RecordModel?>('expand.product');
    if (expandedProduct != null) {
      productName = expandedProduct.getStringValue('name');
    }

    return OrderModel(
      id: record.id,
      buyerId: record.getStringValue('buyer'),
      productId: record.getStringValue('product'),
      quantity: record.getIntValue('quantity'),
      totalPrice: record.getDoubleValue('total_price'),
      status: record.getStringValue('status'),
      shippingAddress: record.getStringValue('shipping_address'),
      snapToken: record.getStringValue('snap_token'),
      snapRedirectUrl: record.getStringValue('snap_redirect_url'),
      paymentMethod: record.getStringValue('payment_method'),
      productName: productName,
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
      updated:
          DateTime.tryParse(record.getStringValue('updated')) ?? DateTime.now(),
    );
  }

  static Map<String, dynamic> toBody({
    required String buyerId,
    required String productId,
    required int quantity,
    required double totalPrice,
    required String shippingAddress,
    String paymentMethod = 'qris',
  }) {
    return {
      'buyer': buyerId,
      'product': productId,
      'quantity': quantity,
      'total_price': totalPrice,
      'shipping_address': shippingAddress,
      'status': 'payment_pending',
      'payment_method': paymentMethod,
    };
  }
}
