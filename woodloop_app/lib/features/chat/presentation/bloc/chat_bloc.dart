import 'dart:async';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import '../../domain/entities/chat_message.dart';
import '../../domain/repositories/chat_repository.dart';

part 'chat_event.dart';
part 'chat_state.dart';

@injectable
class ChatBloc extends Bloc<ChatEvent, ChatState> {
  final ChatRepository _repository;

  ChatBloc(this._repository) : super(ChatInitial()) {
    on<LoadMessages>(_onLoadMessages);
    on<SendMessage>(_onSendMessage);
    on<NewMessageReceived>(_onNewMessageReceived);
  }

  Future<void> _onLoadMessages(
    LoadMessages event,
    Emitter<ChatState> emit,
  ) async {
    emit(ChatLoading());
    try {
      final messages = await _repository.getMessages(event.conversationId);
      // Subscribe to realtime updates
      _repository.subscribe(event.conversationId, (message) {
        add(NewMessageReceived(message));
      });
      emit(MessagesLoaded(messages));
    } catch (e) {
      emit(ChatError(e.toString()));
    }
  }

  Future<void> _onSendMessage(
    SendMessage event,
    Emitter<ChatState> emit,
  ) async {
    try {
      await _repository.sendMessage(event.data);
    } catch (e) {
      emit(ChatError(e.toString()));
    }
  }

  void _onNewMessageReceived(
    NewMessageReceived event,
    Emitter<ChatState> emit,
  ) {
    final currentState = state;
    if (currentState is MessagesLoaded) {
      // Prepend new message (newest first)
      final updatedMessages = [event.message, ...currentState.messages];
      emit(MessagesLoaded(updatedMessages));
    }
  }

  @override
  Future<void> close() {
    _repository.unsubscribe();
    return super.close();
  }
}
