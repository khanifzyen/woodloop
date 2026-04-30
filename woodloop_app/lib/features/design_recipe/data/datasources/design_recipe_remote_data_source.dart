import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../models/design_recipe_model.dart';

abstract class DesignRecipeRemoteDataSource {
  Future<List<DesignRecipeModel>> getDesignRecipes({
    String? difficulty,
    int page = 1,
    int perPage = 30,
  });

  Future<DesignRecipeModel> getDesignRecipeById(String id);
  Future<DesignRecipeModel> createDesignRecipe(Map<String, dynamic> body);
  Future<DesignRecipeModel> updateDesignRecipe(
    String id,
    Map<String, dynamic> body,
  );
  Future<void> deleteDesignRecipe(String id);
}

@LazySingleton(as: DesignRecipeRemoteDataSource)
class DesignRecipeRemoteDataSourceImpl implements DesignRecipeRemoteDataSource {
  final PocketBase pb;

  DesignRecipeRemoteDataSourceImpl(this.pb);

  @override
  Future<List<DesignRecipeModel>> getDesignRecipes({
    String? difficulty,
    int page = 1,
    int perPage = 30,
  }) async {
    final filters = <String>[];
    if (difficulty != null && difficulty.isNotEmpty) {
      filters.add('difficulty = "$difficulty"');
    }

    final result = await pb.collection('design_recipes').getList(
      page: page,
      perPage: perPage,
      filter: filters.isNotEmpty ? filters.join(' && ') : '',
      sort: '-created',
      expand: 'author,suitable_wood_types',
    );

    return result.items
        .map((record) => DesignRecipeModel.fromRecord(record))
        .toList();
  }

  @override
  Future<DesignRecipeModel> getDesignRecipeById(String id) async {
    final record = await pb
        .collection('design_recipes')
        .getOne(id, expand: 'author,suitable_wood_types');
    return DesignRecipeModel.fromRecord(record);
  }

  @override
  Future<DesignRecipeModel> createDesignRecipe(Map<String, dynamic> body) async {
    final record = await pb.collection('design_recipes').create(body: body);
    return DesignRecipeModel.fromRecord(record);
  }

  @override
  Future<DesignRecipeModel> updateDesignRecipe(
    String id,
    Map<String, dynamic> body,
  ) async {
    final record = await pb
        .collection('design_recipes')
        .update(id, body: body);
    return DesignRecipeModel.fromRecord(record);
  }

  @override
  Future<void> deleteDesignRecipe(String id) async {
    await pb.collection('design_recipes').delete(id);
  }
}
