import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../presentation/bloc/chat_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../../injection_container.dart';

class MessagesListPage extends StatelessWidget {
  const MessagesListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        final bloc = getIt<ChatBloc>();
        final authState = context.read<AuthBloc>().state;
        if (authState is Authenticated) {
          bloc.add(LoadConversations(authState.user.id));
        }
        return bloc;
      },
      child: const _MessagesListView(),
    );
  }
}

class _MessagesListView extends StatelessWidget {
  const _MessagesListView();

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l10n.chatMessagesTitle,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [IconButton(icon: const Icon(Icons.search), onPressed: () {})],
      ),
      body: SafeArea(
        child: BlocBuilder<ChatBloc, ChatState>(
          builder: (context, state) {
            if (state is ChatLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            if (state is ConversationsLoaded) {
              if (state.conversations.isEmpty) {
                return Center(
                  child: Text(
                    l10n.chatDmMessage1,
                    style: const TextStyle(color: Colors.white54),
                  ),
                );
              }

              return ListView.builder(
                padding: const EdgeInsets.only(top: 16),
                itemCount: state.conversations.length,
                itemBuilder: (context, index) {
                  final conv = state.conversations[index];
                  return _buildConversationItem(
                    context: context,
                    conversationId: conv.conversationId,
                    receiverId: conv.otherUserId,
                    receiverName: conv.otherUserName,
                    message: conv.lastMessage,
                    time: _formatTime(conv.lastMessageTime),
                    unreadCount: conv.unreadCount,
                  );
                },
              );
            }

            if (state is ChatError) {
              return Center(
                child: Text(
                  state.message,
                  style: const TextStyle(color: Colors.redAccent),
                ),
              );
            }

            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  String _formatTime(DateTime dt) {
    final hour = dt.hour.toString().padLeft(2, '0');
    final minute = dt.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  Widget _buildConversationItem({
    required BuildContext context,
    required String conversationId,
    required String receiverId,
    required String receiverName,
    required String message,
    required String time,
    required int unreadCount,
  }) {
    return InkWell(
      onTap: () {
        context.pushNamed('direct_message_conversation', extra: {
          'conversation_id': conversationId,
          'receiver_id': receiverId,
          'receiver_name': receiverName,
        });
      },
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
            child: Row(
              children: [
                Stack(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceColor,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.1),
                        ),
                      ),
                      child: Center(
                        child: Text(
                          receiverName.isNotEmpty
                              ? receiverName[0].toUpperCase()
                              : '?',
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    if (unreadCount == 0)
                      Positioned(
                        right: 0,
                        bottom: 0,
                        child: Container(
                          width: 14,
                          height: 14,
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: AppTheme.background,
                              width: 2,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              receiverName,
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: unreadCount > 0
                                    ? FontWeight.bold
                                    : FontWeight.w600,
                                fontSize: 16,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Text(
                            time,
                            style: TextStyle(
                              color: unreadCount > 0
                                  ? AppTheme.primaryColor
                                  : Colors.white38,
                              fontSize: 12,
                              fontWeight: unreadCount > 0
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              message,
                              style: TextStyle(
                                color: unreadCount > 0
                                    ? Colors.white
                                    : Colors.white54,
                                fontWeight: unreadCount > 0
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                                fontSize: 14,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (unreadCount > 0) ...[
                            const SizedBox(width: 12),
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: const BoxDecoration(
                                color: AppTheme.primaryColor,
                                shape: BoxShape.circle,
                              ),
                              child: Text(
                                unreadCount.toString(),
                                style: const TextStyle(
                                  color: AppTheme.background,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(color: Colors.white10, height: 1),
        ],
      ),
    );
  }
}
