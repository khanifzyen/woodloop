import '../../domain/entities/chat_message.dart';
import 'package:pocketbase/pocketbase.dart';

class ChatMessageModel extends ChatMessage {
  const ChatMessageModel({
    required super.id,
    required super.senderId,
    required super.receiverId,
    super.conversationId,
    required super.body,
    super.senderName,
    required super.created,
  });

  factory ChatMessageModel.fromRecord(RecordModel record) {
    return ChatMessageModel(
      id: record.id,
      senderId: record.getStringValue('sender_id'),
      receiverId: record.getStringValue('receiver_id'),
      conversationId: record.getStringValue('conversation_id'),
      body: record.getStringValue('body'),
      senderName: record.getStringValue('sender_name'),
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
    );
  }
}
