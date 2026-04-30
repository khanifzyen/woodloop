import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:woodloop_app/features/aggregator/domain/entities/pickup.dart';
import 'package:woodloop_app/features/aggregator/domain/repositories/pickup_repository.dart';
import 'package:woodloop_app/features/aggregator/presentation/bloc/pickup_bloc.dart';

class MockPickupRepository extends Mock implements PickupRepository {}

void main() {
  late MockPickupRepository mockRepository;

  final mockPickup = Pickup(
    id: '1',
    aggregatorId: 'agg1',
    wasteListingId: 'wl1',
    status: 'scheduled',
    pickupPhotos: [],
    created: DateTime(2024, 1, 1),
    updated: DateTime(2024, 1, 1),
  );

  setUp(() {
    mockRepository = MockPickupRepository();
  });

  group('PickupBloc', () {
    group('LoadPickups', () {
      blocTest<PickupBloc, PickupState>(
        'emits [PickupLoading, PickupsLoaded] when load succeeds',
        build: () {
          when(() => mockRepository.getPickups(
                aggregatorId: any(named: 'aggregatorId'),
                status: any(named: 'status'),
              )).thenAnswer((_) async => [mockPickup]);
          return PickupBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadPickups()),
        expect: () => <PickupState>[
          PickupLoading(),
          PickupsLoaded([mockPickup]),
        ],
      );

      blocTest<PickupBloc, PickupState>(
        'emits [PickupLoading, PickupError] when load fails',
        build: () {
          when(() => mockRepository.getPickups(
                aggregatorId: any(named: 'aggregatorId'),
                status: any(named: 'status'),
              )).thenThrow(Exception('network error'));
          return PickupBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadPickups()),
        expect: () => <PickupState>[
          PickupLoading(),
          PickupError('Exception: network error'),
        ],
      );

      blocTest<PickupBloc, PickupState>(
        'passes aggregatorId and status filter parameters',
        build: () {
          when(() => mockRepository.getPickups(
                aggregatorId: any(named: 'aggregatorId'),
                status: any(named: 'status'),
              )).thenAnswer((_) async => [mockPickup]);
          return PickupBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadPickups(
          aggregatorId: 'agg1',
          status: 'completed',
        )),
        expect: () => <PickupState>[
          PickupLoading(),
          PickupsLoaded([mockPickup]),
        ],
      );
    });

    group('LoadPickupDetail', () {
      blocTest<PickupBloc, PickupState>(
        'emits [PickupLoading, PickupDetailLoaded] when load succeeds',
        build: () {
          when(() => mockRepository.getPickupById(any()))
              .thenAnswer((_) async => mockPickup);
          return PickupBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadPickupDetail('1')),
        expect: () => <PickupState>[
          PickupLoading(),
          PickupDetailLoaded(mockPickup),
        ],
      );

      blocTest<PickupBloc, PickupState>(
        'emits [PickupLoading, PickupError] when load fails',
        build: () {
          when(() => mockRepository.getPickupById(any()))
              .thenThrow(Exception('not found'));
          return PickupBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadPickupDetail('999')),
        expect: () => <PickupState>[
          PickupLoading(),
          PickupError('Exception: not found'),
        ],
      );
    });

    group('CreatePickup', () {
      const body = <String, dynamic>{
        'aggregatorId': 'agg1',
        'wasteListingId': 'wl1',
        'status': 'scheduled',
      };

      blocTest<PickupBloc, PickupState>(
        'emits [PickupLoading, PickupCreated] when create succeeds',
        build: () {
          when(() => mockRepository.createPickup(any()))
              .thenAnswer((_) async => mockPickup);
          return PickupBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const CreatePickup(body)),
        expect: () => <PickupState>[
          PickupLoading(),
          PickupCreated(mockPickup),
        ],
      );

      blocTest<PickupBloc, PickupState>(
        'emits [PickupLoading, PickupError] when create fails',
        build: () {
          when(() => mockRepository.createPickup(any()))
              .thenThrow(Exception('creation failed'));
          return PickupBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const CreatePickup(body)),
        expect: () => <PickupState>[
          PickupLoading(),
          PickupError('Exception: creation failed'),
        ],
      );
    });

    group('UpdatePickupStatus', () {
      const body = <String, dynamic>{'status': 'completed'};

      blocTest<PickupBloc, PickupState>(
        'emits [PickupLoading, PickupUpdated] when update succeeds',
        build: () {
          when(() => mockRepository.updatePickup(any(), any()))
              .thenAnswer((_) async => mockPickup);
          return PickupBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdatePickupStatus(id: '1', body: body),
        ),
        expect: () => <PickupState>[
          PickupLoading(),
          PickupUpdated(mockPickup),
        ],
      );

      blocTest<PickupBloc, PickupState>(
        'emits [PickupLoading, PickupError] when update fails',
        build: () {
          when(() => mockRepository.updatePickup(any(), any()))
              .thenThrow(Exception('update failed'));
          return PickupBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdatePickupStatus(id: '1', body: body),
        ),
        expect: () => <PickupState>[
          PickupLoading(),
          PickupError('Exception: update failed'),
        ],
      );
    });

    group('DeletePickup', () {
      blocTest<PickupBloc, PickupState>(
        'emits [PickupLoading, PickupDeleted] when delete succeeds',
        build: () {
          when(() => mockRepository.deletePickup(any()))
              .thenAnswer((_) async {});
          return PickupBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const DeletePickup('1')),
        expect: () => <PickupState>[
          PickupLoading(),
          PickupDeleted(),
        ],
      );

      blocTest<PickupBloc, PickupState>(
        'emits [PickupLoading, PickupError] when delete fails',
        build: () {
          when(() => mockRepository.deletePickup(any()))
              .thenThrow(Exception('delete failed'));
          return PickupBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const DeletePickup('1')),
        expect: () => <PickupState>[
          PickupLoading(),
          PickupError('Exception: delete failed'),
        ],
      );
    });
  });
}
