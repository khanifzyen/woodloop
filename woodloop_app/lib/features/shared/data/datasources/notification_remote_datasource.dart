import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';
import '../models/notification_model.dart';

abstract class NotificationRemoteDataSource {
  Future<List<NotificationModel>> getNotifications(String userId);
  Future<void> markAsRead(String notificationId);
  void subscribe(String userId, Function(NotificationModel) onNotification);
  void unsubscribe();
}

@LazySingleton(as: NotificationRemoteDataSource)
class NotificationRemoteDataSourceImpl implements NotificationRemoteDataSource {
  final PocketBase _pb;

  NotificationRemoteDataSourceImpl(this._pb);

  @override
  Future<List<NotificationModel>> getNotifications(String userId) async {
    final records = await _pb
        .collection('notifications')
        .getList(filter: 'user_id = "$userId"', sort: '-created', perPage: 50);
    return records.items.map((r) => NotificationModel.fromRecord(r)).toList();
  }

  @override
  Future<void> markAsRead(String notificationId) async {
    await _pb
        .collection('notifications')
        .update(notificationId, body: {'is_read': true});
  }

  @override
  void subscribe(String userId, Function(NotificationModel) onNotification) {
    _pb.collection('notifications').subscribe('*', (e) {
      if (e.action == 'create' && e.record != null) {
        final notification = NotificationModel.fromRecord(e.record!);
        if (notification.userId == userId) {
          onNotification(notification);
        }
      }
    });
  }

  @override
  void unsubscribe() {
    _pb.collection('notifications').unsubscribe('*');
  }
}
