import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/converter/domain/entities/marketplace_transaction.dart';

void main() {
  group('MarketplaceTransaction', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final tx = MarketplaceTransaction(
        id: 'mt1', buyerId: 'conv1', sellerId: 'agg1',
        inventoryItemId: 'wi1', quantity: 50,
        totalPrice: 250000, status: 'pending', created: now, updated: now,
      );
      expect(tx.id, 'mt1');
      expect(tx.buyerId, 'conv1');
      expect(tx.sellerId, 'agg1');
      expect(tx.inventoryItemId, 'wi1');
      expect(tx.quantity, 50);
      expect(tx.totalPrice, 250000);
      expect(tx.status, 'pending');
    });

    test('optional fields default correctly', () {
      final tx = MarketplaceTransaction(
        id: 'mt2', buyerId: 'c', sellerId: 's', inventoryItemId: 'w',
        quantity: 10, totalPrice: 50000, status: 'pending',
        created: now, updated: now,
      );
      expect(tx.paymentMethod, isNull);
    });

    test('full construction with paymentMethod', () {
      final tx = MarketplaceTransaction(
        id: 'mt3', buyerId: 'c', sellerId: 's', inventoryItemId: 'w',
        quantity: 10, totalPrice: 50000, status: 'paid',
        paymentMethod: 'wallet', created: now, updated: now,
      );
      expect(tx.paymentMethod, 'wallet');
      expect(tx.status, 'paid');
    });

    test('props includes all fields', () {
      final tx = MarketplaceTransaction(
        id: 'mt4', buyerId: 'c', sellerId: 's', inventoryItemId: 'w',
        quantity: 1, totalPrice: 1, status: 'shipped',
        created: now, updated: now,
      );
      expect(tx.props.length, 10);
    });

    test('equality', () {
      final d = DateTime(2026, 1, 1);
      final a = MarketplaceTransaction(
        id: 'x', buyerId: 'b', sellerId: 's', inventoryItemId: 'i',
        quantity: 1, totalPrice: 1, status: 'pending', created: d, updated: d,
      );
      final b = MarketplaceTransaction(
        id: 'x', buyerId: 'b', sellerId: 's', inventoryItemId: 'i',
        quantity: 1, totalPrice: 1, status: 'pending', created: d, updated: d,
      );
      expect(a, b);
    });
  });
}
