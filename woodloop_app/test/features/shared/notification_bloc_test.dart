import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:woodloop_app/features/shared/data/datasources/notification_remote_datasource.dart';
import 'package:woodloop_app/features/shared/data/models/notification_model.dart';
import 'package:woodloop_app/features/shared/domain/entities/notification_item.dart';
import 'package:woodloop_app/features/shared/presentation/bloc/notification_bloc.dart';

class MockNotificationRemoteDataSource extends Mock
    implements NotificationRemoteDataSource {}

void main() {
  late MockNotificationRemoteDataSource dataSource;

  final now = DateTime(2026, 4, 28);

  final notificationModel1 = NotificationModel(
    id: 'n1',
    userId: 'user1',
    title: 'Order Baru',
    message: 'Pesanan baru masuk',
    type: 'order',
    isRead: false,
    created: now,
  );

  final notificationModel2 = NotificationModel(
    id: 'n2',
    userId: 'user1',
    title: 'Pembayaran Diterima',
    message: 'Pembayaran telah dikonfirmasi',
    type: 'payment',
    isRead: true,
    created: now.subtract(const Duration(hours: 1)),
  );

  setUp(() {
    dataSource = MockNotificationRemoteDataSource();
  });

  group('LoadNotifications', () {
    const userId = 'user1';

    blocTest<NotificationBloc, NotificationState>(
      'emits [NotificationLoading, NotificationsLoaded] on success',
      build: () {
        when(() => dataSource.getNotifications(userId)).thenAnswer(
          (_) async => [notificationModel1, notificationModel2],
        );
        when(() => dataSource.subscribe(any(), any())).thenReturn(null);
        return NotificationBloc(dataSource);
      },
      act: (bloc) => bloc.add(const LoadNotifications(userId)),
      expect: () => [
        NotificationLoading(),
        NotificationsLoaded(
          items: [notificationModel1, notificationModel2],
          unreadCount: 1,
        ),
      ],
    );

    blocTest<NotificationBloc, NotificationState>(
      'emits [NotificationLoading, NotificationError] on failure',
      build: () {
        when(() => dataSource.getNotifications(userId))
            .thenThrow(Exception('Failed to load notifications'));
        return NotificationBloc(dataSource);
      },
      act: (bloc) => bloc.add(const LoadNotifications(userId)),
      expect: () => [
        NotificationLoading(),
        isA<NotificationError>(),
      ],
    );
  });

  group('MarkNotificationAsRead', () {
    blocTest<NotificationBloc, NotificationState>(
      'emits NotificationsLoaded with updated read status on success',
      build: () {
        when(() => dataSource.markAsRead('n1')).thenAnswer((_) async {});
        return NotificationBloc(dataSource);
      },
      seed: () => NotificationsLoaded(
        items: [notificationModel1, notificationModel2],
        unreadCount: 1,
      ),
      act: (bloc) => bloc.add(const MarkNotificationAsRead('n1')),
      expect: () => [
        isA<NotificationsLoaded>()
            .having((s) => s.items.length, 'items length', 2)
            .having(
              (s) => s.items[0].isRead,
              'first item isRead',
              true,
            )
            .having((s) => s.unreadCount, 'unreadCount', 0),
      ],
    );

    blocTest<NotificationBloc, NotificationState>(
      'emits NotificationError when markAsRead fails',
      build: () {
        when(() => dataSource.markAsRead('n1'))
            .thenThrow(Exception('Server error'));
        return NotificationBloc(dataSource);
      },
      seed: () => NotificationsLoaded(
        items: [notificationModel1, notificationModel2],
        unreadCount: 1,
      ),
      act: (bloc) => bloc.add(const MarkNotificationAsRead('n1')),
      expect: () => [
        isA<NotificationError>(),
      ],
    );
  });

  group('NewNotificationReceived', () {
    final newNotification = NotificationModel(
      id: 'n3',
      userId: 'user1',
      title: 'Notifikasi Baru',
      message: 'Ada notifikasi baru',
      type: 'system',
      isRead: false,
      created: now,
    );

    blocTest<NotificationBloc, NotificationState>(
      'adds new notification to the top of the list and updates unread count',
      build: () => NotificationBloc(dataSource),
      seed: () => NotificationsLoaded(
        items: [notificationModel1, notificationModel2],
        unreadCount: 1,
      ),
      act: (bloc) => bloc.add(NewNotificationReceived(newNotification)),
      expect: () => [
        NotificationsLoaded(
          items: [newNotification, notificationModel1, notificationModel2],
          unreadCount: 2,
        ),
      ],
    );
  });
}
