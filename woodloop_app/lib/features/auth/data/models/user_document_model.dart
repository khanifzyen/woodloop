import 'package:pocketbase/pocketbase.dart';
import '../../domain/entities/user_document.dart';

class UserDocumentModel extends UserDocument {
  const UserDocumentModel({
    required super.id,
    required super.userId,
    required super.docType,
    required super.docName,
    required super.file,
    required super.verified,
    super.notes,
  });

  factory UserDocumentModel.fromRecord(RecordModel record) {
    return UserDocumentModel(
      id: record.id,
      userId: record.getStringValue('user'),
      docType: record.getStringValue('doc_type'),
      docName: record.getStringValue('doc_name'),
      file: record.getStringValue('file'),
      verified: record.getBoolValue('verified'),
      notes: record.getStringValue('notes'),
    );
  }
}
