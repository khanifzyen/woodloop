import 'package:equatable/equatable.dart';

class RawTimberListing extends Equatable {
  final String id;
  final String supplierId;
  final String woodTypeId;
  final String woodTypeName;
  final String shape; // log, sawn
  final double? diameter;
  final double? width;
  final double? height;
  final double? length;
  final double volume;
  final double price;
  final String unit; // m3, batang, ton
  final String status; // available, sold
  final List<String> photos;
  final String? legalityDoc;
  final String? trackingId; // LOG-JEP01-260310-A7X
  final DateTime updatedAt;

  const RawTimberListing({
    required this.id,
    required this.supplierId,
    required this.woodTypeId,
    required this.woodTypeName,
    required this.shape,
    this.diameter,
    this.width,
    this.height,
    this.length,
    required this.volume,
    required this.price,
    required this.unit,
    required this.status,
    this.photos = const [],
    this.legalityDoc,
    this.trackingId,
    required this.updatedAt,
  });

  bool get isSold => status == 'sold';
  bool get isAvailable => status == 'available';

  @override
  List<Object?> get props => [
    id,
    supplierId,
    woodTypeId,
    woodTypeName,
    shape,
    diameter,
    width,
    height,
    length,
    volume,
    price,
    unit,
    status,
    photos,
    legalityDoc,
    trackingId,
    updatedAt,
  ];
}
