import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:woodloop_app/features/aggregator/domain/entities/warehouse_item.dart';
import 'package:woodloop_app/features/aggregator/domain/repositories/warehouse_repository.dart';
import 'package:woodloop_app/features/aggregator/presentation/bloc/warehouse_bloc.dart';

class MockWarehouseRepository extends Mock implements WarehouseRepository {}

void main() {
  late MockWarehouseRepository mockRepository;

  final mockItem = WarehouseItem(
    id: '1',
    aggregatorId: 'agg1',
    pickupId: 'pickup1',
    form: 'log',
    weight: 150.0,
    status: 'stored',
    photos: [],
    created: DateTime(2024, 1, 1),
    updated: DateTime(2024, 1, 1),
  );

  setUp(() {
    mockRepository = MockWarehouseRepository();
  });

  group('WarehouseBloc', () {
    group('LoadWarehouseItems', () {
      blocTest<WarehouseBloc, WarehouseState>(
        'emits [WarehouseLoading, WarehouseItemsLoaded] when load succeeds',
        build: () {
          when(() => mockRepository.getWarehouseItems(
                aggregatorId: any(named: 'aggregatorId'),
                status: any(named: 'status'),
              )).thenAnswer((_) async => [mockItem]);
          return WarehouseBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadWarehouseItems()),
        expect: () => <WarehouseState>[
          WarehouseLoading(),
          WarehouseItemsLoaded([mockItem]),
        ],
      );

      blocTest<WarehouseBloc, WarehouseState>(
        'emits [WarehouseLoading, WarehouseError] when load fails',
        build: () {
          when(() => mockRepository.getWarehouseItems(
                aggregatorId: any(named: 'aggregatorId'),
                status: any(named: 'status'),
              )).thenThrow(Exception('network error'));
          return WarehouseBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadWarehouseItems()),
        expect: () => <WarehouseState>[
          WarehouseLoading(),
          WarehouseError('Exception: network error'),
        ],
      );

      blocTest<WarehouseBloc, WarehouseState>(
        'passes aggregatorId and status filter parameters',
        build: () {
          when(() => mockRepository.getWarehouseItems(
                aggregatorId: any(named: 'aggregatorId'),
                status: any(named: 'status'),
              )).thenAnswer((_) async => [mockItem]);
          return WarehouseBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadWarehouseItems(
          aggregatorId: 'agg1',
          status: 'stored',
        )),
        expect: () => <WarehouseState>[
          WarehouseLoading(),
          WarehouseItemsLoaded([mockItem]),
        ],
      );
    });

    group('LoadWarehouseItemDetail', () {
      blocTest<WarehouseBloc, WarehouseState>(
        'emits [WarehouseLoading, WarehouseItemDetailLoaded] when load succeeds',
        build: () {
          when(() => mockRepository.getWarehouseItemById(any()))
              .thenAnswer((_) async => mockItem);
          return WarehouseBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadWarehouseItemDetail('1')),
        expect: () => <WarehouseState>[
          WarehouseLoading(),
          WarehouseItemDetailLoaded(mockItem),
        ],
      );

      blocTest<WarehouseBloc, WarehouseState>(
        'emits [WarehouseLoading, WarehouseError] when load fails',
        build: () {
          when(() => mockRepository.getWarehouseItemById(any()))
              .thenThrow(Exception('not found'));
          return WarehouseBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadWarehouseItemDetail('999')),
        expect: () => <WarehouseState>[
          WarehouseLoading(),
          WarehouseError('Exception: not found'),
        ],
      );
    });

    group('UpdateWarehouseItem', () {
      const body = <String, dynamic>{'status': 'processed'};

      blocTest<WarehouseBloc, WarehouseState>(
        'emits [WarehouseLoading, WarehouseItemUpdated] when update succeeds',
        build: () {
          when(() => mockRepository.updateWarehouseItem(any(), any()))
              .thenAnswer((_) async => mockItem);
          return WarehouseBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdateWarehouseItem(id: '1', body: body),
        ),
        expect: () => <WarehouseState>[
          WarehouseLoading(),
          WarehouseItemUpdated(mockItem),
        ],
      );

      blocTest<WarehouseBloc, WarehouseState>(
        'emits [WarehouseLoading, WarehouseError] when update fails',
        build: () {
          when(() => mockRepository.updateWarehouseItem(any(), any()))
              .thenThrow(Exception('update failed'));
          return WarehouseBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdateWarehouseItem(id: '1', body: body),
        ),
        expect: () => <WarehouseState>[
          WarehouseLoading(),
          WarehouseError('Exception: update failed'),
        ],
      );
    });
  });
}
