import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:woodloop_app/features/generator/domain/entities/generator_product.dart';
import 'package:woodloop_app/features/generator/domain/repositories/generator_product_repository.dart';
import 'package:woodloop_app/features/generator/presentation/bloc/generator_product_bloc.dart';

class MockGeneratorProductRepository extends Mock
    implements GeneratorProductRepository {}

void main() {
  late MockGeneratorProductRepository repository;

  final now = DateTime(2026, 5, 1);
  const productId = 'gp1';

  final sampleProduct = GeneratorProduct(
    id: productId,
    generatorId: 'gen1',
    name: 'Kursi Jati Minimalis',
    description: 'Kursi dari kayu jati pilihan',
    category: 'furniture',
    price: 1500000,
    stock: 5,
    photos: ['photo1.jpg', 'photo2.jpg'],
    woodTypeId: 'wt1',
    status: 'active',
    created: now,
    updated: now,
  );

  final sampleProducts = [sampleProduct];

  setUp(() {
    repository = MockGeneratorProductRepository();
  });

  group('LoadGeneratorProducts', () {
    blocTest<GeneratorProductBloc, GeneratorProductState>(
      'emits [GeneratorProductLoading, GeneratorProductsLoaded] on success',
      build: () {
        when(() => repository.getGeneratorProducts(
              generatorId: any(named: 'generatorId'),
              status: any(named: 'status'),
              category: any(named: 'category'),
            )).thenAnswer((_) async => sampleProducts);
        return GeneratorProductBloc(repository);
      },
      act: (bloc) => bloc.add(
        const LoadGeneratorProducts(generatorId: 'gen1', status: 'active'),
      ),
      expect: () => [
        GeneratorProductLoading(),
        GeneratorProductsLoaded(sampleProducts),
      ],
    );

    blocTest<GeneratorProductBloc, GeneratorProductState>(
      'emits [GeneratorProductLoading, GeneratorProductError] on failure',
      build: () {
        when(() => repository.getGeneratorProducts(
              generatorId: any(named: 'generatorId'),
              status: any(named: 'status'),
              category: any(named: 'category'),
            )).thenThrow(Exception('Network error'));
        return GeneratorProductBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadGeneratorProducts()),
      expect: () => [
        GeneratorProductLoading(),
        isA<GeneratorProductError>(),
      ],
    );

    blocTest<GeneratorProductBloc, GeneratorProductState>(
      'filters by category when provided',
      build: () {
        when(() => repository.getGeneratorProducts(
              generatorId: any(named: 'generatorId'),
              status: any(named: 'status'),
              category: 'furniture',
            )).thenAnswer((_) async => sampleProducts);
        return GeneratorProductBloc(repository);
      },
      act: (bloc) => bloc.add(
        const LoadGeneratorProducts(generatorId: 'gen1', category: 'furniture'),
      ),
      expect: () => [
        GeneratorProductLoading(),
        GeneratorProductsLoaded(sampleProducts),
      ],
    );
  });

  group('LoadGeneratorProductDetail', () {
    blocTest<GeneratorProductBloc, GeneratorProductState>(
      'emits [GeneratorProductLoading, GeneratorProductDetailLoaded] on success',
      build: () {
        when(() => repository.getGeneratorProductById(productId))
            .thenAnswer((_) async => sampleProduct);
        return GeneratorProductBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadGeneratorProductDetail(productId)),
      expect: () => [
        GeneratorProductLoading(),
        GeneratorProductDetailLoaded(sampleProduct),
      ],
    );

    blocTest<GeneratorProductBloc, GeneratorProductState>(
      'emits [GeneratorProductLoading, GeneratorProductError] on failure',
      build: () {
        when(() => repository.getGeneratorProductById(productId))
            .thenThrow(Exception('Not found'));
        return GeneratorProductBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadGeneratorProductDetail(productId)),
      expect: () => [
        GeneratorProductLoading(),
        isA<GeneratorProductError>(),
      ],
    );
  });

  group('CreateGeneratorProduct', () {
    final body = <String, dynamic>{
      'generator': 'gen1',
      'name': 'Meja Tamu',
      'category': 'furniture',
      'price': 2500000,
      'stock': 3,
    };

    blocTest<GeneratorProductBloc, GeneratorProductState>(
      'emits [GeneratorProductLoading, GeneratorProductCreated] on success',
      build: () {
        when(() => repository.createGeneratorProduct(body))
            .thenAnswer((_) async => sampleProduct);
        return GeneratorProductBloc(repository);
      },
      act: (bloc) => bloc.add(CreateGeneratorProduct(body)),
      expect: () => [
        GeneratorProductLoading(),
        GeneratorProductCreated(sampleProduct),
      ],
    );

    blocTest<GeneratorProductBloc, GeneratorProductState>(
      'emits [GeneratorProductLoading, GeneratorProductError] on failure',
      build: () {
        when(() => repository.createGeneratorProduct(body))
            .thenThrow(Exception('Validation error'));
        return GeneratorProductBloc(repository);
      },
      act: (bloc) => bloc.add(CreateGeneratorProduct(body)),
      expect: () => [
        GeneratorProductLoading(),
        isA<GeneratorProductError>(),
      ],
    );
  });

  group('UpdateGeneratorProduct', () {
    final body = <String, dynamic>{'price': 1200000, 'stock': 8};

    blocTest<GeneratorProductBloc, GeneratorProductState>(
      'emits [GeneratorProductLoading, GeneratorProductUpdated] on success',
      build: () {
        when(() => repository.updateGeneratorProduct(productId, body))
            .thenAnswer((_) async => sampleProduct);
        return GeneratorProductBloc(repository);
      },
      act: (bloc) => bloc.add(
        UpdateGeneratorProduct(id: productId, body: body),
      ),
      expect: () => [
        GeneratorProductLoading(),
        GeneratorProductUpdated(sampleProduct),
      ],
    );

    blocTest<GeneratorProductBloc, GeneratorProductState>(
      'emits [GeneratorProductLoading, GeneratorProductError] on failure',
      build: () {
        when(() => repository.updateGeneratorProduct(productId, body))
            .thenThrow(Exception('Update failed'));
        return GeneratorProductBloc(repository);
      },
      act: (bloc) => bloc.add(
        UpdateGeneratorProduct(id: productId, body: body),
      ),
      expect: () => [
        GeneratorProductLoading(),
        isA<GeneratorProductError>(),
      ],
    );
  });

  group('DeleteGeneratorProduct', () {
    blocTest<GeneratorProductBloc, GeneratorProductState>(
      'emits [GeneratorProductLoading, GeneratorProductDeleted] on success',
      build: () {
        when(() => repository.deleteGeneratorProduct(productId))
            .thenAnswer((_) async {});
        return GeneratorProductBloc(repository);
      },
      act: (bloc) => bloc.add(const DeleteGeneratorProduct(productId)),
      expect: () => [
        GeneratorProductLoading(),
        GeneratorProductDeleted(),
      ],
    );

    blocTest<GeneratorProductBloc, GeneratorProductState>(
      'emits [GeneratorProductLoading, GeneratorProductError] on failure',
      build: () {
        when(() => repository.deleteGeneratorProduct(productId))
            .thenThrow(Exception('Delete failed'));
        return GeneratorProductBloc(repository);
      },
      act: (bloc) => bloc.add(const DeleteGeneratorProduct(productId)),
      expect: () => [
        GeneratorProductLoading(),
        isA<GeneratorProductError>(),
      ],
    );
  });
}
