import '../../domain/entities/notification_item.dart';
import 'package:pocketbase/pocketbase.dart';

class NotificationModel extends NotificationItem {
  const NotificationModel({
    required super.id,
    required super.userId,
    required super.title,
    required super.message,
    required super.type,
    super.isRead,
    super.referenceType,
    super.referenceId,
    required super.created,
  });

  factory NotificationModel.fromRecord(RecordModel record) {
    return NotificationModel(
      id: record.id,
      userId: record.getStringValue('user'),
      title: record.getStringValue('title'),
      message: record.getStringValue('body'),
      type: record.getStringValue('type'),
      isRead: record.getBoolValue('is_read'),
      referenceType: record.getStringValue('reference_type'),
      referenceId: record.getStringValue('reference_id'),
      created:
          DateTime.tryParse(record.getStringValue('created')) ?? DateTime.now(),
    );
  }
}
