import 'package:equatable/equatable.dart';

class ChatMessage extends Equatable {
  final String id;
  final String senderId;
  final String receiverId;
  final String? conversationId;
  final String body;
  final String? senderName;
  final DateTime created;

  const ChatMessage({
    required this.id,
    required this.senderId,
    required this.receiverId,
    this.conversationId,
    required this.body,
    this.senderName,
    required this.created,
  });

  @override
  List<Object?> get props => [
    id,
    senderId,
    receiverId,
    conversationId,
    body,
    senderName,
    created,
  ];
}
