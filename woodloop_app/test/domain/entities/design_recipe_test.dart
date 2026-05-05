import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/design_recipe/domain/entities/design_recipe.dart';

void main() {
  group('DesignRecipe', () {
    final now = DateTime(2026, 4, 30);

    test('creates with required fields', () {
      final recipe = DesignRecipe(
        id: 'dr1',
        title: 'Kursi Jati Minimalis',
        created: now,
        updated: now,
      );
      expect(recipe.id, 'dr1');
      expect(recipe.title, 'Kursi Jati Minimalis');
      expect(recipe.difficulty, 'medium');
    });

    test('optional fields default correctly', () {
      final recipe = DesignRecipe(
        id: 'dr2',
        title: 'Vas Bunga Limbah',
        created: now,
        updated: now,
      );
      expect(recipe.description, isNull);
      expect(recipe.suitableWoodTypeIds, []);
      expect(recipe.suitableForms, []);
      expect(recipe.photos, []);
      expect(recipe.authorId, isNull);
      expect(recipe.authorName, isNull);
    });

    test('full construction with all fields', () {
      final recipe = DesignRecipe(
        id: 'dr3',
        title: 'Meja Daur Ulang',
        description: 'Dari limbah jati dan mahoni',
        suitableWoodTypeIds: ['wt1', 'wt2'],
        suitableForms: ['offcut_large', 'offcut_small'],
        photos: ['p1.jpg'],
        authorId: 'u1',
        authorName: 'Studio Jepara',
        difficulty: 'hard',
        created: now,
        updated: now,
      );
      expect(recipe.suitableWoodTypeIds.length, 2);
      expect(recipe.authorName, 'Studio Jepara');
      expect(recipe.difficulty, 'hard');
    });

    test('props includes all fields', () {
      final recipe = DesignRecipe(
        id: 'dr4',
        title: 'X',
        created: now,
        updated: now,
      );
      expect(recipe.props.length, 11);
    });

    test('equality', () {
      final d = DateTime(2026, 1, 1);
      final a = DesignRecipe(
        id: 'x', title: 'T', created: d, updated: d,
      );
      final b = DesignRecipe(
        id: 'x', title: 'T', created: d, updated: d,
      );
      expect(a, b);
    });
  });
}
