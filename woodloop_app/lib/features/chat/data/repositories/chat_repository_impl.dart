import 'package:injectable/injectable.dart';
import '../../domain/entities/chat_message.dart';
import '../../domain/repositories/chat_repository.dart';
import '../datasources/chat_remote_datasource.dart';

@LazySingleton(as: ChatRepository)
class ChatRepositoryImpl implements ChatRepository {
  final ChatRemoteDataSource _remoteDataSource;

  ChatRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<ChatMessage>> getMessages(String conversationId) {
    return _remoteDataSource.getMessages(conversationId);
  }

  @override
  Future<ChatMessage> sendMessage(Map<String, dynamic> data) {
    return _remoteDataSource.sendMessage(data);
  }

  @override
  void subscribe(String conversationId, Function(ChatMessage) onMessage) {
    _remoteDataSource.subscribe(conversationId, onMessage);
  }

  @override
  void unsubscribe() {
    _remoteDataSource.unsubscribe();
  }
}
