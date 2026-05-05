import 'package:equatable/equatable.dart';

class ConversationPreview extends Equatable {
  final String conversationId;
  final String otherUserId;
  final String otherUserName;
  final String lastMessage;
  final DateTime lastMessageTime;
  final int unreadCount;

  const ConversationPreview({
    required this.conversationId,
    required this.otherUserId,
    required this.otherUserName,
    required this.lastMessage,
    required this.lastMessageTime,
    this.unreadCount = 0,
  });

  @override
  List<Object?> get props => [
    conversationId,
    otherUserId,
    otherUserName,
    lastMessage,
    lastMessageTime,
    unreadCount,
  ];
}
