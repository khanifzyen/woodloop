part of 'design_recipe_bloc.dart';

abstract class DesignRecipeEvent extends Equatable {
  const DesignRecipeEvent();

  @override
  List<Object?> get props => [];
}

class LoadDesignRecipes extends DesignRecipeEvent {
  final String? difficulty;
  const LoadDesignRecipes({this.difficulty});

  @override
  List<Object?> get props => [difficulty];
}

class LoadDesignRecipeDetail extends DesignRecipeEvent {
  final String id;
  const LoadDesignRecipeDetail(this.id);

  @override
  List<Object?> get props => [id];
}

class CreateDesignRecipe extends DesignRecipeEvent {
  final Map<String, dynamic> data;
  const CreateDesignRecipe(this.data);

  @override
  List<Object?> get props => [data];
}

class UpdateDesignRecipe extends DesignRecipeEvent {
  final String id;
  final Map<String, dynamic> data;
  const UpdateDesignRecipe(this.id, this.data);

  @override
  List<Object?> get props => [id, data];
}

class DeleteDesignRecipe extends DesignRecipeEvent {
  final String id;
  const DeleteDesignRecipe(this.id);

  @override
  List<Object?> get props => [id];
}
