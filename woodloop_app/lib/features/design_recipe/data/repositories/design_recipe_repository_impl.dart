import 'package:injectable/injectable.dart';
import '../../domain/entities/design_recipe.dart';
import '../../domain/repositories/design_recipe_repository.dart';
import '../datasources/design_recipe_remote_data_source.dart';

@LazySingleton(as: DesignRecipeRepository)
class DesignRecipeRepositoryImpl implements DesignRecipeRepository {
  final DesignRecipeRemoteDataSource _remoteDataSource;

  DesignRecipeRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<DesignRecipe>> getDesignRecipes({String? difficulty}) async {
    return await _remoteDataSource.getDesignRecipes(difficulty: difficulty);
  }

  @override
  Future<DesignRecipe> getDesignRecipeById(String id) async {
    return await _remoteDataSource.getDesignRecipeById(id);
  }

  @override
  Future<DesignRecipe> createDesignRecipe(Map<String, dynamic> body) async {
    return await _remoteDataSource.createDesignRecipe(body);
  }

  @override
  Future<DesignRecipe> updateDesignRecipe(
    String id,
    Map<String, dynamic> body,
  ) async {
    return await _remoteDataSource.updateDesignRecipe(id, body);
  }

  @override
  Future<void> deleteDesignRecipe(String id) async {
    await _remoteDataSource.deleteDesignRecipe(id);
  }
}
