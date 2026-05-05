import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/notification_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../../injection_container.dart';
import '../../../core/theme/app_theme.dart';

/// Reusable notification badge widget.
/// Shows unread notification count. Can be embedded in AppBar or dashboard.
class NotificationBadge extends StatelessWidget {
  final VoidCallback? onTap;

  const NotificationBadge({super.key, this.onTap});

  @override
  Widget build(BuildContext context) {
    final authState = context.read<AuthBloc>().state;
    if (authState is! Authenticated) return const SizedBox.shrink();

    return BlocProvider(
      create: (_) {
        final bloc = getIt<NotificationBloc>();
        bloc.add(LoadNotifications(authState.user.id));
        return bloc;
      },
      child: BlocBuilder<NotificationBloc, NotificationState>(
        builder: (context, state) {
          int unread = 0;
          if (state is NotificationsLoaded) {
            unread = state.unreadCount;
          }
          return GestureDetector(
            onTap: onTap,
            child: Stack(
              children: [
                const Padding(
                  padding: EdgeInsets.all(8),
                  child: Icon(Icons.notifications_outlined, color: Colors.white, size: 24),
                ),
                if (unread > 0)
                  Positioned(
                    right: 4, top: 4,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Colors.redAccent, shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(minWidth: 18, minHeight: 18),
                      child: Text(
                        unread > 99 ? '99+' : '$unread',
                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}
