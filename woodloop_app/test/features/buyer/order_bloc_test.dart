import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:woodloop_app/features/buyer/domain/entities/order.dart';
import 'package:woodloop_app/features/buyer/domain/repositories/order_repository.dart';
import 'package:woodloop_app/features/buyer/presentation/bloc/order_bloc.dart';

class MockOrderRepository extends Mock implements OrderRepository {}

void main() {
  late MockOrderRepository mockRepository;

  final mockOrder = Order(
    id: '1',
    buyerId: 'buyer1',
    productId: 'product1',
    quantity: 2,
    totalPrice: 50000.0,
    status: 'pending',
    shippingAddress: '123 Main St',
    created: DateTime(2024, 1, 1),
    updated: DateTime(2024, 1, 1),
  );

  setUp(() {
    mockRepository = MockOrderRepository();
  });

  group('OrderBloc', () {
    group('LoadOrders', () {
      blocTest<OrderBloc, OrderState>(
        'emits [OrderLoading, OrdersLoaded] when load succeeds',
        build: () {
          when(() => mockRepository.getOrders(
                buyerId: any(named: 'buyerId'),
                status: any(named: 'status'),
              )).thenAnswer((_) async => [mockOrder]);
          return OrderBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadOrders()),
        expect: () => <OrderState>[
          OrderLoading(),
          OrdersLoaded([mockOrder]),
        ],
      );

      blocTest<OrderBloc, OrderState>(
        'emits [OrderLoading, OrderError] when load fails',
        build: () {
          when(() => mockRepository.getOrders(
                buyerId: any(named: 'buyerId'),
                status: any(named: 'status'),
              )).thenThrow(Exception('network error'));
          return OrderBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadOrders()),
        expect: () => <OrderState>[
          OrderLoading(),
          OrderError('Exception: network error'),
        ],
      );

      blocTest<OrderBloc, OrderState>(
        'passes buyerId and status filter parameters',
        build: () {
          when(() => mockRepository.getOrders(
                buyerId: any(named: 'buyerId'),
                status: any(named: 'status'),
              )).thenAnswer((_) async => [mockOrder]);
          return OrderBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadOrders(
          buyerId: 'buyer1',
          status: 'pending',
        )),
        expect: () => <OrderState>[
          OrderLoading(),
          OrdersLoaded([mockOrder]),
        ],
      );
    });

    group('LoadOrderDetail', () {
      blocTest<OrderBloc, OrderState>(
        'emits [OrderLoading, OrderDetailLoaded] when load succeeds',
        build: () {
          when(() => mockRepository.getOrderById(any()))
              .thenAnswer((_) async => mockOrder);
          return OrderBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadOrderDetail('1')),
        expect: () => <OrderState>[
          OrderLoading(),
          OrderDetailLoaded(mockOrder),
        ],
      );

      blocTest<OrderBloc, OrderState>(
        'emits [OrderLoading, OrderError] when load fails',
        build: () {
          when(() => mockRepository.getOrderById(any()))
              .thenThrow(Exception('not found'));
          return OrderBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadOrderDetail('999')),
        expect: () => <OrderState>[
          OrderLoading(),
          OrderError('Exception: not found'),
        ],
      );
    });

    group('CreateOrder', () {
      const body = <String, dynamic>{
        'buyerId': 'buyer1',
        'productId': 'product1',
        'quantity': 2,
        'shippingAddress': '123 Main St',
      };

      blocTest<OrderBloc, OrderState>(
        'emits [OrderLoading, OrderCreated] when create succeeds',
        build: () {
          when(() => mockRepository.createOrder(any()))
              .thenAnswer((_) async => mockOrder);
          return OrderBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const CreateOrder(body)),
        expect: () => <OrderState>[
          OrderLoading(),
          OrderCreated(mockOrder),
        ],
      );

      blocTest<OrderBloc, OrderState>(
        'emits [OrderLoading, OrderError] when create fails',
        build: () {
          when(() => mockRepository.createOrder(any()))
              .thenThrow(Exception('creation failed'));
          return OrderBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const CreateOrder(body)),
        expect: () => <OrderState>[
          OrderLoading(),
          OrderError('Exception: creation failed'),
        ],
      );
    });

    group('UpdateOrderStatus', () {
      const body = <String, dynamic>{'status': 'shipped'};

      blocTest<OrderBloc, OrderState>(
        'emits [OrderLoading, OrderUpdated] when update succeeds',
        build: () {
          when(() => mockRepository.updateOrder(any(), any()))
              .thenAnswer((_) async => mockOrder);
          return OrderBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdateOrderStatus(id: '1', body: body),
        ),
        expect: () => <OrderState>[
          OrderLoading(),
          OrderUpdated(mockOrder),
        ],
      );

      blocTest<OrderBloc, OrderState>(
        'emits [OrderLoading, OrderError] when update fails',
        build: () {
          when(() => mockRepository.updateOrder(any(), any()))
              .thenThrow(Exception('update failed'));
          return OrderBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdateOrderStatus(id: '1', body: body),
        ),
        expect: () => <OrderState>[
          OrderLoading(),
          OrderError('Exception: update failed'),
        ],
      );
    });
  });
}
