import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:woodloop_app/features/buyer/domain/entities/cart_item.dart';
import 'package:woodloop_app/features/buyer/domain/repositories/cart_repository.dart';
import 'package:woodloop_app/features/buyer/presentation/bloc/cart_bloc.dart';

class MockCartRepository extends Mock implements CartRepository {}

void main() {
  late MockCartRepository mockRepository;

  final mockCartItem = CartItem(
    id: '1',
    buyerId: 'buyer1',
    productId: 'product1',
    quantity: 2,
    created: DateTime(2024, 1, 1),
    updated: DateTime(2024, 1, 1),
    productName: 'Wood Plank',
    productPrice: 25000.0,
  );

  setUp(() {
    mockRepository = MockCartRepository();
  });

  group('CartBloc', () {
    group('LoadCart', () {
      blocTest<CartBloc, CartState>(
        'emits [CartLoading, CartLoaded] when load succeeds',
        build: () {
          when(() => mockRepository.getCartItems(buyerId: any(named: 'buyerId')))
              .thenAnswer((_) async => [mockCartItem]);
          return CartBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadCart('buyer1')),
        expect: () => <CartState>[
          CartLoading(),
          CartLoaded([mockCartItem]),
        ],
      );

      blocTest<CartBloc, CartState>(
        'emits [CartLoading, CartError] when load fails',
        build: () {
          when(() => mockRepository.getCartItems(buyerId: any(named: 'buyerId')))
              .thenThrow(Exception('network error'));
          return CartBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadCart('buyer1')),
        expect: () => <CartState>[
          CartLoading(),
          CartError('Exception: network error'),
        ],
      );
    });

    group('AddToCart', () {
      const body = <String, dynamic>{
        'buyerId': 'buyer1',
        'productId': 'product1',
        'quantity': 1,
      };

      blocTest<CartBloc, CartState>(
        'emits [CartLoading, CartItemAdded] when add succeeds',
        build: () {
          when(() => mockRepository.addToCart(any()))
              .thenAnswer((_) async => mockCartItem);
          return CartBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const AddToCart(body)),
        expect: () => <CartState>[
          CartLoading(),
          CartItemAdded(),
        ],
      );

      blocTest<CartBloc, CartState>(
        'emits [CartLoading, CartError] when add fails',
        build: () {
          when(() => mockRepository.addToCart(any()))
              .thenThrow(Exception('add failed'));
          return CartBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const AddToCart(body)),
        expect: () => <CartState>[
          CartLoading(),
          CartError('Exception: add failed'),
        ],
      );
    });

    group('UpdateCartItemQuantity', () {
      blocTest<CartBloc, CartState>(
        'emits [CartLoading, CartItemAdded] when update succeeds',
        build: () {
          when(() => mockRepository.updateCartItem(any(), any()))
              .thenAnswer((_) async => mockCartItem);
          return CartBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdateCartItemQuantity(id: '1', quantity: 3),
        ),
        expect: () => <CartState>[
          CartLoading(),
          CartItemAdded(),
        ],
      );

      blocTest<CartBloc, CartState>(
        'emits [CartLoading, CartError] when update fails',
        build: () {
          when(() => mockRepository.updateCartItem(any(), any()))
              .thenThrow(Exception('update failed'));
          return CartBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdateCartItemQuantity(id: '1', quantity: 3),
        ),
        expect: () => <CartState>[
          CartLoading(),
          CartError('Exception: update failed'),
        ],
      );
    });

    group('RemoveFromCart', () {
      blocTest<CartBloc, CartState>(
        'emits [CartLoading, CartItemRemoved] when remove succeeds',
        build: () {
          when(() => mockRepository.removeFromCart(any()))
              .thenAnswer((_) async {});
          return CartBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const RemoveFromCart('1')),
        expect: () => <CartState>[
          CartLoading(),
          CartItemRemoved(),
        ],
      );

      blocTest<CartBloc, CartState>(
        'emits [CartLoading, CartError] when remove fails',
        build: () {
          when(() => mockRepository.removeFromCart(any()))
              .thenThrow(Exception('remove failed'));
          return CartBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const RemoveFromCart('1')),
        expect: () => <CartState>[
          CartLoading(),
          CartError('Exception: remove failed'),
        ],
      );
    });

    group('ClearCart', () {
      blocTest<CartBloc, CartState>(
        'emits [CartLoading, CartCleared] when clear succeeds',
        build: () {
          when(() => mockRepository.clearCart(any()))
              .thenAnswer((_) async {});
          return CartBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const ClearCart('buyer1')),
        expect: () => <CartState>[
          CartLoading(),
          CartCleared(),
        ],
      );

      blocTest<CartBloc, CartState>(
        'emits [CartLoading, CartError] when clear fails',
        build: () {
          when(() => mockRepository.clearCart(any()))
              .thenThrow(Exception('clear failed'));
          return CartBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const ClearCart('buyer1')),
        expect: () => <CartState>[
          CartLoading(),
          CartError('Exception: clear failed'),
        ],
      );
    });
  });
}
