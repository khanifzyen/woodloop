import 'package:equatable/equatable.dart';

class Product extends Equatable {
  final String id;
  final String converterId;
  final String name;
  final String? description;
  final String category;
  final double price;
  final int stock;
  final List<String> photos;
  final List<String> sourceTransactionIds;
  final String? qrCodeId;
  final DateTime created;
  final DateTime updated;

  const Product({
    required this.id,
    required this.converterId,
    required this.name,
    this.description,
    required this.category,
    required this.price,
    this.stock = 0,
    this.photos = const [],
    this.sourceTransactionIds = const [],
    this.qrCodeId,
    required this.created,
    required this.updated,
  });

  @override
  List<Object?> get props => [
    id,
    converterId,
    name,
    description,
    category,
    price,
    stock,
    photos,
    sourceTransactionIds,
    qrCodeId,
    created,
    updated,
  ];
}
