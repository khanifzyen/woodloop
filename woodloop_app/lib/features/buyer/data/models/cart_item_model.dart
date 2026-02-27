import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/cart_item.dart';

class CartItemModel extends CartItem {
  const CartItemModel({
    required super.id,
    required super.buyerId,
    required super.productId,
    required super.quantity,
    required super.created,
    required super.updated,
    super.productName,
    super.productPrice,
    super.productPhoto,
  });

  factory CartItemModel.fromRecord(RecordModel record) {
    String? productName;
    double? productPrice;
    String? productPhoto;
    final expandedProduct = record.get<RecordModel?>('expand.product');
    if (expandedProduct != null) {
      productName = expandedProduct.getStringValue('name');
      productPrice = expandedProduct.getDoubleValue('price');
      final photos = expandedProduct.getListValue<String>('photos');
      if (photos.isNotEmpty) {
        productPhoto = photos.first;
      }
    }

    return CartItemModel(
      id: record.id,
      buyerId: record.getStringValue('buyer'),
      productId: record.getStringValue('product'),
      quantity: record.getIntValue('quantity'),
      productName: productName,
      productPrice: productPrice,
      productPhoto: productPhoto,
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
  }) {
    return {'buyer': buyerId, 'product': productId, 'quantity': quantity};
  }
}
