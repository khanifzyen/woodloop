import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/shared/domain/entities/wallet_transaction.dart';

void main() {
  group('WalletTransaction', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final tx = WalletTransaction(
        id: 'wt1', userId: 'u1', type: 'credit', amount: 50000, created: now,
      );
      expect(tx.id, 'wt1');
      expect(tx.userId, 'u1');
      expect(tx.type, 'credit');
      expect(tx.amount, 50000);
    });

    test('optional fields default correctly', () {
      final tx = WalletTransaction(
        id: 'wt2', userId: 'u2', type: 'debit', amount: 25000, created: now,
      );
      expect(tx.balanceAfter, isNull);
      expect(tx.description, isNull);
      expect(tx.referenceType, isNull);
      expect(tx.referenceId, isNull);
    });

    test('full construction with all optionals', () {
      final tx = WalletTransaction(
        id: 'wt3', userId: 'u3', type: 'credit', amount: 100000,
        balanceAfter: 500000, description: 'Penjualan limbah',
        referenceType: 'marketplace_transaction', referenceId: 'mt1',
        created: now,
      );
      expect(tx.balanceAfter, 500000);
      expect(tx.description, 'Penjualan limbah');
      expect(tx.referenceType, 'marketplace_transaction');
      expect(tx.referenceId, 'mt1');
    });

    test('props includes all fields', () {
      final tx = WalletTransaction(
        id: 'wt4', userId: 'u4', type: 'credit', amount: 1, created: now,
      );
      expect(tx.props.length, 9);
    });

    test('equality', () {
      final d = DateTime(2026, 1, 1);
      final a = WalletTransaction(
        id: 'x', userId: 'u', type: 'credit', amount: 1, created: d,
      );
      final b = WalletTransaction(
        id: 'x', userId: 'u', type: 'credit', amount: 1, created: d,
      );
      expect(a, b);
    });
  });
}
