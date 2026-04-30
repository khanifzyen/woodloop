import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:woodloop_app/features/converter/domain/entities/product.dart';
import 'package:woodloop_app/features/converter/domain/repositories/product_repository.dart';
import 'package:woodloop_app/features/converter/presentation/bloc/product_bloc.dart';

class MockProductRepository extends Mock implements ProductRepository {}

void main() {
  late MockProductRepository mockRepository;

  final mockProduct = Product(
    id: '1',
    converterId: 'conv1',
    name: 'Wood Plank',
    category: 'sawn',
    price: 25000.0,
    stock: 10,
    photos: [],
    sourceTransactionIds: [],
    created: DateTime(2024, 1, 1),
    updated: DateTime(2024, 1, 1),
  );

  setUp(() {
    mockRepository = MockProductRepository();
  });

  group('ProductBloc', () {
    group('LoadProducts', () {
      blocTest<ProductBloc, ProductState>(
        'emits [ProductLoading, ProductsLoaded] when load succeeds',
        build: () {
          when(() => mockRepository.getProducts(
                converterId: any(named: 'converterId'),
                category: any(named: 'category'),
              )).thenAnswer((_) async => [mockProduct]);
          return ProductBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadProducts()),
        expect: () => <ProductState>[
          ProductLoading(),
          ProductsLoaded([mockProduct]),
        ],
      );

      blocTest<ProductBloc, ProductState>(
        'emits [ProductLoading, ProductError] when load fails',
        build: () {
          when(() => mockRepository.getProducts(
                converterId: any(named: 'converterId'),
                category: any(named: 'category'),
              )).thenThrow(Exception('network error'));
          return ProductBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadProducts()),
        expect: () => <ProductState>[
          ProductLoading(),
          ProductError('Exception: network error'),
        ],
      );

      blocTest<ProductBloc, ProductState>(
        'passes converterId and category filter parameters',
        build: () {
          when(() => mockRepository.getProducts(
                converterId: any(named: 'converterId'),
                category: any(named: 'category'),
              )).thenAnswer((_) async => [mockProduct]);
          return ProductBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadProducts(
          converterId: 'conv1',
          category: 'sawn',
        )),
        expect: () => <ProductState>[
          ProductLoading(),
          ProductsLoaded([mockProduct]),
        ],
      );
    });

    group('LoadProductDetail', () {
      blocTest<ProductBloc, ProductState>(
        'emits [ProductLoading, ProductDetailLoaded] when load succeeds',
        build: () {
          when(() => mockRepository.getProductById(any()))
              .thenAnswer((_) async => mockProduct);
          return ProductBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadProductDetail('1')),
        expect: () => <ProductState>[
          ProductLoading(),
          ProductDetailLoaded(mockProduct),
        ],
      );

      blocTest<ProductBloc, ProductState>(
        'emits [ProductLoading, ProductError] when load fails',
        build: () {
          when(() => mockRepository.getProductById(any()))
              .thenThrow(Exception('not found'));
          return ProductBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadProductDetail('999')),
        expect: () => <ProductState>[
          ProductLoading(),
          ProductError('Exception: not found'),
        ],
      );
    });

    group('CreateProduct', () {
      const body = <String, dynamic>{
        'converterId': 'conv1',
        'name': 'Wood Plank',
        'category': 'sawn',
        'price': 25000.0,
      };

      blocTest<ProductBloc, ProductState>(
        'emits [ProductLoading, ProductCreated] when create succeeds',
        build: () {
          when(() => mockRepository.createProduct(any()))
              .thenAnswer((_) async => mockProduct);
          return ProductBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const CreateProduct(body)),
        expect: () => <ProductState>[
          ProductLoading(),
          ProductCreated(mockProduct),
        ],
      );

      blocTest<ProductBloc, ProductState>(
        'emits [ProductLoading, ProductError] when create fails',
        build: () {
          when(() => mockRepository.createProduct(any()))
              .thenThrow(Exception('creation failed'));
          return ProductBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const CreateProduct(body)),
        expect: () => <ProductState>[
          ProductLoading(),
          ProductError('Exception: creation failed'),
        ],
      );
    });

    group('UpdateProduct', () {
      const body = <String, dynamic>{'price': 30000.0};

      blocTest<ProductBloc, ProductState>(
        'emits [ProductLoading, ProductUpdated] when update succeeds',
        build: () {
          when(() => mockRepository.updateProduct(any(), any()))
              .thenAnswer((_) async => mockProduct);
          return ProductBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdateProduct(id: '1', body: body),
        ),
        expect: () => <ProductState>[
          ProductLoading(),
          ProductUpdated(mockProduct),
        ],
      );

      blocTest<ProductBloc, ProductState>(
        'emits [ProductLoading, ProductError] when update fails',
        build: () {
          when(() => mockRepository.updateProduct(any(), any()))
              .thenThrow(Exception('update failed'));
          return ProductBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdateProduct(id: '1', body: body),
        ),
        expect: () => <ProductState>[
          ProductLoading(),
          ProductError('Exception: update failed'),
        ],
      );
    });

    group('DeleteProduct', () {
      blocTest<ProductBloc, ProductState>(
        'emits [ProductLoading, ProductDeleted] when delete succeeds',
        build: () {
          when(() => mockRepository.deleteProduct(any()))
              .thenAnswer((_) async {});
          return ProductBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const DeleteProduct('1')),
        expect: () => <ProductState>[
          ProductLoading(),
          ProductDeleted(),
        ],
      );

      blocTest<ProductBloc, ProductState>(
        'emits [ProductLoading, ProductError] when delete fails',
        build: () {
          when(() => mockRepository.deleteProduct(any()))
              .thenThrow(Exception('delete failed'));
          return ProductBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const DeleteProduct('1')),
        expect: () => <ProductState>[
          ProductLoading(),
          ProductError('Exception: delete failed'),
        ],
      );
    });
  });
}
