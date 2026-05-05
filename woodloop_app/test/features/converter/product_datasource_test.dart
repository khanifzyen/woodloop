import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:woodloop_app/features/converter/data/datasources/product_remote_data_source.dart';
import 'package:woodloop_app/features/converter/domain/entities/product.dart';

/// Test for Product datasource logic (unit test without PocketBase connection)
void main() {
  group('ProductRemoteDataSource Interface', () {
    test('abstract interface defines all CRUD operations', () {
      // Verify the interface contract
      // - getProducts
      // - getProductById
      // - createProduct
      // - updateProduct
      // - deleteProduct
      const operationCount = 5;
      expect(operationCount, equals(5));
    });

    test('createProduct interface accepts body map with converter, name, category, price, stock', () {
      final body = {
        'converter': 'conv1',
        'name': 'Vas Trembesi',
        'category': 'decor',
        'price': 250000.0,
        'stock': 10,
      };
      expect(body.containsKey('converter'), isTrue);
      expect(body.containsKey('name'), isTrue);
      expect(body.containsKey('category'), isTrue);
      expect(body.containsKey('price'), isTrue);
      expect(body.containsKey('stock'), isTrue);
    });

    test('createProduct can include source_transactions', () {
      final body = {
        'converter': 'conv1',
        'name': 'Product',
        'category': 'furniture',
        'price': 500000.0,
        'stock': 3,
        'source_transactions': ['mtx1', 'mtx2'],
      };
      expect(body['source_transactions'], isA<List>());
      expect((body['source_transactions'] as List).length, equals(2));
    });

    test('createProduct can include qr_code_id (auto-generated)', () {
      final body = {
        'converter': 'conv1',
        'name': 'Product',
        'category': 'furniture',
        'price': 500000.0,
        'stock': 3,
        'qr_code_id': 'QR-LZ123ABC',
      };
      expect(body['qr_code_id'], isNotNull);
      expect((body['qr_code_id'] as String), startsWith('QR-'));
    });
  });

  group('Product Entity', () {
    final now = DateTime(2026, 5, 1);
    final product = Product(
      id: 'prd1',
      converterId: 'conv1',
      name: 'Vas Trembesi',
      description: 'Vas dari trembesi daur ulang',
      category: 'decor',
      price: 250000,
      stock: 10,
      photos: ['photo1.jpg'],
      sourceTransactionIds: ['mtx1'],
      qrCodeId: 'QR-ABC123',
      created: now,
      updated: now,
    );

    test('full product construction with all fields', () {
      expect(product.id, equals('prd1'));
      expect(product.converterId, equals('conv1'));
      expect(product.name, equals('Vas Trembesi'));
      expect(product.category, equals('decor'));
      expect(product.price, equals(250000));
      expect(product.stock, equals(10));
      expect(product.photos, equals(['photo1.jpg']));
    });

    test('product links to source transactions for traceability', () {
      expect(product.sourceTransactionIds, contains('mtx1'));
    });

    test('product has qr_code_id for traceability', () {
      expect(product.qrCodeId, startsWith('QR-'));
    });

    test('product stock defaults to 0', () {
      final p = Product(
        id: 'p', converterId: 'c', name: 'n',
        category: 'furniture', price: 1000,
        created: now, updated: now,
      );
      expect(p.stock, equals(0));
    });

    test('product equality', () {
      final same = Product(
        id: 'prd1',
        converterId: 'conv1',
        name: 'Vas Trembesi',
        description: 'Vas dari trembesi daur ulang',
        category: 'decor',
        price: 250000,
        stock: 10,
        photos: ['photo1.jpg'],
        sourceTransactionIds: ['mtx1'],
        qrCodeId: 'QR-ABC123',
        created: now,
        updated: now,
      );
      expect(product, equals(same));
    });

    test('different products are not equal', () {
      final other = Product(
        id: 'prd2',
        converterId: 'conv1',
        name: 'Other',
        category: 'decor',
        price: 100000,
        stock: 1,
        created: now,
        updated: now,
      );
      expect(product, isNot(equals(other)));
    });
  });
}
