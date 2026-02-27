import 'package:equatable/equatable.dart';

class TraceabilityStep extends Equatable {
  final String role; // supplier, generator, aggregator, converter
  final String entityName; // Name of the business/person
  final String title; // e.g. "Kayu Jati Dipanen"
  final String description;
  final DateTime date;
  final String? location;
  final bool isVerified;

  const TraceabilityStep({
    required this.role,
    required this.entityName,
    required this.title,
    required this.description,
    required this.date,
    this.location,
    this.isVerified = false,
  });

  @override
  List<Object?> get props => [
    role,
    entityName,
    title,
    description,
    date,
    location,
    isVerified,
  ];
}

class TraceabilityData extends Equatable {
  final String productId;
  final String productName;
  final String? productCategory;
  final double? co2Saved;
  final double? wasteDiverted;
  final List<TraceabilityStep> steps;

  const TraceabilityData({
    required this.productId,
    required this.productName,
    this.productCategory,
    this.co2Saved,
    this.wasteDiverted,
    required this.steps,
  });

  @override
  List<Object?> get props => [
    productId,
    productName,
    productCategory,
    co2Saved,
    wasteDiverted,
    steps,
  ];
}
