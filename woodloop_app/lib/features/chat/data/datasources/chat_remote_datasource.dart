import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';
import '../models/chat_message_model.dart';
import '../../domain/entities/conversation_preview.dart';

abstract class ChatRemoteDataSource {
  Future<List<ChatMessageModel>> getMessages(String conversationId);
  Future<List<ConversationPreview>> getConversations(String userId);
  Future<ChatMessageModel> sendMessage(Map<String, dynamic> data);
  void subscribe(String conversationId, Function(ChatMessageModel) onMessage);
  void unsubscribe();
}

@LazySingleton(as: ChatRemoteDataSource)
class ChatRemoteDataSourceImpl implements ChatRemoteDataSource {
  final PocketBase _pb;
  UnsubscribeFunc? _unsubscribe;

  ChatRemoteDataSourceImpl(this._pb);

  @override
  Future<List<ChatMessageModel>> getMessages(String conversationId) async {
    final records = await _pb
        .collection('chats')
        .getList(
          filter: 'conversation_id = "$conversationId"',
          sort: '-created',
          perPage: 50,
        );
    return records.items.map((r) => ChatMessageModel.fromRecord(r)).toList();
  }

  @override
  Future<List<ConversationPreview>> getConversations(String userId) async {
    final records = await _pb.collection('chats').getList(
      filter: 'sender = "$userId" || receiver = "$userId"',
      sort: '-created',
      perPage: 200,
      expand: 'sender,receiver',
    );

    // Group by conversation_id and pick latest per group
    final grouped = <String, List<RecordModel>>{};
    for (final r in records.items) {
      final convId = r.getStringValue('conversation_id');
      if (convId.isNotEmpty) {
        grouped.putIfAbsent(convId, () => []).add(r);
      }
    }

    final conversations = <ConversationPreview>[];
    for (final entry in grouped.entries) {
      final latest = entry.value.first;
      final senderId = latest.getStringValue('sender');
      final receiverId = latest.getStringValue('receiver');
      final otherId = senderId == userId ? receiverId : senderId;

      String otherName = 'User';
      final senderExpanded = latest.get<RecordModel?>('expand.sender');
      final receiverExpanded = latest.get<RecordModel?>('expand.receiver');
      if (senderId == userId && receiverExpanded != null) {
        otherName = receiverExpanded.getStringValue('name');
      } else if (receiverId == userId && senderExpanded != null) {
        otherName = senderExpanded.getStringValue('name');
      }

      final unreadCount = entry.value
          .where((r) => r.getStringValue('receiver') == userId && !r.getBoolValue('is_read'))
          .length;

      conversations.add(ConversationPreview(
        conversationId: entry.key,
        otherUserId: otherId,
        otherUserName: otherName,
        lastMessage: latest.getStringValue('message'),
        lastMessageTime:
            DateTime.tryParse(latest.getStringValue('created')) ?? DateTime.now(),
        unreadCount: unreadCount,
      ));
    }

    conversations.sort((a, b) => b.lastMessageTime.compareTo(a.lastMessageTime));
    return conversations;
  }

  @override
  Future<ChatMessageModel> sendMessage(Map<String, dynamic> data) async {
    final record = await _pb.collection('chats').create(body: data);
    return ChatMessageModel.fromRecord(record);
  }

  @override
  void subscribe(String conversationId, Function(ChatMessageModel) onMessage) {
    _pb.collection('chats').subscribe('*', (e) {
      if (e.action == 'create' && e.record != null) {
        final msg = ChatMessageModel.fromRecord(e.record!);
        if (msg.conversationId == conversationId) {
          onMessage(msg);
        }
      }
    });
  }

  @override
  void unsubscribe() {
    _unsubscribe?.call();
    _unsubscribe = null;
    _pb.collection('chats').unsubscribe('*');
  }
}
