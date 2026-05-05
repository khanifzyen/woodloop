import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../presentation/bloc/design_recipe_bloc.dart';
import '../../../../injection_container.dart';

class DesignRecipeDetailPage extends StatelessWidget {
  final String recipeId;
  const DesignRecipeDetailPage({super.key, required this.recipeId});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          getIt<DesignRecipeBloc>()..add(LoadDesignRecipeDetail(recipeId)),
      child: const _DesignRecipeDetailView(),
    );
  }
}

class _DesignRecipeDetailView extends StatelessWidget {
  const _DesignRecipeDetailView();

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
          'Detail Resep',
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

          if (state is DesignRecipeDetailLoaded) {
            final recipe = state.recipe;
            final difficultyColors = {
              'easy': Colors.green,
              'medium': Colors.orange,
              'hard': Colors.red,
            };
            final difficultyColor =
                difficultyColors[recipe.difficulty] ?? Colors.grey;

            return SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Difficulty badge
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: difficultyColor.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: difficultyColor.withValues(alpha: 0.4),
                          ),
                        ),
                        child: Text(
                          recipe.difficulty.toUpperCase(),
                          style: TextStyle(
                            color: difficultyColor,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Title
                  Text(
                    recipe.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Author
                  Row(
                    children: [
                      const Icon(Icons.person, color: Colors.white38, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        recipe.authorName ?? 'WoodLoop Community',
                        style: const TextStyle(
                          color: Colors.white38,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Description
                  if (recipe.description != null &&
                      recipe.description!.isNotEmpty) ...[
                    const Text(
                      'Deskripsi',
                      style: TextStyle(
                        color: Colors.white54,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      recipe.description!,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Suitable wood types
                  if (recipe.suitableWoodTypeIds.isNotEmpty) ...[
                    const Text(
                      'Jenis Kayu yang Cocok',
                      style: TextStyle(
                        color: Colors.white54,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: recipe.suitableWoodTypeIds.map((id) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceColor,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.08),
                            ),
                          ),
                          child: Text(
                            id,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 13,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Suitable forms
                  if (recipe.suitableForms.isNotEmpty) ...[
                    const Text(
                      'Bentuk Limbah yang Cocok',
                      style: TextStyle(
                        color: Colors.white54,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: recipe.suitableForms.map((form) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            form.replaceAll('_', ' '),
                            style: const TextStyle(
                              color: AppTheme.primaryColor,
                              fontSize: 13,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Photos placeholder
                  if (recipe.photos.isNotEmpty) ...[
                    const Text(
                      'Foto',
                      style: TextStyle(
                        color: Colors.white54,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 120,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: recipe.photos.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 12),
                        itemBuilder: (context, index) {
                          return Container(
                            width: 120,
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceColor,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.08),
                              ),
                            ),
                            child: const Center(
                              child: Icon(
                                Icons.image,
                                color: Colors.white38,
                                size: 32,
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ],
              ),
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
}
