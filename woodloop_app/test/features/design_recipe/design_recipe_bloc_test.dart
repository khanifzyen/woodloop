import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:woodloop_app/features/design_recipe/domain/entities/design_recipe.dart';
import 'package:woodloop_app/features/design_recipe/domain/repositories/design_recipe_repository.dart';
import 'package:woodloop_app/features/design_recipe/presentation/bloc/design_recipe_bloc.dart';

class MockDesignRecipeRepository extends Mock
    implements DesignRecipeRepository {}

void main() {
  late MockDesignRecipeRepository repository;
  final now = DateTime(2026, 4, 30);

  final sampleRecipes = [
    DesignRecipe(
      id: 'dr1',
      title: 'Kursi Jati Minimalis',
      description: 'Dari limbah offcut besar',
      authorName: 'Studio Jepara',
      difficulty: 'medium',
      created: now,
      updated: now,
    ),
    DesignRecipe(
      id: 'dr2',
      title: 'Vas Bunga Kayu',
      description: 'Dari serbuk kayu mahoni',
      authorName: 'Studio Bandung',
      difficulty: 'easy',
      created: now,
      updated: now,
    ),
  ];

  setUp(() {
    repository = MockDesignRecipeRepository();
  });

  group('LoadDesignRecipes', () {
    blocTest<DesignRecipeBloc, DesignRecipeState>(
      'emits [DesignRecipeLoading, DesignRecipesLoaded] on success',
      build: () {
        when(() => repository.getDesignRecipes(difficulty: null))
            .thenAnswer((_) async => sampleRecipes);
        return DesignRecipeBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadDesignRecipes()),
      expect: () => [
        DesignRecipeLoading(),
        DesignRecipesLoaded(sampleRecipes),
      ],
    );

    blocTest<DesignRecipeBloc, DesignRecipeState>(
      'emits [DesignRecipeLoading, DesignRecipeError] on failure',
      build: () {
        when(() => repository.getDesignRecipes(difficulty: null))
            .thenThrow(Exception('Network error'));
        return DesignRecipeBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadDesignRecipes()),
      expect: () => [
        DesignRecipeLoading(),
        isA<DesignRecipeError>(),
      ],
    );
  });

  group('LoadDesignRecipeDetail', () {
    blocTest<DesignRecipeBloc, DesignRecipeState>(
      'emits [DesignRecipeLoading, DesignRecipeDetailLoaded] on success',
      build: () {
        when(() => repository.getDesignRecipeById('dr1'))
            .thenAnswer((_) async => sampleRecipes.first);
        return DesignRecipeBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadDesignRecipeDetail('dr1')),
      expect: () => [
        DesignRecipeLoading(),
        DesignRecipeDetailLoaded(sampleRecipes.first),
      ],
    );

    blocTest<DesignRecipeBloc, DesignRecipeState>(
      'emits [DesignRecipeLoading, DesignRecipeError] on failure',
      build: () {
        when(() => repository.getDesignRecipeById('bad'))
            .thenThrow(Exception('Not found'));
        return DesignRecipeBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadDesignRecipeDetail('bad')),
      expect: () => [
        DesignRecipeLoading(),
        isA<DesignRecipeError>(),
      ],
    );
  });

  group('CreateDesignRecipe', () {
    final body = <String, dynamic>{
      'title': 'New Recipe',
      'difficulty': 'easy',
    };

    blocTest<DesignRecipeBloc, DesignRecipeState>(
      'emits [DesignRecipeLoading, DesignRecipesLoaded] on create success',
      build: () {
        when(() => repository.createDesignRecipe(body))
            .thenAnswer((_) async => sampleRecipes.first);
        when(() => repository.getDesignRecipes(difficulty: null))
            .thenAnswer((_) async => sampleRecipes);
        return DesignRecipeBloc(repository);
      },
      act: (bloc) => bloc.add(CreateDesignRecipe(body)),
      expect: () => [
        DesignRecipeLoading(),
        DesignRecipesLoaded(sampleRecipes),
      ],
    );
  });

  group('DeleteDesignRecipe', () {
    blocTest<DesignRecipeBloc, DesignRecipeState>(
      'emits [DesignRecipesLoaded] on delete success',
      build: () {
        when(() => repository.deleteDesignRecipe('dr1'))
            .thenAnswer((_) async {});
        when(() => repository.getDesignRecipes(difficulty: null))
            .thenAnswer((_) async => sampleRecipes);
        return DesignRecipeBloc(repository);
      },
      act: (bloc) => bloc.add(const DeleteDesignRecipe('dr1')),
      expect: () => [
        DesignRecipesLoaded(sampleRecipes),
      ],
    );
  });
}
