import 'package:equatable/equatable.dart';

class UserDocument extends Equatable {
  final String id;
  final String userId;
  final String docType;
  final String docName;
  final String file; // Filename/URL from PocketBase
  final bool verified;
  final String? notes;

  const UserDocument({
    required this.id,
    required this.userId,
    required this.docType,
    required this.docName,
    required this.file,
    required this.verified,
    this.notes,
  });

  @override
  List<Object?> get props => [
    id,
    userId,
    docType,
    docName,
    file,
    verified,
    notes,
  ];
}
