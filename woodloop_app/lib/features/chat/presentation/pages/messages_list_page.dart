import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';

class MessagesListPage extends StatelessWidget {
  const MessagesListPage({super.key});

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
        child: Column(
          children: [
            // Tabs Menu
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 8.0,
              ),
              child: Row(
                children: [
                  _buildTabItem(l10n.chatMessagesTabAll, true),
                  const SizedBox(width: 8),
                  _buildTabItem(l10n.chatMessagesTabUnread, false),
                  const SizedBox(width: 8),
                  _buildTabItem(l10n.chatMessagesTabSystem, false),
                ],
              ),
            ),

            // Messages List
            Expanded(
              child: ListView(
                padding: const EdgeInsets.only(top: 16),
                children: [
                  _buildMessageItem(
                    context: context,
                    name: l10n.chatMockSender1,
                    message: l10n.chatMockMessage1,
                    time: l10n.chatMockTime1,
                    unreadCount: 2,
                    isOnline: true,
                  ),
                  const Divider(color: Colors.white10, height: 1),
                  _buildMessageItem(
                    context: context,
                    name: l10n.chatMockSender2,
                    message: l10n.chatMockMessage2,
                    time: l10n.chatMockTime2,
                    unreadCount: 0,
                    isOnline: false,
                  ),
                  const Divider(color: Colors.white10, height: 1),
                  _buildMessageItem(
                    context: context,
                    name: l10n.chatMockSender3,
                    message: l10n.chatMockMessage3,
                    time: l10n.chatMockTime3,
                    unreadCount: 0,
                    isOnline: true,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabItem(String label, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected
            ? AppTheme.primaryColor.withValues(alpha: 0.1)
            : Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isSelected
              ? AppTheme.primaryColor
              : Colors.white.withValues(alpha: 0.2),
        ),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? AppTheme.primaryColor : Colors.white70,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          fontSize: 12,
        ),
      ),
    );
  }

  Widget _buildMessageItem({
    required BuildContext context,
    required String name,
    required String message,
    required String time,
    required int unreadCount,
    required bool isOnline,
  }) {
    return InkWell(
      onTap: () {
        context.pushNamed('direct_message_conversation');
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: Row(
          children: [
            // Avatar
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
                  child: const Center(
                    child: Icon(Icons.person, color: Colors.white54),
                  ),
                ),
                if (isOnline)
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

            // Text Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          name,
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
    );
  }
}
