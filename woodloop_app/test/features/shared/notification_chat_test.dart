import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:woodloop_app/features/shared/data/datasources/notification_remote_datasource.dart';
import 'package:woodloop_app/features/shared/data/models/notification_model.dart';
import 'package:woodloop_app/features/shared/domain/entities/notification_item.dart';
import 'package:woodloop_app/features/shared/presentation/bloc/notification_bloc.dart';
import 'package:woodloop_app/features/chat/domain/entities/chat_message.dart';
import 'package:woodloop_app/features/chat/domain/entities/conversation_preview.dart';
import 'package:woodloop_app/features/chat/domain/repositories/chat_repository.dart';
import 'package:woodloop_app/features/chat/presentation/bloc/chat_bloc.dart';

class MockNotificationDataSource extends Mock implements NotificationRemoteDataSource {}
class MockChatRepository extends Mock implements ChatRepository {}

void main() {
  final now = DateTime(2026, 5, 1);

  final sampleItems = [
    NotificationModel(id: 'n1', userId: 'u1', title: 'Pickup Selesai',
      message: 'Aggregator telah menjemput limbah', type: 'pickup',
      isRead: false, referenceType: 'pickup', referenceId: 'pick1', created: now),
    NotificationModel(id: 'n2', userId: 'u1', title: 'Pembayaran Diterima',
      message: 'Saldo bertambah Rp 500.000', type: 'payment',
      isRead: true, referenceType: 'pickup', referenceId: 'pick1', created: now.subtract(const Duration(hours: 2))),
    NotificationModel(id: 'n3', userId: 'u1', title: 'Pesanan Baru',
      message: 'Buyer memesan produk Anda', type: 'order',
      isRead: false, referenceType: 'order', referenceId: 'ord1', created: now.subtract(const Duration(days: 1))),
  ];

  group('NotificationBloc', () {
    late MockNotificationDataSource dataSource;

    setUp(() {
      dataSource = MockNotificationDataSource();
    });

    blocTest<NotificationBloc, NotificationState>(
      'emits [Loading, Loaded] with items and unread count',
      build: () {
        when(() => dataSource.getNotifications('u1')).thenAnswer((_) async => sampleItems);
        when(() => dataSource.subscribe('u1', any())).thenAnswer((_) {});
        return NotificationBloc(dataSource);
      },
      act: (bloc) => bloc.add(const LoadNotifications('u1')),
      expect: () => [
        NotificationLoading(),
        NotificationsLoaded(items: sampleItems, unreadCount: 2),
      ],
    );

    blocTest<NotificationBloc, NotificationState>(
      'emits [Loading, Error] on failure',
      build: () {
        when(() => dataSource.getNotifications('u1')).thenThrow(Exception('Network error'));
        return NotificationBloc(dataSource);
      },
      act: (bloc) => bloc.add(const LoadNotifications('u1')),
      expect: () => [NotificationLoading(), isA<NotificationError>()],
    );

    blocTest<NotificationBloc, NotificationState>(
      'MarkNotificationAsRead updates isRead and decrements unreadCount',
      build: () {
        when(() => dataSource.markAsRead('n1')).thenAnswer((_) async {});
        return NotificationBloc(dataSource);
      },
      seed: () => NotificationsLoaded(items: sampleItems, unreadCount: 2),
      act: (bloc) => bloc.add(const MarkNotificationAsRead('n1')),
      expect: () => [isA<NotificationsLoaded>()],
      verify: (bloc) {
        final state = bloc.state as NotificationsLoaded;
        final item = state.items.firstWhere((n) => n.id == 'n1');
        expect(item.isRead, isTrue);
        expect(state.unreadCount, equals(1));
      },
    );

    blocTest<NotificationBloc, NotificationState>(
      'NewNotificationReceived prepends to list and updates unread',
      build: () => NotificationBloc(dataSource),
      seed: () => NotificationsLoaded(items: sampleItems, unreadCount: 2),
      act: (bloc) => bloc.add(NewNotificationReceived(
        NotificationModel(id: 'n4', userId: 'u1', title: 'New', message: 'Test',
          type: 'system', isRead: false, created: now),
      )),
      verify: (bloc) {
        final state = bloc.state as NotificationsLoaded;
        expect(state.items.first.id, equals('n4'));
        expect(state.unreadCount, equals(3));
      },
    );

    blocTest<NotificationBloc, NotificationState>(
      'MarkNotificationAsRead emits Error on failure',
      build: () {
        when(() => dataSource.markAsRead('bad')).thenThrow(Exception('Failed'));
        return NotificationBloc(dataSource);
      },
      seed: () => NotificationsLoaded(items: sampleItems, unreadCount: 2),
      act: (bloc) => bloc.add(const MarkNotificationAsRead('bad')),
      expect: () => [isA<NotificationError>()],
    );
  });

  group('NotificationItem', () {
    test('full construction', () {
      final item = NotificationItem(id: '1', userId: 'u', title: 'T', message: 'M',
        type: 'order', isRead: false, referenceType: 'order', referenceId: 'o1', created: now);
      expect(item.id, equals('1'));
      expect(item.title, equals('T'));
      expect(item.type, equals('order'));
      expect(item.isRead, isFalse);
      expect(item.referenceType, equals('order'));
    });

    test('unread notification count calculation', () {
      final unread = sampleItems.where((n) => !n.isRead).length;
      final read = sampleItems.where((n) => n.isRead).length;
      expect(unread, equals(2));
      expect(read, equals(1));
      expect(unread + read, equals(sampleItems.length));
    });
  });

  group('ChatBloc', () {
    late MockChatRepository repo;

    final sampleMessages = [
      ChatMessage(id: 'm1', senderId: 'u1', receiverId: 'u2', message: 'Halo',
        isRead: true, created: now),
      ChatMessage(id: 'm2', senderId: 'u2', receiverId: 'u1', message: 'Hai juga',
        isRead: false, created: now.subtract(const Duration(minutes: 5))),
    ];

    final sampleConversations = [
      ConversationPreview(conversationId: 'conv1', otherUserId: 'u2',
        otherUserName: 'User 2', lastMessage: 'Hai juga',
        lastMessageTime: now, unreadCount: 1),
    ];

    setUp(() {
      repo = MockChatRepository();
    });

    blocTest<ChatBloc, ChatState>(
      'emits [Loading, MessagesLoaded] on LoadMessages',
      build: () {
        when(() => repo.getMessages('conv1')).thenAnswer((_) async => sampleMessages);
        when(() => repo.subscribe('conv1', any())).thenAnswer((_) {});
        return ChatBloc(repo);
      },
      act: (bloc) => bloc.add(const LoadMessages('conv1')),
      expect: () => [ChatLoading(), MessagesLoaded(sampleMessages)],
    );

    blocTest<ChatBloc, ChatState>(
      'emits [Loading, Error] when LoadMessages fails',
      build: () {
        when(() => repo.getMessages('conv1')).thenThrow(Exception('Error'));
        return ChatBloc(repo);
      },
      act: (bloc) => bloc.add(const LoadMessages('conv1')),
      expect: () => [ChatLoading(), isA<ChatError>()],
    );

    blocTest<ChatBloc, ChatState>(
      'emits [Loading, ConversationsLoaded] on LoadConversations',
      build: () {
        when(() => repo.getConversations('u1')).thenAnswer((_) async => sampleConversations);
        return ChatBloc(repo);
      },
      act: (bloc) => bloc.add(const LoadConversations('u1')),
      expect: () => [ChatLoading(), ConversationsLoaded(sampleConversations)],
    );

    blocTest<ChatBloc, ChatState>(
      'SendMessage silently succeeds (no state change)',
      build: () {
        when(() => repo.sendMessage(any())).thenAnswer((_) async => ChatMessage(
          id: 'new', senderId: 'u1', receiverId: 'u2', message: 'Test',
          isRead: false, created: now));
        return ChatBloc(repo);
      },
      act: (bloc) => bloc.add(SendMessage({'message': 'Test'})),
      expect: () => [],
    );

    blocTest<ChatBloc, ChatState>(
      'SendMessage emits ChatError on failure',
      build: () {
        when(() => repo.sendMessage(any())).thenThrow(Exception('Send failed'));
        return ChatBloc(repo);
      },
      act: (bloc) => bloc.add(SendMessage({'message': 'Test'})),
      expect: () => [isA<ChatError>()],
    );

    blocTest<ChatBloc, ChatState>(
      'NewMessageReceived prepends message to list',
      build: () => ChatBloc(repo),
      seed: () => MessagesLoaded(sampleMessages),
      act: (bloc) => bloc.add(NewMessageReceived(ChatMessage(
        id: 'm3', senderId: 'u2', receiverId: 'u1', message: 'Realtime!',
        isRead: false, created: now))),
      verify: (bloc) {
        final state = bloc.state as MessagesLoaded;
        expect(state.messages.first.id, equals('m3'));
        expect(state.messages.length, equals(3));
      },
    );
  });

  group('ConversationPreview', () {
    test('full construction', () {
      final preview = ConversationPreview(
        conversationId: 'c1', otherUserId: 'u2',
        otherUserName: 'Test', lastMessage: 'Hello',
        lastMessageTime: now, unreadCount: 3,
      );
      expect(preview.conversationId, equals('c1'));
      expect(preview.unreadCount, equals(3));
    });
  });

  group('ChatMessage', () {
    test('equality', () {
      final a = ChatMessage(id: '1', senderId: 'u1', receiverId: 'u2',
        message: 'Test', isRead: false, created: now);
      final b = ChatMessage(id: '1', senderId: 'u1', receiverId: 'u2',
        message: 'Test', isRead: false, created: now);
      expect(a, equals(b));
    });
  });
}
