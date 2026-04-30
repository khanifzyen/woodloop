import 'package:flutter_test/flutter_test.dart';
import 'package:woodloop_app/features/chat/domain/entities/chat_message.dart';

void main() {
  group('ChatMessage', () {
    final now = DateTime(2026, 4, 28);

    test('creates with required fields', () {
      final msg = ChatMessage(
        id: 'cm1', senderId: 'u1', receiverId: 'u2',
        message: 'Halo, ada limbah kayu?', created: now,
      );
      expect(msg.id, 'cm1');
      expect(msg.senderId, 'u1');
      expect(msg.receiverId, 'u2');
      expect(msg.message, 'Halo, ada limbah kayu?');
    });

    test('optional fields default correctly', () {
      final msg = ChatMessage(
        id: 'cm2', senderId: 'u1', receiverId: 'u2',
        message: 'Pesan singkat', created: now,
      );
      expect(msg.conversationId, isNull);
      expect(msg.senderName, isNull);
    });

    test('full construction', () {
      final msg = ChatMessage(
        id: 'cm3', senderId: 'u1', receiverId: 'u2',
        conversationId: 'conv1', message: 'Lengkap',
        senderName: 'Budi', created: now,
      );
      expect(msg.conversationId, 'conv1');
      expect(msg.senderName, 'Budi');
    });

    test('props includes all fields', () {
      final msg = ChatMessage(
        id: 'cm4', senderId: 'u1', receiverId: 'u2',
        message: 'Test', created: now,
      );
      expect(msg.props.length, 9);
    });

    test('equality', () {
      final a = ChatMessage(
        id: 'x', senderId: 'a', receiverId: 'b', message: 'hi',
        created: DateTime(2026, 1, 1),
      );
      final b = ChatMessage(
        id: 'x', senderId: 'a', receiverId: 'b', message: 'hi',
        created: DateTime(2026, 1, 1),
      );
      expect(a, b);
    });
  });
}
