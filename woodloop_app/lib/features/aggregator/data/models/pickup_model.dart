import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/pickup.dart';

class PickupModel extends Pickup {
  const PickupModel({
    required super.id,
    required super.aggregatorId,
    required super.wasteListingId,
    super.scheduledDate,
    super.actualDate,
    required super.status,
    super.weightVerified,
    super.pickupPhotos,
    super.notes,
    required super.created,
    required super.updated,
  });

  factory PickupModel.fromRecord(RecordModel record) {
    return PickupModel(
      id: record.id,
      aggregatorId: record.getStringValue('aggregator'),
      wasteListingId: record.getStringValue('waste_listing'),
      scheduledDate: DateTime.tryParse(record.getStringValue('scheduled_date')),
      actualDate: DateTime.tryParse(record.getStringValue('actual_date')),
      status: record.getStringValue('status'),
      weightVerified: record.getDoubleValue('weight_verified'),
      pickupPhotos: record.getListValue<String>('pickup_photo'),
      notes: record.getStringValue('notes'),
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
      updated:
          DateTime.tryParse(record.getStringValue('updated')) ?? DateTime.now(),
    );
  }

  static Map<String, dynamic> toBody({
    required String aggregatorId,
    required String wasteListingId,
    DateTime? scheduledDate,
    String? notes,
  }) {
    return {
      'aggregator': aggregatorId,
      'waste_listing': wasteListingId,
      'status': 'pending',
      if (scheduledDate != null)
        'scheduled_date': scheduledDate.toIso8601String(),
      if (notes != null) 'notes': notes,
    };
  }
}
