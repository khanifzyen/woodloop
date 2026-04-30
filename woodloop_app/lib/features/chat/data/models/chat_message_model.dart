import '../../domain/entities/chat_message.dart';
import 'package:pocketbase/pocketbase.dart';

class ChatMessageModel extends ChatMessage {
  const ChatMessageModel({
    required super.id,
    required super.senderId,
    required super.receiverId,
    super.conversationId,
    required super.message,
    super.isRead,
    super.attachment,
    required super.created,
  });

  factory ChatMessageModel.fromRecord(RecordModel record) {
    return ChatMessageModel(
      id: record.id,
      senderId: record.getStringValue('sender'),
      receiverId: record.getStringValue('receiver'),
      conversationId: record.getStringValue('conversation_id'),
      message: record.getStringValue('message'),
      isRead: record.getBoolValue('is_read'),
      attachment: record.getStringValue('attachment'),
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
    );
  }
}
