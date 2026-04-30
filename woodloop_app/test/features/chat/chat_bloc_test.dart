import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:woodloop_app/features/chat/domain/entities/chat_message.dart';
import 'package:woodloop_app/features/chat/domain/repositories/chat_repository.dart';
import 'package:woodloop_app/features/chat/presentation/bloc/chat_bloc.dart';

class MockChatRepository extends Mock implements ChatRepository {}

void main() {
  late MockChatRepository repository;

  final now = DateTime(2026, 4, 28);
  final sampleMessages = [
    ChatMessage(
      id: 'msg1',
      senderId: 'user1',
      receiverId: 'user2',
      conversationId: 'conv1',
      message: 'Hello!',
      senderName: 'Alice',
      created: now,
    ),
    ChatMessage(
      id: 'msg2',
      senderId: 'user2',
      receiverId: 'user1',
      conversationId: 'conv1',
      message: 'Hi there!',
      senderName: 'Bob',
      created: now,
    ),
  ];

  setUp(() {
    repository = MockChatRepository();
  });

  group('LoadMessages', () {
    const conversationId = 'conv1';

    blocTest<ChatBloc, ChatState>(
      'emits [ChatLoading, MessagesLoaded] on success, and subscribes',
      build: () {
        when(() => repository.getMessages(conversationId))
            .thenAnswer((_) async => sampleMessages);
        when(() => repository.subscribe(any(), any())).thenReturn(null);
        return ChatBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadMessages(conversationId)),
      expect: () => [
        ChatLoading(),
        MessagesLoaded(sampleMessages),
      ],
    );

    blocTest<ChatBloc, ChatState>(
      'emits [ChatLoading, ChatError] on failure',
      build: () {
        when(() => repository.getMessages(conversationId))
            .thenThrow(Exception('Failed to load messages'));
        return ChatBloc(repository);
      },
      act: (bloc) => bloc.add(const LoadMessages(conversationId)),
      expect: () => [
        ChatLoading(),
        isA<ChatError>(),
      ],
    );
  });

  group('SendMessage', () {
    final messageData = <String, dynamic>{
      'conversationId': 'conv1',
      'senderId': 'user1',
      'receiverId': 'user2',
      'message': 'Hello!',
    };

    blocTest<ChatBloc, ChatState>(
      'adds a message silently (no state change) on success',
      build: () {
        when(() => repository.sendMessage(messageData))
            .thenAnswer((_) async => sampleMessages.first);
        return ChatBloc(repository);
      },
      act: (bloc) => bloc.add(SendMessage(messageData)),
      expect: () => [],
    );

    blocTest<ChatBloc, ChatState>(
      'emits [ChatError] when sendMessage fails',
      build: () {
        when(() => repository.sendMessage(messageData))
            .thenThrow(Exception('Send failed'));
        return ChatBloc(repository);
      },
      act: (bloc) => bloc.add(SendMessage(messageData)),
      expect: () => [
        isA<ChatError>(),
      ],
    );
  });
}
