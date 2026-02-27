import '../../domain/entities/chat_message.dart';

abstract class ChatRepository {
  Future<List<ChatMessage>> getMessages(String conversationId);
  Future<ChatMessage> sendMessage(Map<String, dynamic> data);
  void subscribe(String conversationId, Function(ChatMessage) onMessage);
  void unsubscribe();
}
