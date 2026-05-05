import '../../domain/entities/chat_message.dart';
import '../../domain/entities/conversation_preview.dart';

abstract class ChatRepository {
  Future<List<ChatMessage>> getMessages(String conversationId);
  Future<List<ConversationPreview>> getConversations(String userId);
  Future<ChatMessage> sendMessage(Map<String, dynamic> data);
  void subscribe(String conversationId, Function(ChatMessage) onMessage);
  void unsubscribe();
}
