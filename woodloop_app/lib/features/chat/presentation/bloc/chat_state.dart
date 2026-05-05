part of 'chat_bloc.dart';

abstract class ChatState extends Equatable {
  const ChatState();

  @override
  List<Object?> get props => [];
}

class ChatInitial extends ChatState {}

class ChatLoading extends ChatState {}

class MessagesLoaded extends ChatState {
  final List<ChatMessage> messages;

  const MessagesLoaded(this.messages);

  @override
  List<Object?> get props => [messages];
}

class ConversationsLoaded extends ChatState {
  final List<ConversationPreview> conversations;

  const ConversationsLoaded(this.conversations);

  @override
  List<Object?> get props => [conversations];
}

class ChatError extends ChatState {
  final String message;

  const ChatError(this.message);

  @override
  List<Object?> get props => [message];
}
