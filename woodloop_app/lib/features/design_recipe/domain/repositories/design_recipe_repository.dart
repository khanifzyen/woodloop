import '../../domain/entities/design_recipe.dart';

abstract class DesignRecipeRepository {
  Future<List<DesignRecipe>> getDesignRecipes({String? difficulty});
  Future<DesignRecipe> getDesignRecipeById(String id);
  Future<DesignRecipe> createDesignRecipe(Map<String, dynamic> body);
  Future<DesignRecipe> updateDesignRecipe(String id, Map<String, dynamic> body);
  Future<void> deleteDesignRecipe(String id);
}
