part of 'chat_bloc.dart';

abstract class ChatEvent extends Equatable {
  const ChatEvent();

  @override
  List<Object?> get props => [];
}

class LoadMessages extends ChatEvent {
  final String conversationId;

  const LoadMessages(this.conversationId);

  @override
  List<Object?> get props => [conversationId];
}

class SendMessage extends ChatEvent {
  final Map<String, dynamic> data;

  const SendMessage(this.data);

  @override
  List<Object?> get props => [data];
}

class NewMessageReceived extends ChatEvent {
  final ChatMessage message;

  const NewMessageReceived(this.message);

  @override
  List<Object?> get props => [message];
}
