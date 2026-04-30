import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/raw_timber_listing.dart';

class RawTimberListingModel extends RawTimberListing {
  const RawTimberListingModel({
    required super.id,
    required super.supplierId,
    required super.woodTypeId,
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
    super.photos,
    super.legalityDoc,
    super.trackingId,
    super.description,
    required super.updatedAt,
  });

  factory RawTimberListingModel.fromRecord(RecordModel record) {
    // Safely extract wood_type name using modern PocketBase get<T>
    String woodTypeName = record.getStringValue(
      'wood_type',
    ); // fallback to raw id

    try {
      final woodTypeRecord = record.get<RecordModel?>('expand.wood_type');
      if (woodTypeRecord != null) {
        woodTypeName = woodTypeRecord.getStringValue('name');
      }
    } catch (_) {
      // In case it's somehow returned as a List despite maxSelect: 1
      try {
        final woodTypeList = record.get<List<RecordModel>>('expand.wood_type');
        if (woodTypeList.isNotEmpty) {
          woodTypeName = woodTypeList.first.getStringValue('name');
        }
      } catch (_) {}
    }

    return RawTimberListingModel(
      id: record.id,
      supplierId: record.getStringValue('supplier'),
      woodTypeId: record.getStringValue('wood_type'),
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
      unit: record.getStringValue('unit').isNotEmpty
          ? record.getStringValue('unit')
          : 'm3',
      status: record.getStringValue('status').isNotEmpty
          ? record.getStringValue('status')
          : 'draft',
      photos: record.getListValue<String>('photos'),
      legalityDoc: record.getStringValue('legality_doc').isNotEmpty
          ? record.getStringValue('legality_doc')
          : null,
      trackingId: record.getStringValue('tracking_id').isNotEmpty
          ? record.getStringValue('tracking_id')
          : null,
      description: record.getStringValue('description').isNotEmpty
          ? record.getStringValue('description')
          : null,
      updatedAt:
          DateTime.tryParse(record.getStringValue('updated')) ?? DateTime.now(),
    );
  }
}
