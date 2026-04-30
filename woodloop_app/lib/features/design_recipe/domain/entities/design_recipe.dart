import 'package:equatable/equatable.dart';

class DesignRecipe extends Equatable {
  final String id;
  final String title;
  final String? description;
  final List<String> suitableWoodTypeIds;
  final List<String> suitableForms;
  final List<String> photos;
  final String? authorId;
  final String? authorName;
  final String difficulty; // easy, medium, hard
  final DateTime created;
  final DateTime updated;

  const DesignRecipe({
    required this.id,
    required this.title,
    this.description,
    this.suitableWoodTypeIds = const [],
    this.suitableForms = const [],
    this.photos = const [],
    this.authorId,
    this.authorName,
    this.difficulty = 'medium',
    required this.created,
    required this.updated,
  });

  @override
  List<Object?> get props => [
    id,
    title,
    description,
    suitableWoodTypeIds,
    suitableForms,
    photos,
    authorId,
    authorName,
    difficulty,
    created,
    updated,
  ];
}
