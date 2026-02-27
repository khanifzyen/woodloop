import 'package:equatable/equatable.dart';

class WarehouseItem extends Equatable {
  final String id;
  final String aggregatorId;
  final String pickupId;
  final String? woodTypeId;
  final String? woodTypeName;
  final String form;
  final double weight;
  final double? pricePerKg;
  final String status;
  final List<String> photos;
  final DateTime created;
  final DateTime updated;

  const WarehouseItem({
    required this.id,
    required this.aggregatorId,
    required this.pickupId,
    this.woodTypeId,
    this.woodTypeName,
    required this.form,
    required this.weight,
    this.pricePerKg,
    required this.status,
    this.photos = const [],
    required this.created,
    required this.updated,
  });

  @override
  List<Object?> get props => [
    id,
    aggregatorId,
    pickupId,
    woodTypeId,
    woodTypeName,
    form,
    weight,
    pricePerKg,
    status,
    photos,
    created,
    updated,
  ];
}
