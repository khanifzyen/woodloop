import 'package:equatable/equatable.dart';

class GeneratorProduct extends Equatable {
  final String id;
  final String generatorId;
  final String name;
  final String? description;
  final String category;
  final double price;
  final int stock;
  final List<String> photos;
  final String? woodTypeId;
  final String status;
  final DateTime created;
  final DateTime updated;

  const GeneratorProduct({
    required this.id,
    required this.generatorId,
    required this.name,
    this.description,
    required this.category,
    required this.price,
    this.stock = 0,
    this.photos = const [],
    this.woodTypeId,
    this.status = 'active',
    required this.created,
    required this.updated,
  });

  @override
  List<Object?> get props => [
        id,
        generatorId,
        name,
        description,
        category,
        price,
        stock,
        photos,
        woodTypeId,
        status,
        created,
        updated,
      ];
}
