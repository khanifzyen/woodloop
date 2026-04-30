import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import '../../domain/entities/design_recipe.dart';
import '../../domain/repositories/design_recipe_repository.dart';

part 'design_recipe_event.dart';
part 'design_recipe_state.dart';

@injectable
class DesignRecipeBloc extends Bloc<DesignRecipeEvent, DesignRecipeState> {
  final DesignRecipeRepository _repository;

  DesignRecipeBloc(this._repository) : super(DesignRecipeInitial()) {
    on<LoadDesignRecipes>(_onLoadDesignRecipes);
    on<LoadDesignRecipeDetail>(_onLoadDesignRecipeDetail);
    on<CreateDesignRecipe>(_onCreateDesignRecipe);
    on<UpdateDesignRecipe>(_onUpdateDesignRecipe);
    on<DeleteDesignRecipe>(_onDeleteDesignRecipe);
  }

  Future<void> _onLoadDesignRecipes(
    LoadDesignRecipes event,
    Emitter<DesignRecipeState> emit,
  ) async {
    emit(DesignRecipeLoading());
    try {
      final recipes =
          await _repository.getDesignRecipes(difficulty: event.difficulty);
      emit(DesignRecipesLoaded(recipes));
    } catch (e) {
      emit(DesignRecipeError(e.toString()));
    }
  }

  Future<void> _onLoadDesignRecipeDetail(
    LoadDesignRecipeDetail event,
    Emitter<DesignRecipeState> emit,
  ) async {
    emit(DesignRecipeLoading());
    try {
      final recipe = await _repository.getDesignRecipeById(event.id);
      emit(DesignRecipeDetailLoaded(recipe));
    } catch (e) {
      emit(DesignRecipeError(e.toString()));
    }
  }

  Future<void> _onCreateDesignRecipe(
    CreateDesignRecipe event,
    Emitter<DesignRecipeState> emit,
  ) async {
    emit(DesignRecipeLoading());
    try {
      await _repository.createDesignRecipe(event.data);
      final recipes = await _repository.getDesignRecipes();
      emit(DesignRecipesLoaded(recipes));
    } catch (e) {
      emit(DesignRecipeError(e.toString()));
    }
  }

  Future<void> _onUpdateDesignRecipe(
    UpdateDesignRecipe event,
    Emitter<DesignRecipeState> emit,
  ) async {
    try {
      final recipe = await _repository.updateDesignRecipe(event.id, event.data);
      emit(DesignRecipeDetailLoaded(recipe));
    } catch (e) {
      emit(DesignRecipeError(e.toString()));
    }
  }

  Future<void> _onDeleteDesignRecipe(
    DeleteDesignRecipe event,
    Emitter<DesignRecipeState> emit,
  ) async {
    try {
      await _repository.deleteDesignRecipe(event.id);
      final recipes = await _repository.getDesignRecipes();
      emit(DesignRecipesLoaded(recipes));
    } catch (e) {
      emit(DesignRecipeError(e.toString()));
    }
  }
}
