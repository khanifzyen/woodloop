import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/shared/domain/entities/notification_item.dart';

void main() {
  group('NotificationItem', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final notif = NotificationItem(
        id: 'n1', userId: 'u1', title: 'Limbah Dijemput',
        message: 'Pickup berhasil dilakukan', type: 'pickup', created: now,
      );
      expect(notif.id, 'n1');
      expect(notif.userId, 'u1');
      expect(notif.title, 'Limbah Dijemput');
      expect(notif.message, 'Pickup berhasil dilakukan');
      expect(notif.type, 'pickup');
    });

    test('isRead defaults to false', () {
      final notif = NotificationItem(
        id: 'n2', userId: 'u2', title: 'Pesanan Baru',
        message: 'Order #123 masuk', type: 'order', created: now,
      );
      expect(notif.isRead, false);
    });

    test('full construction with isRead true', () {
      final notif = NotificationItem(
        id: 'n3', userId: 'u3', title: 'Tawaran Diterima',
        message: 'Bid accepted', type: 'bid', isRead: true, created: now,
      );
      expect(notif.isRead, true);
    });

    test('props includes all fields', () {
      final notif = NotificationItem(
        id: 'n4', userId: 'u4', title: 'T', message: 'M',
        type: 'system', created: now,
      );
      expect(notif.props.length, 7);
    });

    test('equality', () {
      final d = DateTime(2026, 1, 1);
      final a = NotificationItem(
        id: 'x', userId: 'u', title: 'T', message: 'M', type: 'order', created: d,
      );
      final b = NotificationItem(
        id: 'x', userId: 'u', title: 'T', message: 'M', type: 'order', created: d,
      );
      expect(a, b);
    });
  });
}
