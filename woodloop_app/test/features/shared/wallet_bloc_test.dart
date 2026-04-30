import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:woodloop_app/features/shared/domain/entities/wallet_transaction.dart';
import 'package:woodloop_app/features/shared/domain/repositories/wallet_repository.dart';
import 'package:woodloop_app/features/shared/presentation/bloc/wallet_bloc.dart';

class MockWalletRepository extends Mock implements WalletRepository {}

void main() {
  late MockWalletRepository repository;

  const userId = 'user1';
  final now = DateTime(2026, 4, 28);

  final sampleTransactions = [
    WalletTransaction(
      id: 'tx1',
      userId: userId,
      type: 'credit',
      amount: 100000,
      balanceAfter: 500000,
      description: 'Pembayaran order #123',
      referenceType: 'order',
      referenceId: 'ord123',
      created: now,
    ),
    WalletTransaction(
      id: 'tx2',
      userId: userId,
      type: 'debit',
      amount: 25000,
      balanceAfter: 475000,
      description: 'Penarikan saldo',
      created: now.subtract(const Duration(days: 1)),
    ),
  ];

  setUp(() {
    repository = MockWalletRepository();
  });

  group('LoadWallet', () {
    blocTest<WalletBloc, WalletState>(
      'emits [WalletLoading, WalletLoaded] on success',
      build: () {
        when(() => repository.getBalance(userId))
            .thenAnswer((_) async => 500000.0);
        when(
          () => repository.getTransactions(userId: userId),
        ).thenAnswer((_) async => sampleTransactions);
        return WalletBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadWallet(userId)),
      expect: () => [
        WalletLoading(),
        WalletLoaded(
          balance: 500000.0,
          transactions: sampleTransactions,
        ),
      ],
    );

    blocTest<WalletBloc, WalletState>(
      'emits [WalletLoading, WalletError] on failure',
      build: () {
        when(() => repository.getBalance(userId))
            .thenThrow(Exception('Network error'));
        return WalletBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadWallet(userId)),
      expect: () => [
        WalletLoading(),
        isA<WalletError>(),
      ],
    );
  });

  group('RefreshWalletBalance', () {
    blocTest<WalletBloc, WalletState>(
      'emits WalletLoaded with updated balance and existing transactions '
      'when current state is WalletLoaded',
      build: () {
        when(() => repository.getBalance(userId))
            .thenAnswer((_) async => 550000.0);
        return WalletBloc(repository);
      },
      seed: () => WalletLoaded(
        balance: 500000.0,
        transactions: sampleTransactions,
      ),
      act: (bloc) => bloc.add(const RefreshWalletBalance(userId)),
      expect: () => [
        WalletLoaded(
          balance: 550000.0,
          transactions: sampleTransactions,
        ),
      ],
    );

    blocTest<WalletBloc, WalletState>(
      'emits WalletLoaded with new balance and transactions '
      'when current state is not WalletLoaded',
      build: () {
        when(() => repository.getBalance(userId))
            .thenAnswer((_) async => 500000.0);
        when(
          () => repository.getTransactions(userId: userId),
        ).thenAnswer((_) async => sampleTransactions);
        return WalletBloc(repository);
      },
      seed: () => WalletInitial(),
      act: (bloc) => bloc.add(const RefreshWalletBalance(userId)),
      expect: () => [
        WalletLoaded(
          balance: 500000.0,
          transactions: sampleTransactions,
        ),
      ],
    );

    blocTest<WalletBloc, WalletState>(
      'emits WalletError when refresh fails',
      build: () {
        when(() => repository.getBalance(userId))
            .thenThrow(Exception('Refresh failed'));
        return WalletBloc(repository);
      },
      seed: () => WalletLoaded(
        balance: 500000.0,
        transactions: sampleTransactions,
      ),
      act: (bloc) => bloc.add(const RefreshWalletBalance(userId)),
      expect: () => [
        isA<WalletError>(),
      ],
    );
  });
}
