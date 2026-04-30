import 'package:equatable/equatable.dart';

class ChatMessage extends Equatable {
  final String id;
  final String senderId;
  final String receiverId;
  final String? conversationId;
  final String message;
  final String? senderName;
  final bool isRead;
  final String? attachment;
  final DateTime created;

  const ChatMessage({
    required this.id,
    required this.senderId,
    required this.receiverId,
    this.conversationId,
    required this.message,
    this.senderName,
    this.isRead = false,
    this.attachment,
    required this.created,
  });

  @override
  List<Object?> get props => [
    id,
    senderId,
    receiverId,
    conversationId,
    message,
    senderName,
    isRead,
    attachment,
    created,
  ];
}
