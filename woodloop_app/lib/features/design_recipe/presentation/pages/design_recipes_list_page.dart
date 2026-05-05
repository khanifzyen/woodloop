import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../presentation/bloc/design_recipe_bloc.dart';
import '../../../../injection_container.dart';

class DesignRecipesListPage extends StatelessWidget {
  const DesignRecipesListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt<DesignRecipeBloc>()..add(const LoadDesignRecipes()),
      child: const _DesignRecipesListView(),
    );
  }
}

class _DesignRecipesListView extends StatelessWidget {
  const _DesignRecipesListView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Design Clinic',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: BlocBuilder<DesignRecipeBloc, DesignRecipeState>(
        builder: (context, state) {
          if (state is DesignRecipeLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is DesignRecipesLoaded) {
            if (state.recipes.isEmpty) {
              return const Center(
                child: Text(
                  'Belum ada resep desain',
                  style: TextStyle(color: Colors.white54, fontSize: 16),
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: state.recipes.length,
              itemBuilder: (context, index) {
                final recipe = state.recipes[index];
                return _buildRecipeCard(context, recipe);
              },
            );
          }

          if (state is DesignRecipeError) {
            return Center(
              child: Text(
                state.message,
                style: const TextStyle(color: Colors.redAccent),
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildRecipeCard(BuildContext context, dynamic recipe) {
    final difficultyColors = {
      'easy': Colors.green,
      'medium': Colors.orange,
      'hard': Colors.red,
    };
    final difficultyColor = difficultyColors[recipe.difficulty] ?? Colors.grey;

    return GestureDetector(
      onTap: () {
        context.pushNamed('design_recipe_detail', extra: recipe.id);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    recipe.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: difficultyColor.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    recipe.difficulty.toUpperCase(),
                    style: TextStyle(
                      color: difficultyColor,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            if (recipe.description != null && recipe.description!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                recipe.description!,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(color: Colors.white54, fontSize: 14),
              ),
            ],
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.person, color: Colors.white38, size: 14),
                const SizedBox(width: 4),
                Text(
                  recipe.authorName ?? 'WoodLoop Community',
                  style: const TextStyle(color: Colors.white38, fontSize: 12),
                ),
                const Spacer(),
                if (recipe.suitableForms.isNotEmpty)
                  ...recipe.suitableForms.take(2).map(
                        (form) => Padding(
                          padding: const EdgeInsets.only(left: 4),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              form.replaceAll('_', ' '),
                              style: const TextStyle(
                                color: AppTheme.primaryColor,
                                fontSize: 10,
                              ),
                            ),
                          ),
                        ),
                      ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
