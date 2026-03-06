import 'package:equatable/equatable.dart';

class RawTimberListing extends Equatable {
  final String id;
  final String supplierId;
  final String woodTypeName;
  final double volume;
  final double price;
  final String unit; // m3, batang, ton
  final String status; // available, sold
  final DateTime updatedAt;

  const RawTimberListing({
    required this.id,
    required this.supplierId,
    required this.woodTypeName,
    required this.volume,
    required this.price,
    required this.unit,
    required this.status,
    required this.updatedAt,
  });

  bool get isSold => status == 'sold';
  bool get isAvailable => status == 'available';

  @override
  List<Object?> get props => [
    id,
    supplierId,
    woodTypeName,
    volume,
    price,
    unit,
    status,
    updatedAt,
  ];
}
