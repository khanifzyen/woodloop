import 'package:pocketbase/pocketbase.dart';

import '../../domain/entities/generator_product.dart';

class GeneratorProductModel extends GeneratorProduct {
  const GeneratorProductModel({
    required super.id,
    required super.generatorId,
    required super.name,
    super.description,
    required super.category,
    required super.price,
    super.stock,
    super.photos,
    super.woodTypeId,
    super.status,
    required super.created,
    required super.updated,
  });

  factory GeneratorProductModel.fromRecord(RecordModel record) {
    return GeneratorProductModel(
      id: record.id,
      generatorId: record.getStringValue('generator'),
      name: record.getStringValue('name'),
      description: record.getStringValue('description'),
      category: record.getStringValue('category'),
      price: record.getDoubleValue('price'),
      stock: record.getIntValue('stock'),
      photos: record.getListValue<String>('photos'),
      woodTypeId: record.getStringValue('wood_type'),
      status: record.getStringValue('status'),
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
      updated:
          DateTime.tryParse(record.getStringValue('updated')) ?? DateTime.now(),
    );
  }

  static Map<String, dynamic> toBody({
    required String generatorId,
    required String name,
    String? description,
    required String category,
    required double price,
    int stock = 0,
    String? woodTypeId,
    String status = 'active',
  }) {
    return {
      'generator': generatorId,
      'name': name,
      'description': description ?? '',
      'category': category,
      'price': price,
      'stock': stock,
      if (woodTypeId != null) 'wood_type': woodTypeId,
      'status': status,
    };
  }
}
