import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/converter/domain/entities/product.dart';

void main() {
  group('Product', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final product = Product(
        id: 'pr1', converterId: 'conv1', name: 'Kursi Jati Daur Ulang',
        category: 'furniture', price: 750000, created: now, updated: now,
      );
      expect(product.id, 'pr1');
      expect(product.converterId, 'conv1');
      expect(product.name, 'Kursi Jati Daur Ulang');
      expect(product.category, 'furniture');
      expect(product.price, 750000);
    });

    test('optional fields default correctly', () {
      final product = Product(
        id: 'pr2', converterId: 'conv2', name: 'Papan Dinding',
        category: 'decor', price: 150000, created: now, updated: now,
      );
      expect(product.description, isNull);
      expect(product.stock, 0);
      expect(product.photos, []);
      expect(product.sourceTransactionIds, []);
      expect(product.qrCodeId, isNull);
    });

    test('full construction with source transactions', () {
      final product = Product(
        id: 'pr3', converterId: 'conv3', name: 'Produk Lengkap',
        description: 'Deskripsi', category: 'art', price: 250000,
        stock: 10, photos: ['p1.jpg', 'p2.jpg'],
        sourceTransactionIds: ['mt1', 'mt2'],
        qrCodeId: 'QR-ABC123', created: now, updated: now,
      );
      expect(product.photos.length, 2);
      expect(product.sourceTransactionIds, ['mt1', 'mt2']);
      expect(product.qrCodeId, 'QR-ABC123');
      expect(product.stock, 10);
    });

    test('props includes all fields', () {
      final product = Product(
        id: 'pr4', converterId: 'conv4', name: 'X', category: 'other',
        price: 1, created: now, updated: now,
      );
      expect(product.props.length, 12);
    });

    test('equality', () {
      final d = DateTime(2026, 1, 1);
      final a = Product(
        id: 'x', converterId: 'c', name: 'N', category: 'furniture',
        price: 1, created: d, updated: d,
      );
      final b = Product(
        id: 'x', converterId: 'c', name: 'N', category: 'furniture',
        price: 1, created: d, updated: d,
      );
      expect(a, b);
    });
  });
}
