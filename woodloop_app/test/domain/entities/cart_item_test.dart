import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/buyer/domain/entities/cart_item.dart';

void main() {
  group('CartItem', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final item = CartItem(
        id: 'ci1', buyerId: 'buy1', productId: 'pr1',
        quantity: 2, created: now, updated: now,
      );
      expect(item.id, 'ci1');
      expect(item.buyerId, 'buy1');
      expect(item.productId, 'pr1');
      expect(item.quantity, 2);
    });

    test('optional expanded fields default correctly', () {
      final item = CartItem(
        id: 'ci2', buyerId: 'buy2', productId: 'pr2',
        quantity: 1, created: now, updated: now,
      );
      expect(item.productName, isNull);
      expect(item.productPrice, isNull);
      expect(item.productPhoto, isNull);
    });

    test('full construction with expanded fields', () {
      final item = CartItem(
        id: 'ci3', buyerId: 'buy3', productId: 'pr3',
        quantity: 3, created: now, updated: now,
        productName: 'Kursi Jati', productPrice: 750000,
        productPhoto: 'kursi.jpg',
      );
      expect(item.productName, 'Kursi Jati');
      expect(item.productPrice, 750000);
      expect(item.productPhoto, 'kursi.jpg');
    });

    test('props includes all fields', () {
      final item = CartItem(
        id: 'ci4', buyerId: 'b', productId: 'p', quantity: 1,
        created: now, updated: now,
      );
      expect(item.props.length, 9);
    });

    test('equality', () {
      final d = DateTime(2026, 1, 1);
      final a = CartItem(id: 'x', buyerId: 'b', productId: 'p', quantity: 1, created: d, updated: d);
      final b = CartItem(id: 'x', buyerId: 'b', productId: 'p', quantity: 1, created: d, updated: d);
      expect(a, b);
    });
  });
}
