import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/impact_metric.dart';

class ImpactMetricModel extends ImpactMetric {
  const ImpactMetricModel({
    required super.id,
    super.wasteListingId,
    super.pickupId,
    super.co2Saved,
    super.wasteDiverted,
    super.economicValue,
    super.period,
  });

  factory ImpactMetricModel.fromRecord(RecordModel record) {
    return ImpactMetricModel(
      id: record.id,
      wasteListingId: record.getStringValue('waste_listing'),
      pickupId: record.getStringValue('pickup'),
      co2Saved: record.getDoubleValue('co2_saved'),
      wasteDiverted: record.getDoubleValue('waste_diverted'),
      economicValue: record.getDoubleValue('economic_value'),
      period: record.getStringValue('period'),
    );
  }

  static Map<String, dynamic> toBody({
    String? wasteListingId,
    String? pickupId,
    double? co2Saved,
    double? wasteDiverted,
    double? economicValue,
    String? period,
  }) {
    return {
      if (wasteListingId != null) 'waste_listing': wasteListingId,
      if (pickupId != null) 'pickup': pickupId,
      if (co2Saved != null) 'co2_saved': co2Saved,
      if (wasteDiverted != null) 'waste_diverted': wasteDiverted,
      if (economicValue != null) 'economic_value': economicValue,
      if (period != null) 'period': period,
    };
  }
}
