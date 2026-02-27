import 'package:equatable/equatable.dart';

class Pickup extends Equatable {
  final String id;
  final String aggregatorId;
  final String wasteListingId;
  final DateTime? scheduledDate;
  final DateTime? actualDate;
  final String status;
  final double? weightVerified;
  final List<String> pickupPhotos;
  final String? notes;
  final DateTime created;
  final DateTime updated;

  const Pickup({
    required this.id,
    required this.aggregatorId,
    required this.wasteListingId,
    this.scheduledDate,
    this.actualDate,
    required this.status,
    this.weightVerified,
    this.pickupPhotos = const [],
    this.notes,
    required this.created,
    required this.updated,
  });

  @override
  List<Object?> get props => [
    id,
    aggregatorId,
    wasteListingId,
    scheduledDate,
    actualDate,
    status,
    weightVerified,
    pickupPhotos,
    notes,
    created,
    updated,
  ];
}
