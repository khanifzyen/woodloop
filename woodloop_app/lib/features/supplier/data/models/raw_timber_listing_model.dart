import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/raw_timber_listing.dart';

class RawTimberListingModel extends RawTimberListing {
  const RawTimberListingModel({
    required super.id,
    required super.supplierId,
    required super.woodTypeName,
    required super.volume,
    required super.price,
    required super.unit,
    required super.status,
    required super.updatedAt,
  });

  factory RawTimberListingModel.fromRecord(RecordModel record) {
    // wood_type is expanded — use new get<T> API
    final woodTypeList = record.get<List<RecordModel>>('expand.wood_type');
    final woodTypeName = woodTypeList.isNotEmpty
        ? woodTypeList.first.get<String>('name')
        : record.getStringValue('wood_type'); // fallback to raw id

    return RawTimberListingModel(
      id: record.id,
      supplierId: record.getStringValue('supplier'),
      woodTypeName: woodTypeName,
      volume: record.getDoubleValue('volume'),
      price: record.getDoubleValue('price'),
      unit: record.getStringValue('unit').isEmpty
          ? 'm3'
          : record.getStringValue('unit'),
      status: record.getStringValue('status').isEmpty
          ? 'available'
          : record.getStringValue('status'),
      updatedAt:
          DateTime.tryParse(record.get<String>('updated')) ?? DateTime.now(),
    );
  }
}
