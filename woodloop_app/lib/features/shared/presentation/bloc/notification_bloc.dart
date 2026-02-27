import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import '../../data/datasources/notification_remote_datasource.dart';
import '../../domain/entities/notification_item.dart';

part 'notification_event.dart';
part 'notification_state.dart';

@injectable
class NotificationBloc extends Bloc<NotificationEvent, NotificationState> {
  final NotificationRemoteDataSource _dataSource;

  NotificationBloc(this._dataSource) : super(NotificationInitial()) {
    on<LoadNotifications>(_onLoadNotifications);
    on<MarkNotificationAsRead>(_onMarkAsRead);
    on<NewNotificationReceived>(_onNewNotification);
  }

  Future<void> _onLoadNotifications(
    LoadNotifications event,
    Emitter<NotificationState> emit,
  ) async {
    emit(NotificationLoading());
    try {
      final items = await _dataSource.getNotifications(event.userId);
      // Subscribe to realtime updates
      _dataSource.subscribe(event.userId, (notification) {
        add(NewNotificationReceived(notification));
      });
      final unreadCount = items.where((n) => !n.isRead).length;
      emit(NotificationsLoaded(items: items, unreadCount: unreadCount));
    } catch (e) {
      emit(NotificationError(e.toString()));
    }
  }

  Future<void> _onMarkAsRead(
    MarkNotificationAsRead event,
    Emitter<NotificationState> emit,
  ) async {
    try {
      await _dataSource.markAsRead(event.notificationId);
      final currentState = state;
      if (currentState is NotificationsLoaded) {
        final updatedItems = currentState.items.map((n) {
          if (n.id == event.notificationId) {
            return NotificationItem(
              id: n.id,
              userId: n.userId,
              title: n.title,
              message: n.message,
              type: n.type,
              isRead: true,
              created: n.created,
            );
          }
          return n;
        }).toList();
        final unreadCount = updatedItems.where((n) => !n.isRead).length;
        emit(
          NotificationsLoaded(items: updatedItems, unreadCount: unreadCount),
        );
      }
    } catch (e) {
      emit(NotificationError(e.toString()));
    }
  }

  void _onNewNotification(
    NewNotificationReceived event,
    Emitter<NotificationState> emit,
  ) {
    final currentState = state;
    if (currentState is NotificationsLoaded) {
      final updatedItems = [event.notification, ...currentState.items];
      final unreadCount = updatedItems.where((n) => !n.isRead).length;
      emit(NotificationsLoaded(items: updatedItems, unreadCount: unreadCount));
    }
  }

  @override
  Future<void> close() {
    _dataSource.unsubscribe();
    return super.close();
  }
}
