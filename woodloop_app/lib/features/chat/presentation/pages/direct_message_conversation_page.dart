import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class DirectMessageConversationPage extends StatelessWidget {
  const DirectMessageConversationPage({super.key});

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
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  l10n.chatDmSenderName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  l10n.chatDmStatusOnline,
                  style: const TextStyle(
                    color: AppTheme.primaryColor,
                    fontSize: 12,
                  ),
                ),
              ],
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
            // Chat Area
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(20),
                reverse: true, // Start from bottom
                children: [
                  _buildChatBubble(
                    message: l10n.chatDmMessage1,
                    time: l10n.chatDmTime1,
                    isMe: false,
                  ),
                  const SizedBox(height: 16),
                  _buildChatBubble(
                    message: l10n.chatDmMessage2,
                    time: l10n.chatDmTime2,
                    isMe: true,
                    isRead: true,
                  ),
                  const SizedBox(height: 16),
                  _buildChatBubble(
                    message: l10n.chatDmMessage3,
                    time: l10n.chatDmTime3,
                    isMe: true,
                    isRead: true,
                  ),
                  const SizedBox(height: 32),
                  Center(
                    child: Text(
                      l10n.chatDmToday,
                      style: const TextStyle(
                        color: Colors.white24,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
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
                      onPressed: () {},
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

  Widget _buildChatBubble({
    required String message,
    required String time,
    required bool isMe,
    bool isRead = false,
  }) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: 280, // Max width for chat bubbles
        ),
        child: Column(
          crossAxisAlignment: isMe
              ? CrossAxisAlignment.end
              : CrossAxisAlignment.start,
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
