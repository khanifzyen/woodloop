import 'package:equatable/equatable.dart';

class ImpactMetric extends Equatable {
  final String id;
  final String? wasteListingId;
  final String? pickupId;
  final double? co2Saved;
  final double? wasteDiverted;
  final double? economicValue;
  final String? period;

  const ImpactMetric({
    required this.id,
    this.wasteListingId,
    this.pickupId,
    this.co2Saved,
    this.wasteDiverted,
    this.economicValue,
    this.period,
  });

  @override
  List<Object?> get props => [
        id,
        wasteListingId,
        pickupId,
        co2Saved,
        wasteDiverted,
        economicValue,
        period,
      ];
}
