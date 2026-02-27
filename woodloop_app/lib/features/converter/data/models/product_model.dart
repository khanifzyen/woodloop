import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/product.dart';

class ProductModel extends Product {
  const ProductModel({
    required super.id,
    required super.converterId,
    required super.name,
    super.description,
    required super.category,
    required super.price,
    super.stock,
    super.photos,
    super.sourceTransactionIds,
    super.qrCodeId,
    required super.created,
    required super.updated,
  });

  factory ProductModel.fromRecord(RecordModel record) {
    return ProductModel(
      id: record.id,
      converterId: record.getStringValue('converter'),
      name: record.getStringValue('name'),
      description: record.getStringValue('description'),
      category: record.getStringValue('category'),
      price: record.getDoubleValue('price'),
      stock: record.getIntValue('stock'),
      photos: record.getListValue<String>('photos'),
      sourceTransactionIds: record.getListValue<String>('source_transactions'),
      qrCodeId: record.getStringValue('qr_code_id'),
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
      updated:
          DateTime.tryParse(record.getStringValue('updated')) ?? DateTime.now(),
    );
  }

  static Map<String, dynamic> toBody({
    required String converterId,
    required String name,
    String? description,
    required String category,
    required double price,
    int stock = 0,
    List<String>? sourceTransactionIds,
  }) {
    return {
      'converter': converterId,
      'name': name,
      'description': description ?? '',
      'category': category,
      'price': price,
      'stock': stock,
      if (sourceTransactionIds != null)
        'source_transactions': sourceTransactionIds,
    };
  }
}
