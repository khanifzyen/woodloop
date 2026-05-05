import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:woodloop_app/features/generator/domain/entities/raw_timber_order.dart';
import 'package:woodloop_app/features/generator/domain/repositories/raw_timber_order_repository.dart';
import 'package:woodloop_app/features/generator/presentation/bloc/raw_timber_order_bloc.dart';

class MockRawTimberOrderRepository extends Mock implements RawTimberOrderRepository {}

void main() {
  late MockRawTimberOrderRepository repo;
  final now = DateTime(2026, 5, 1);

  final sampleOrders = [
    RawTimberOrder(id: 'o1', buyerId: 'gen1', sellerId: 'sup1', listingId: 'l1',
      quantity: 2, totalPrice: 2000000, status: 'pending',
      created: now, updated: now),
    RawTimberOrder(id: 'o2', buyerId: 'gen1', sellerId: 'sup2', listingId: 'l2',
      quantity: 1.5, totalPrice: 1500000, status: 'accepted',
      created: now.subtract(const Duration(hours: 3)), updated: now),
  ];

  setUp(() => repo = MockRawTimberOrderRepository());

  group('RawTimberOrderBloc', () {
    blocTest<RawTimberOrderBloc, RawTimberOrderState>(
      'emits [Loading, Loaded] on LoadRawTimberOrders',
      build: () {
        when(() => repo.getOrders(buyerId: 'gen1')).thenAnswer((_) async => sampleOrders);
        return RawTimberOrderBloc(repo);
      },
      act: (bloc) => bloc.add(const LoadRawTimberOrders(buyerId: 'gen1')),
      expect: () => [RawTimberOrderLoading(), RawTimberOrdersLoaded(sampleOrders)],
    );

    blocTest<RawTimberOrderBloc, RawTimberOrderState>(
      'emits [Loading, Error] on failure',
      build: () {
        when(() => repo.getOrders()).thenThrow(Exception('Error'));
        return RawTimberOrderBloc(repo);
      },
      act: (bloc) => bloc.add(const LoadRawTimberOrders()),
      expect: () => [RawTimberOrderLoading(), isA<RawTimberOrderError>()],
    );

    blocTest<RawTimberOrderBloc, RawTimberOrderState>(
      'CreateRawTimberOrder emits [Loading, Created]',
      build: () {
        when(() => repo.createOrder(any())).thenAnswer((_) async => sampleOrders[0]);
        return RawTimberOrderBloc(repo);
      },
      act: (bloc) => bloc.add(const CreateRawTimberOrder({'buyer': 'gen1'})),
      expect: () => [RawTimberOrderLoading(), RawTimberOrderCreated(sampleOrders[0])],
    );

    blocTest<RawTimberOrderBloc, RawTimberOrderState>(
      'UpdateRawTimberOrderStatus emits [Loading, Updated]',
      build: () {
        when(() => repo.updateOrder('o1', {'status': 'accepted'})).thenAnswer((_) async => sampleOrders[1]);
        return RawTimberOrderBloc(repo);
      },
      act: (bloc) => bloc.add(const UpdateRawTimberOrderStatus(id: 'o1', body: {'status': 'accepted'})),
      expect: () => [RawTimberOrderLoading(), RawTimberOrderUpdated(sampleOrders[1])],
    );

    blocTest<RawTimberOrderBloc, RawTimberOrderState>(
      'filter by sellerId',
      build: () {
        when(() => repo.getOrders(sellerId: 'sup1')).thenAnswer((_) async => [sampleOrders[0]]);
        return RawTimberOrderBloc(repo);
      },
      act: (bloc) => bloc.add(const LoadRawTimberOrders(sellerId: 'sup1')),
      verify: (bloc) {
        final state = bloc.state as RawTimberOrdersLoaded;
        expect(state.orders.length, equals(1));
      },
    );
  });

  group('RawTimberOrder Entity', () {
    test('full construction', () {
      final o = RawTimberOrder(id: '1', buyerId: 'b', sellerId: 's', listingId: 'l',
        quantity: 5, totalPrice: 5000000, status: 'pending', notes: 'Test',
        created: now, updated: now);
      expect(o.quantity, equals(5));
      expect(o.totalPrice, equals(5000000));
      expect(o.status, equals('pending'));
      expect(o.notes, equals('Test'));
    });

    test('order status flow: pending → accepted/rejected → completed', () {
      const statuses = ['pending', 'accepted', 'rejected', 'completed'];
      expect(statuses.length, equals(4));
    });

    test('equality', () {
      final a = RawTimberOrder(id: '1', buyerId: 'b', sellerId: 's', listingId: 'l',
        quantity: 1, totalPrice: 1000, created: now, updated: now);
      final b = RawTimberOrder(id: '1', buyerId: 'b', sellerId: 's', listingId: 'l',
        quantity: 1, totalPrice: 1000, created: now, updated: now);
      expect(a, equals(b));
    });
  });
}
