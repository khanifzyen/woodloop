import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../presentation/bloc/chat_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../../injection_container.dart';

class DirectMessageConversationPage extends StatelessWidget {
  final String? conversationId;
  final String receiverId;
  final String receiverName;
  const DirectMessageConversationPage({
    super.key,
    this.conversationId,
    required this.receiverId,
    required this.receiverName,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        final bloc = getIt<ChatBloc>();
        if (conversationId != null && conversationId!.isNotEmpty) {
          bloc.add(LoadMessages(conversationId!));
        }
        return bloc;
      },
      child: _DirectMessageConversationView(
        conversationId: conversationId,
        receiverId: receiverId,
        receiverName: receiverName,
      ),
    );
  }
}

class _DirectMessageConversationView extends StatefulWidget {
  final String? conversationId;
  final String receiverId;
  final String receiverName;
  const _DirectMessageConversationView({
    this.conversationId,
    required this.receiverId,
    required this.receiverName,
  });

  @override
  State<_DirectMessageConversationView> createState() =>
      _DirectMessageConversationViewState();
}

class _DirectMessageConversationViewState
    extends State<_DirectMessageConversationView> {
  final _messageController = TextEditingController();

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

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
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
              ),
              child: const Center(
                child: Icon(Icons.person, color: Colors.white54, size: 16),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              widget.receiverName,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        backgroundColor: AppTheme.surfaceColor,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.call_outlined), onPressed: () {}),
          IconButton(icon: const Icon(Icons.more_vert), onPressed: () {}),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: BlocBuilder<ChatBloc, ChatState>(
                builder: (context, state) {
                  if (state is ChatLoading) {
                    return const Center(
                      child: CircularProgressIndicator(),
                    );
                  }

                  if (state is MessagesLoaded) {
                    if (state.messages.isEmpty) {
                      return Center(
                        child: Text(
                          l10n.chatDmMessage1, // reuse: "Belum ada pesan"
                          style: const TextStyle(color: Colors.white54),
                        ),
                      );
                    }

                    return ListView.builder(
                      padding: const EdgeInsets.all(20),
                      reverse: true,
                      itemCount: state.messages.length,
                      itemBuilder: (context, index) {
                        final msg = state.messages[index];
                        final authState = context.read<AuthBloc>().state;
                        final myId =
                            authState is Authenticated ? authState.user.id : '';
                        final isMe = msg.senderId == myId;
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: _buildChatBubble(
                            message: msg.message,
                            time: _formatTime(msg.created, l10n),
                            isMe: isMe,
                            isRead: msg.isRead,
                          ),
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

                  return Center(
                    child: Text(
                      l10n.chatDmMessage1,
                      style: const TextStyle(color: Colors.white54),
                    ),
                  );
                },
              ),
            ),

            // Input Area
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                border: Border(
                  top: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
                ),
              ),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.add, color: Colors.white54),
                    onPressed: () {},
                  ),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: AppTheme.background,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.1),
                        ),
                      ),
                      child: TextField(
                        controller: _messageController,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: l10n.chatDmInputHint,
                          hintStyle: const TextStyle(color: Colors.white38),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    decoration: const BoxDecoration(
                      color: AppTheme.primaryColor,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(
                        Icons.send,
                        color: AppTheme.background,
                        size: 20,
                      ),
                      onPressed: () {
                        final text = _messageController.text.trim();
                        if (text.isEmpty) return;
                        final authState = context.read<AuthBloc>().state;
                        String senderId = '';
                        if (authState is Authenticated) {
                          senderId = authState.user.id;
                        }
                        context.read<ChatBloc>().add(
                          SendMessage({
                            'sender': senderId,
                            'receiver': widget.receiverId,
                            'conversation_id': widget.conversationId ?? '',
                            'message': text,
                          }),
                        );
                        _messageController.clear();
                      },
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime dt, AppLocalizations l10n) {
    final hour = dt.hour.toString().padLeft(2, '0');
    final minute = dt.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  Widget _buildChatBubble({
    required String message,
    required String time,
    required bool isMe,
    bool isRead = false,
  }) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 280),
        child: Column(
          crossAxisAlignment:
              isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isMe ? AppTheme.primaryColor : AppTheme.surfaceColor,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(20),
                  topRight: const Radius.circular(20),
                  bottomLeft: Radius.circular(isMe ? 20 : 0),
                  bottomRight: Radius.circular(isMe ? 0 : 20),
                ),
                border: Border.all(
                  color: isMe
                      ? AppTheme.primaryColor
                      : Colors.white.withValues(alpha: 0.1),
                ),
              ),
              child: Text(
                message,
                style: TextStyle(
                  color: isMe ? AppTheme.background : Colors.white,
                  height: 1.4,
                ),
              ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  time,
                  style: const TextStyle(color: Colors.white38, fontSize: 10),
                ),
                if (isMe) ...[
                  const SizedBox(width: 4),
                  Icon(
                    isRead ? Icons.done_all : Icons.check,
                    color: isRead ? AppTheme.primaryColor : Colors.white38,
                    size: 14,
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}
