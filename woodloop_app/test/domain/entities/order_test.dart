import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/buyer/domain/entities/order.dart';

void main() {
  group('Order', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final order = Order(
        id: 'or1', buyerId: 'buy1', productId: 'pr1',
        quantity: 1, totalPrice: 750000, status: 'payment_pending',
        shippingAddress: 'Jl. Jepara No.1', created: now, updated: now,
      );
      expect(order.id, 'or1');
      expect(order.buyerId, 'buy1');
      expect(order.productId, 'pr1');
      expect(order.quantity, 1);
      expect(order.totalPrice, 750000);
      expect(order.status, 'payment_pending');
      expect(order.shippingAddress, 'Jl. Jepara No.1');
    });

    test('optional fields default correctly', () {
      final order = Order(
        id: 'or2', buyerId: 'b', productId: 'p', quantity: 1,
        totalPrice: 100000, status: 'paid',
        shippingAddress: 'Alamat', created: now, updated: now,
      );
      expect(order.snapToken, isNull);
      expect(order.snapRedirectUrl, isNull);
      expect(order.paymentMethod, isNull);
      expect(order.productName, isNull);
    });

    test('full construction with payment fields', () {
      final order = Order(
        id: 'or3', buyerId: 'b', productId: 'p', quantity: 2,
        totalPrice: 500000, status: 'processing',
        shippingAddress: 'Alamat', snapToken: 'snap-123',
        snapRedirectUrl: 'https://app.midtrans.com/',
        paymentMethod: 'virtual_account', created: now, updated: now,
        productName: 'Meja Jati',
      );
      expect(order.snapToken, 'snap-123');
      expect(order.paymentMethod, 'virtual_account');
      expect(order.productName, 'Meja Jati');
    });

    test('props includes all fields', () {
      final order = Order(
        id: 'or4', buyerId: 'b', productId: 'p', quantity: 1,
        totalPrice: 1, status: 'shipped', shippingAddress: 'Addr',
        created: now, updated: now,
      );
      expect(order.props.length, 13);
    });

    test('equality', () {
      final d = DateTime(2026, 1, 1);
      final a = Order(
        id: 'x', buyerId: 'b', productId: 'p', quantity: 1, totalPrice: 1,
        status: 'paid', shippingAddress: 'Addr', created: d, updated: d,
      );
      final b = Order(
        id: 'x', buyerId: 'b', productId: 'p', quantity: 1, totalPrice: 1,
        status: 'paid', shippingAddress: 'Addr', created: d, updated: d,
      );
      expect(a, b);
    });
  });
}
