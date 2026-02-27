import 'package:equatable/equatable.dart';

class WasteListing extends Equatable {
  final String id;
  final String generatorId;
  final String woodTypeId;
  final String? woodTypeName;
  final String form;
  final String condition;
  final double volume;
  final String unit;
  final List<String> photos;
  final double priceEstimate;
  final String status;
  final String? description;
  final DateTime created;
  final DateTime updated;

  const WasteListing({
    required this.id,
    required this.generatorId,
    required this.woodTypeId,
    this.woodTypeName,
    required this.form,
    required this.condition,
    required this.volume,
    required this.unit,
    this.photos = const [],
    this.priceEstimate = 0,
    required this.status,
    this.description,
    required this.created,
    required this.updated,
  });

  @override
  List<Object?> get props => [
    id,
    generatorId,
    woodTypeId,
    woodTypeName,
    form,
    condition,
    volume,
    unit,
    photos,
    priceEstimate,
    status,
    description,
    created,
    updated,
  ];
}
