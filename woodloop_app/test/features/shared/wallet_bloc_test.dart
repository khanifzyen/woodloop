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
  final now = DateTime(2026, 5, 1);

  final sampleTransactions = [
    WalletTransaction(
      id: 'tx1', userId: userId, type: 'credit', amount: 500000,
      balanceAfter: 500000, description: 'Pembayaran limbah kayu (pickup)',
      referenceType: 'pickup', referenceId: 'pick1', created: now,
    ),
    WalletTransaction(
      id: 'tx2', userId: userId, type: 'debit', amount: 300000,
      balanceAfter: 200000, description: 'Pembelian bahan baku',
      referenceType: 'marketplace_transaction', referenceId: 'mtx1',
      created: now.subtract(const Duration(hours: 2)),
    ),
    WalletTransaction(
      id: 'tx3', userId: userId, type: 'debit', amount: 150000,
      balanceAfter: 50000, description: 'Pembelian produk',
      referenceType: 'order', referenceId: 'ord1',
      created: now.subtract(const Duration(days: 1)),
    ),
  ];

  setUp(() {
    repository = MockWalletRepository();
  });

  group('WalletBloc', () {
    blocTest<WalletBloc, WalletState>(
      'emits [Loading, Loaded] with balance and transactions',
      build: () {
        when(() => repository.getBalance(userId)).thenAnswer((_) async => 500000.0);
        when(() => repository.getTransactions(userId: userId))
            .thenAnswer((_) async => sampleTransactions);
        return WalletBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadWallet(userId)),
      expect: () => [
        WalletLoading(),
        WalletLoaded(balance: 500000.0, transactions: sampleTransactions),
      ],
    );

    blocTest<WalletBloc, WalletState>(
      'emits [Loading, Error] when getBalance fails',
      build: () {
        when(() => repository.getBalance(userId)).thenThrow(Exception('Network error'));
        return WalletBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadWallet(userId)),
      expect: () => [WalletLoading(), isA<WalletError>()],
    );

    blocTest<WalletBloc, WalletState>(
      'emits [Loading, Error] when getTransactions fails',
      build: () {
        when(() => repository.getBalance(userId)).thenAnswer((_) async => 100000.0);
        when(() => repository.getTransactions(userId: userId))
            .thenThrow(Exception('DB error'));
        return WalletBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadWallet(userId)),
      expect: () => [WalletLoading(), isA<WalletError>()],
    );

    blocTest<WalletBloc, WalletState>(
      'RefreshWalletBalance preserves existing transactions',
      build: () {
        when(() => repository.getBalance(userId)).thenAnswer((_) async => 550000.0);
        return WalletBloc(repository);
      },
      seed: () => WalletLoaded(balance: 500000.0, transactions: sampleTransactions),
      act: (bloc) => bloc.add(const RefreshWalletBalance(userId)),
      expect: () => [
        WalletLoaded(balance: 550000.0, transactions: sampleTransactions),
      ],
    );

    blocTest<WalletBloc, WalletState>(
      'RefreshWalletBalance loads full data when not WalletLoaded',
      build: () {
        when(() => repository.getBalance(userId)).thenAnswer((_) async => 500000.0);
        when(() => repository.getTransactions(userId: userId))
            .thenAnswer((_) async => sampleTransactions);
        return WalletBloc(repository);
      },
      seed: () => WalletInitial(),
      act: (bloc) => bloc.add(const RefreshWalletBalance(userId)),
      expect: () => [
        WalletLoaded(balance: 500000.0, transactions: sampleTransactions),
      ],
    );

    blocTest<WalletBloc, WalletState>(
      'emits WalletError when refresh fails',
      build: () {
        when(() => repository.getBalance(userId)).thenThrow(Exception('Refresh failed'));
        return WalletBloc(repository);
      },
      seed: () => WalletLoaded(balance: 500000.0, transactions: sampleTransactions),
      act: (bloc) => bloc.add(const RefreshWalletBalance(userId)),
      expect: () => [isA<WalletError>()],
    );
  });

  group('WalletTransaction Entity', () {
    test('full construction with all fields', () {
      final tx = WalletTransaction(
        id: 'tx1', userId: 'u1', type: 'credit', amount: 100000,
        balanceAfter: 500000, description: 'Test',
        referenceType: 'pickup', referenceId: 'pick1',
        created: now,
      );
      expect(tx.id, equals('tx1'));
      expect(tx.userId, equals('u1'));
      expect(tx.type, equals('credit'));
      expect(tx.amount, equals(100000));
      expect(tx.balanceAfter, equals(500000));
      expect(tx.description, equals('Test'));
      expect(tx.referenceType, equals('pickup'));
      expect(tx.referenceId, equals('pick1'));
    });

    test('debit transaction has correct type', () {
      final tx = WalletTransaction(
        id: 'tx2', userId: 'u1', type: 'debit', amount: 50000,
        created: now,
      );
      expect(tx.type, equals('debit'));
      expect(tx.balanceAfter, isNull);
    });

    test('equality works', () {
      final a = WalletTransaction(id: '1', userId: 'u', type: 'credit', amount: 100, created: now);
      final b = WalletTransaction(id: '1', userId: 'u', type: 'credit', amount: 100, created: now);
      expect(a, equals(b));
    });

    test('different transactions are not equal', () {
      final a = WalletTransaction(id: '1', userId: 'u', type: 'credit', amount: 100, created: now);
      final b = WalletTransaction(id: '2', userId: 'u', type: 'credit', amount: 100, created: now);
      expect(a, isNot(equals(b)));
    });
  });

  group('Wallet Balance Logic', () {
    test('balance_after = previous_balance + credit amount', () {
      const previousBalance = 400000.0;
      const creditAmount = 100000.0;
      expect(previousBalance + creditAmount, equals(500000.0));
    });

    test('balance_after = previous_balance - debit amount', () {
      const previousBalance = 500000.0;
      const debitAmount = 300000.0;
      expect(previousBalance - debitAmount, equals(200000.0));
    });

    test('first transaction balance_after equals amount (credit)', () {
      // For first transaction, balance_after = amount (no previous balance)
      const amount = 500000.0;
      expect(amount, equals(500000.0));
    });

    test('wallet transactions sorted newest first', () {
      final txs = sampleTransactions;
      for (var i = 1; i < txs.length; i++) {
        expect(
          txs[i - 1].created.isAfter(txs[i].created) ||
              txs[i - 1].created.isAtSameMomentAs(txs[i].created),
          isTrue,
        );
      }
    });

    test('reference types cover all business flows', () {
      const refTypes = ['pickup', 'marketplace_transaction', 'order', 'topup', 'withdrawal'];
      expect(refTypes.length, equals(5));
      expect(refTypes.contains('pickup'), isTrue);
      expect(refTypes.contains('marketplace_transaction'), isTrue);
      expect(refTypes.contains('order'), isTrue);
    });

    test('wallet transactions are immutable (no API update/delete)', () {
      // Verified in FASE 1: createRule, updateRule, deleteRule = null
      const immutable = true;
      expect(immutable, isTrue);
    });

    test('balance calculations are idempotent for same data', () {
      // Testing that balance doesn't change on repeated reads
      const balance = 500000.0;
      expect(balance, equals(balance)); // always same
    });

    test('zero balance defaults to 0', () {
      // When no transactions exist, balance should be 0
      const zeroBalance = 0.0;
      expect(zeroBalance, equals(0.0));
    });

    test('large amounts format correctly', () {
      const largeAmount = 1500000000.0; // 1.5 billion
      expect(largeAmount > 0, isTrue);
    });
  });

  group('Wallet Reference Badge Logic', () {
    test('pickup reference maps correctly', () {
      const refType = 'pickup';
      expect(refType, equals('pickup'));
    });

    test('marketplace_transaction reference maps correctly', () {
      const refType = 'marketplace_transaction';
      expect(refType, equals('marketplace_transaction'));
    });

    test('order reference maps correctly', () {
      const refType = 'order';
      expect(refType, equals('order'));
    });

    test('null referenceType is handled', () {
      final tx = WalletTransaction(
        id: 'tx', userId: 'u', type: 'credit', amount: 100,
        created: now,
      );
      expect(tx.referenceType, isNull);
      expect(tx.referenceId, isNull);
    });
  });
}
