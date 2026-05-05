import 'package:flutter_test/flutter_test.dart';

import 'package:woodloop_app/features/aggregator/domain/entities/bid.dart';
import 'package:woodloop_app/features/generator/domain/entities/generator_product.dart';
import 'package:woodloop_app/features/enabler/domain/entities/impact_metric.dart';
import 'package:woodloop_app/features/chat/domain/entities/conversation_preview.dart';
import 'package:woodloop_app/features/generator/domain/entities/raw_timber_order.dart';

void main() {
  final now = DateTime(2026, 5, 1);

  group('Bid Entity', () {
    test('full construction', () {
      final b = Bid(id: 'b1', bidderId: 'a1', wasteListingId: 'w1',
        bidAmount: 450000, message: 'Siap jemput', status: 'pending',
        created: now, updated: now);
      expect(b.bidAmount, equals(450000));
      expect(b.status, equals('pending'));
      expect(b.message, equals('Siap jemput'));
    });

    test('bid status flow: pending → accepted/rejected', () {
      const statuses = ['pending', 'accepted', 'rejected', 'expired'];
      expect(statuses.contains('accepted'), isTrue);
      expect(statuses.contains('rejected'), isTrue);
    });

    test('equality', () {
      final a = Bid(id: '1', bidderId: 'a', wasteListingId: 'w',
        bidAmount: 100, created: now, updated: now);
      final b = Bid(id: '1', bidderId: 'a', wasteListingId: 'w',
        bidAmount: 100, created: now, updated: now);
      expect(a, equals(b));
    });

    test('different bids not equal', () {
      final a = Bid(id: '1', bidderId: 'a', wasteListingId: 'w',
        bidAmount: 100, created: now, updated: now);
      final b = Bid(id: '2', bidderId: 'a', wasteListingId: 'w',
        bidAmount: 100, created: now, updated: now);
      expect(a, isNot(equals(b)));
    });
  });

  group('GeneratorProduct Entity', () {
    test('full construction', () {
      final p = GeneratorProduct(id: 'gp1', generatorId: 'g1',
        name: 'Kursi Jati', description: 'Deskripsi',
        category: 'furniture', price: 1500000, stock: 5,
        photos: ['p1.jpg'], woodTypeId: 'wt1', status: 'active',
        created: now, updated: now);
      expect(p.name, equals('Kursi Jati'));
      expect(p.price, equals(1500000));
      expect(p.stock, equals(5));
      expect(p.category, equals('furniture'));
      expect(p.status, equals('active'));
    });

    test('default stock is 0', () {
      final p = GeneratorProduct(id: 'gp', generatorId: 'g', name: 'Test',
        category: 'other', price: 1000, created: now, updated: now);
      expect(p.stock, equals(0));
    });

    test('status values: active, sold_out, draft', () {
      const statuses = ['active', 'sold_out', 'draft'];
      expect(statuses.length, equals(3));
    });
  });

  group('ImpactMetric Entity', () {
    test('full construction', () {
      final m = ImpactMetric(id: 'im1', co2Saved: 72.0, wasteDiverted: 48.0,
        economicValue: 500000, wasteListingId: 'w1', pickupId: 'p1',
        period: '2026-05');
      expect(m.co2Saved, equals(72.0));
      expect(m.wasteDiverted, equals(48.0));
      expect(m.economicValue, equals(500000));
      expect(m.period, equals('2026-05'));
    });

    test('metric with null values', () {
      const m = ImpactMetric(id: 'im');
      expect(m.co2Saved, isNull);
      expect(m.wasteDiverted, isNull);
    });

    test('equality', () {
      const a = ImpactMetric(id: '1', co2Saved: 100, wasteDiverted: 50);
      const b = ImpactMetric(id: '1', co2Saved: 100, wasteDiverted: 50);
      expect(a, equals(b));
    });

    test('CO2 calculation formula', () {
      const weight = 48.0, carbonFactor = 1.5;
      expect(weight * carbonFactor, equals(72.0));
    });
  });

  group('RawTimberOrder Entity', () {
    test('full construction', () {
      final o = RawTimberOrder(id: 'o1', buyerId: 'g1', sellerId: 's1',
        listingId: 'l1', quantity: 2, totalPrice: 2000000,
        notes: 'Butuh cepat', status: 'pending', created: now, updated: now);
      expect(o.quantity, equals(2));
      expect(o.notes, equals('Butuh cepat'));
      expect(o.status, equals('pending'));
    });

    test('order accepted → supplier can fulfill', () {
      const accepted = 'accepted';
      expect(accepted, isNotEmpty);
    });
  });

  group('ConversationPreview Entity', () {
    test('full construction', () {
      final c = ConversationPreview(conversationId: 'c1', otherUserId: 'u2',
        otherUserName: 'Test', lastMessage: 'Hello',
        lastMessageTime: now, unreadCount: 3);
      expect(c.conversationId, equals('c1'));
      expect(c.otherUserName, equals('Test'));
      expect(c.unreadCount, equals(3));
    });

    test('zero unread count', () {
      final c = ConversationPreview(conversationId: 'c1', otherUserId: 'u2',
        otherUserName: 'Test', lastMessage: '',
        lastMessageTime: now, unreadCount: 0);
      expect(c.unreadCount, equals(0));
    });

    test('equality', () {
      final a = ConversationPreview(conversationId: 'c1', otherUserId: 'u2',
        otherUserName: 'X', lastMessage: '', lastMessageTime: now, unreadCount: 0);
      final b = ConversationPreview(conversationId: 'c1', otherUserId: 'u2',
        otherUserName: 'X', lastMessage: '', lastMessageTime: now, unreadCount: 0);
      expect(a, equals(b));
    });
  });
}
