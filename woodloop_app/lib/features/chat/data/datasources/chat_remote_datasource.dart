import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';
import '../models/chat_message_model.dart';

abstract class ChatRemoteDataSource {
  Future<List<ChatMessageModel>> getMessages(String conversationId);
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
