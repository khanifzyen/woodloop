import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/warehouse_item.dart';

class WarehouseItemModel extends WarehouseItem {
  const WarehouseItemModel({
    required super.id,
    required super.aggregatorId,
    required super.pickupId,
    super.woodTypeId,
    super.woodTypeName,
    required super.form,
    required super.weight,
    super.pricePerKg,
    required super.status,
    super.photos,
    required super.created,
    required super.updated,
  });

  factory WarehouseItemModel.fromRecord(RecordModel record) {
    String? woodTypeName;
    final expandedWoodType = record.get<RecordModel?>('expand.wood_type');
    if (expandedWoodType != null) {
      woodTypeName = expandedWoodType.getStringValue('name');
    }

    return WarehouseItemModel(
      id: record.id,
      aggregatorId: record.getStringValue('aggregator'),
      pickupId: record.getStringValue('pickup'),
      woodTypeId: record.getStringValue('wood_type'),
      woodTypeName: woodTypeName,
      form: record.getStringValue('form'),
      weight: record.getDoubleValue('weight'),
      pricePerKg: record.getDoubleValue('price_per_kg'),
      status: record.getStringValue('status'),
      photos: record.getListValue<String>('photos'),
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
      updated:
          DateTime.tryParse(record.getStringValue('updated')) ?? DateTime.now(),
    );
  }

  static Map<String, dynamic> toBody({
    required String aggregatorId,
    required String pickupId,
    String? woodTypeId,
    required String form,
    required double weight,
    double? pricePerKg,
  }) {
    return {
      'aggregator': aggregatorId,
      'pickup': pickupId,
      if (woodTypeId != null) 'wood_type': woodTypeId,
      'form': form,
      'weight': weight,
      if (pricePerKg != null) 'price_per_kg': pricePerKg,
      'status': 'in_stock',
    };
  }
}
