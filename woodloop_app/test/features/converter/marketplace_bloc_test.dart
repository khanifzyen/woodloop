import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:woodloop_app/features/converter/domain/entities/marketplace_transaction.dart';
import 'package:woodloop_app/features/converter/domain/repositories/marketplace_repository.dart';
import 'package:woodloop_app/features/converter/presentation/bloc/marketplace_bloc.dart';

class MockMarketplaceRepository extends Mock
    implements MarketplaceRepository {}

void main() {
  late MockMarketplaceRepository mockRepository;

  final mockTransaction = MarketplaceTransaction(
    id: '1',
    buyerId: 'buyer1',
    sellerId: 'seller1',
    inventoryItemId: 'item1',
    quantity: 10.0,
    totalPrice: 500000.0,
    status: 'pending',
    created: DateTime(2024, 1, 1),
    updated: DateTime(2024, 1, 1),
  );

  setUp(() {
    mockRepository = MockMarketplaceRepository();
  });

  group('MarketplaceBloc', () {
    group('LoadMarketplaceTransactions', () {
      blocTest<MarketplaceBloc, MarketplaceState>(
        'emits [MarketplaceLoading, MarketplaceTransactionsLoaded] '
            'when load succeeds',
        build: () {
          when(() => mockRepository.getTransactions(
                buyerId: any(named: 'buyerId'),
                sellerId: any(named: 'sellerId'),
                status: any(named: 'status'),
              )).thenAnswer((_) async => [mockTransaction]);
          return MarketplaceBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadMarketplaceTransactions()),
        expect: () => <MarketplaceState>[
          MarketplaceLoading(),
          MarketplaceTransactionsLoaded([mockTransaction]),
        ],
      );

      blocTest<MarketplaceBloc, MarketplaceState>(
        'emits [MarketplaceLoading, MarketplaceError] when load fails',
        build: () {
          when(() => mockRepository.getTransactions(
                buyerId: any(named: 'buyerId'),
                sellerId: any(named: 'sellerId'),
                status: any(named: 'status'),
              )).thenThrow(Exception('network error'));
          return MarketplaceBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadMarketplaceTransactions()),
        expect: () => <MarketplaceState>[
          MarketplaceLoading(),
          MarketplaceError('Exception: network error'),
        ],
      );

      blocTest<MarketplaceBloc, MarketplaceState>(
        'passes buyerId, sellerId and status filter parameters',
        build: () {
          when(() => mockRepository.getTransactions(
                buyerId: any(named: 'buyerId'),
                sellerId: any(named: 'sellerId'),
                status: any(named: 'status'),
              )).thenAnswer((_) async => [mockTransaction]);
          return MarketplaceBloc(mockRepository);
        },
        act: (bloc) => bloc.add(const LoadMarketplaceTransactions(
          buyerId: 'buyer1',
          sellerId: 'seller1',
          status: 'pending',
        )),
        expect: () => <MarketplaceState>[
          MarketplaceLoading(),
          MarketplaceTransactionsLoaded([mockTransaction]),
        ],
      );
    });

    group('LoadMarketplaceTransactionDetail', () {
      blocTest<MarketplaceBloc, MarketplaceState>(
        'emits [MarketplaceLoading, MarketplaceTransactionDetailLoaded] '
            'when load succeeds',
        build: () {
          when(() => mockRepository.getTransactionById(any()))
              .thenAnswer((_) async => mockTransaction);
          return MarketplaceBloc(mockRepository);
        },
        act: (bloc) =>
            bloc.add(const LoadMarketplaceTransactionDetail('1')),
        expect: () => <MarketplaceState>[
          MarketplaceLoading(),
          MarketplaceTransactionDetailLoaded(mockTransaction),
        ],
      );

      blocTest<MarketplaceBloc, MarketplaceState>(
        'emits [MarketplaceLoading, MarketplaceError] when load fails',
        build: () {
          when(() => mockRepository.getTransactionById(any()))
              .thenThrow(Exception('not found'));
          return MarketplaceBloc(mockRepository);
        },
        act: (bloc) =>
            bloc.add(const LoadMarketplaceTransactionDetail('999')),
        expect: () => <MarketplaceState>[
          MarketplaceLoading(),
          MarketplaceError('Exception: not found'),
        ],
      );
    });

    group('CreateMarketplaceTransaction', () {
      const body = <String, dynamic>{
        'buyerId': 'buyer1',
        'sellerId': 'seller1',
        'inventoryItemId': 'item1',
        'quantity': 10.0,
        'totalPrice': 500000.0,
        'status': 'pending',
      };

      blocTest<MarketplaceBloc, MarketplaceState>(
        'emits [MarketplaceLoading, MarketplaceTransactionCreated] '
            'when create succeeds',
        build: () {
          when(() => mockRepository.createTransaction(any()))
              .thenAnswer((_) async => mockTransaction);
          return MarketplaceBloc(mockRepository);
        },
        act: (bloc) =>
            bloc.add(const CreateMarketplaceTransaction(body)),
        expect: () => <MarketplaceState>[
          MarketplaceLoading(),
          MarketplaceTransactionCreated(mockTransaction),
        ],
      );

      blocTest<MarketplaceBloc, MarketplaceState>(
        'emits [MarketplaceLoading, MarketplaceError] when create fails',
        build: () {
          when(() => mockRepository.createTransaction(any()))
              .thenThrow(Exception('creation failed'));
          return MarketplaceBloc(mockRepository);
        },
        act: (bloc) =>
            bloc.add(const CreateMarketplaceTransaction(body)),
        expect: () => <MarketplaceState>[
          MarketplaceLoading(),
          MarketplaceError('Exception: creation failed'),
        ],
      );
    });

    group('UpdateMarketplaceTransaction', () {
      const body = <String, dynamic>{'status': 'completed'};

      blocTest<MarketplaceBloc, MarketplaceState>(
        'emits [MarketplaceLoading, MarketplaceTransactionUpdated] '
            'when update succeeds',
        build: () {
          when(() => mockRepository.updateTransaction(any(), any()))
              .thenAnswer((_) async => mockTransaction);
          return MarketplaceBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdateMarketplaceTransaction(id: '1', body: body),
        ),
        expect: () => <MarketplaceState>[
          MarketplaceLoading(),
          MarketplaceTransactionUpdated(mockTransaction),
        ],
      );

      blocTest<MarketplaceBloc, MarketplaceState>(
        'emits [MarketplaceLoading, MarketplaceError] when update fails',
        build: () {
          when(() => mockRepository.updateTransaction(any(), any()))
              .thenThrow(Exception('update failed'));
          return MarketplaceBloc(mockRepository);
        },
        act: (bloc) => bloc.add(
          const UpdateMarketplaceTransaction(id: '1', body: body),
        ),
        expect: () => <MarketplaceState>[
          MarketplaceLoading(),
          MarketplaceError('Exception: update failed'),
        ],
      );
    });
  });
}
