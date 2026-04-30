part of 'design_recipe_bloc.dart';

abstract class DesignRecipeState extends Equatable {
  const DesignRecipeState();

  @override
  List<Object?> get props => [];
}

class DesignRecipeInitial extends DesignRecipeState {}

class DesignRecipeLoading extends DesignRecipeState {}

class DesignRecipesLoaded extends DesignRecipeState {
  final List<DesignRecipe> recipes;
  const DesignRecipesLoaded(this.recipes);

  @override
  List<Object?> get props => [recipes];
}

class DesignRecipeDetailLoaded extends DesignRecipeState {
  final DesignRecipe recipe;
  const DesignRecipeDetailLoaded(this.recipe);

  @override
  List<Object?> get props => [recipe];
}

class DesignRecipeError extends DesignRecipeState {
  final String message;
  const DesignRecipeError(this.message);

  @override
  List<Object?> get props => [message];
}
