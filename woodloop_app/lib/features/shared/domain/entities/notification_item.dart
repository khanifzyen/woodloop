import 'package:equatable/equatable.dart';

class NotificationItem extends Equatable {
  final String id;
  final String userId;
  final String title;
  final String message;
  final String type; // order, payment, pickup, bid, system
  final bool isRead;
  final DateTime created;

  const NotificationItem({
    required this.id,
    required this.userId,
    required this.title,
    required this.message,
    required this.type,
    this.isRead = false,
    required this.created,
  });

  @override
  List<Object?> get props => [
    id,
    userId,
    title,
    message,
    type,
    isRead,
    created,
  ];
}
