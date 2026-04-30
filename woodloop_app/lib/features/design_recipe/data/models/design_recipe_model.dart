import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/design_recipe.dart';

class DesignRecipeModel extends DesignRecipe {
  const DesignRecipeModel({
    required super.id,
    required super.title,
    super.description,
    super.suitableWoodTypeIds = const [],
    super.suitableForms = const [],
    super.photos = const [],
    super.authorId,
    super.authorName,
    super.difficulty = 'medium',
    required super.created,
    required super.updated,
  });

  factory DesignRecipeModel.fromRecord(RecordModel record) {
    String? authorName;
    final expandedAuthor = record.get<RecordModel?>('expand.author');
    if (expandedAuthor != null) {
      authorName = expandedAuthor.getStringValue('name');
    }

    return DesignRecipeModel(
      id: record.id,
      title: record.getStringValue('title'),
      description: record.getStringValue('description'),
      suitableWoodTypeIds: record.getListValue<String>('suitable_wood_types'),
      suitableForms: record.getListValue<String>('suitable_forms'),
      photos: record.getListValue<String>('photos'),
      authorId: record.getStringValue('author'),
      authorName: authorName,
      difficulty:
          record.getStringValue('difficulty').isNotEmpty
              ? record.getStringValue('difficulty')
              : 'medium',
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
      updated:
          DateTime.tryParse(record.getStringValue('updated')) ?? DateTime.now(),
    );
  }

  static Map<String, dynamic> toBody({
    required String title,
    String? description,
    List<String>? suitableWoodTypeIds,
    List<String>? suitableForms,
    String? authorId,
    String difficulty = 'medium',
  }) {
    return {
      'title': title,
      'description': description ?? '',
      if (suitableWoodTypeIds != null)
        'suitable_wood_types': suitableWoodTypeIds,
      if (suitableForms != null) 'suitable_forms': suitableForms,
      if (authorId != null) 'author': authorId,
      'difficulty': difficulty,
    };
  }
}
