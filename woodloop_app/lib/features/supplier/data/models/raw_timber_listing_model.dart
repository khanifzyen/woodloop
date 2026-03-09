import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/raw_timber_listing.dart';

class RawTimberListingModel extends RawTimberListing {
  const RawTimberListingModel({
    required super.id,
    required super.supplierId,
    required super.woodTypeName,
    required super.shape,
    super.diameter,
    super.width,
    super.height,
    super.length,
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
      shape: record.getStringValue('shape').isNotEmpty
          ? record.getStringValue('shape')
          : 'log',
      diameter: record.getDoubleValue('diameter') == 0
          ? null
          : record.getDoubleValue('diameter'),
      width: record.getDoubleValue('width') == 0
          ? null
          : record.getDoubleValue('width'),
      height: record.getDoubleValue('height') == 0
          ? null
          : record.getDoubleValue('height'),
      length: record.getDoubleValue('length') == 0
          ? null
          : record.getDoubleValue('length'),
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
