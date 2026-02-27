import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:woodloop_app/l10n/app_localizations.dart';
import '../../presentation/bloc/notification_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../../injection_container.dart';

class NotificationCenterPage extends StatelessWidget {
  const NotificationCenterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        final bloc = getIt<NotificationBloc>();
        final authState = context.read<AuthBloc>().state;
        if (authState is Authenticated) {
          bloc.add(LoadNotifications(authState.user.id));
        }
        return bloc;
      },
      child: const _NotificationCenterView(),
    );
  }
}

class _NotificationCenterView extends StatelessWidget {
  const _NotificationCenterView();

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
          l10n.notificationTitle,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: () {},
            child: Text(
              l10n.notificationMarkRead,
              style: const TextStyle(color: AppTheme.primaryColor),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: BlocBuilder<NotificationBloc, NotificationState>(
          builder: (context, state) {
            if (state is NotificationLoading) {
              return const Center(
                child: CircularProgressIndicator(color: AppTheme.primaryColor),
              );
            }
            if (state is NotificationsLoaded) {
              if (state.items.isEmpty) {
                return Center(
                  child: Text(
                    'Belum ada notifikasi',
                    style: TextStyle(color: Colors.white54, fontSize: 13),
                  ),
                );
              }
              final unread = state.items.where((n) => !n.isRead).toList();
              final read = state.items.where((n) => n.isRead).toList();
              return ListView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 8,
                ),
                children: [
                  if (unread.isNotEmpty) ...[
                    Padding(
                      padding: const EdgeInsets.only(bottom: 16.0),
                      child: Text(
                        l10n.notificationNew,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    ...unread.map(
                      (n) => _buildNotificationItem(
                        title: n.title,
                        message: n.message,
                        time: _formatTime(n.created),
                        icon: _iconForType(n.type),
                        color: _colorForType(n.type),
                        isUnread: true,
                      ),
                    ),
                  ],
                  if (read.isNotEmpty) ...[
                    Padding(
                      padding: const EdgeInsets.only(top: 24.0, bottom: 16.0),
                      child: Text(
                        l10n.notificationEarlier,
                        style: const TextStyle(
                          color: Colors.white54,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    ...read.map(
                      (n) => _buildNotificationItem(
                        title: n.title,
                        message: n.message,
                        time: _formatTime(n.created),
                        icon: _iconForType(n.type),
                        color: _colorForType(n.type),
                        isUnread: false,
                      ),
                    ),
                  ],
                ],
              );
            }
            if (state is NotificationError) {
              return Center(
                child: Text(
                  state.message,
                  style: const TextStyle(color: Colors.redAccent, fontSize: 12),
                ),
              );
            }
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  Widget _buildNotificationItem({
    required String title,
    required String message,
    required String time,
    required IconData icon,
    required Color color,
    required bool isUnread,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isUnread ? color.withValues(alpha: 0.1) : AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isUnread
              ? color.withValues(alpha: 0.3)
              : Colors.white.withValues(alpha: 0.05),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
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
                        title,
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: isUnread
                              ? FontWeight.bold
                              : FontWeight.w600,
                          fontSize: 14,
                        ),
                      ),
                    ),
                    Text(
                      time,
                      style: TextStyle(
                        color: isUnread
                            ? AppTheme.primaryColor
                            : Colors.white38,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  message,
                  style: const TextStyle(
                    color: Colors.white54,
                    fontSize: 12,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m yang lalu';
    if (diff.inHours < 24) return '${diff.inHours}j yang lalu';
    if (diff.inDays < 7) return '${diff.inDays} hari yang lalu';
    return '${dt.day}/${dt.month}/${dt.year}';
  }

  IconData _iconForType(String type) {
    switch (type) {
      case 'order':
        return Icons.local_shipping_outlined;
      case 'payment':
        return Icons.account_balance_wallet_outlined;
      case 'pickup':
        return Icons.recycling;
      case 'bid':
        return Icons.local_offer_outlined;
      default:
        return Icons.notifications_outlined;
    }
  }

  Color _colorForType(String type) {
    switch (type) {
      case 'order':
        return Colors.orange;
      case 'payment':
        return AppTheme.primaryColor;
      case 'pickup':
        return Colors.blue;
      case 'bid':
        return Colors.amber;
      default:
        return Colors.white;
    }
  }
}
