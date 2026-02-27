import 'package:pocketbase/pocketbase.dart';

import '../../domain/entities/waste_listing.dart';

class WasteListingModel extends WasteListing {
  const WasteListingModel({
    required super.id,
    required super.generatorId,
    required super.woodTypeId,
    super.woodTypeName,
    required super.form,
    required super.condition,
    required super.volume,
    required super.unit,
    super.photos,
    super.priceEstimate,
    required super.status,
    super.description,
    required super.created,
    required super.updated,
  });

  factory WasteListingModel.fromRecord(RecordModel record) {
    // Extract wood type name from expanded relation if available
    String? woodTypeName;
    final expandedWoodType = record.get<RecordModel?>('expand.wood_type');
    if (expandedWoodType != null) {
      woodTypeName = expandedWoodType.getStringValue('name');
    }

    return WasteListingModel(
      id: record.id,
      generatorId: record.getStringValue('generator'),
      woodTypeId: record.getStringValue('wood_type'),
      woodTypeName: woodTypeName,
      form: record.getStringValue('form'),
      condition: record.getStringValue('condition'),
      volume: record.getDoubleValue('volume'),
      unit: record.getStringValue('unit'),
      photos: record.getListValue<String>('photos'),
      priceEstimate: record.getDoubleValue('price_estimate'),
      status: record.getStringValue('status'),
      description: record.getStringValue('description'),
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
      updated:
          DateTime.tryParse(record.getStringValue('updated')) ?? DateTime.now(),
    );
  }

  /// Convert to a Map for PocketBase create/update body
  static Map<String, dynamic> toBody({
    required String generatorId,
    required String woodTypeId,
    required String form,
    required String condition,
    required double volume,
    required String unit,
    double priceEstimate = 0,
    String? description,
  }) {
    return {
      'generator': generatorId,
      'wood_type': woodTypeId,
      'form': form,
      'condition': condition,
      'volume': volume,
      'unit': unit,
      'price_estimate': priceEstimate,
      'description': description ?? '',
    };
  }
}
