import 'package:equatable/equatable.dart';
import '../../../../features/auth/domain/entities/user_document.dart';

abstract class UserDocumentsState extends Equatable {
  const UserDocumentsState();

  @override
  List<Object> get props => [];
}

class UserDocumentsInitial extends UserDocumentsState {}

class UserDocumentsLoading extends UserDocumentsState {}

class UserDocumentsLoaded extends UserDocumentsState {
  final List<UserDocument> documents;

  const UserDocumentsLoaded(this.documents);

  @override
  List<Object> get props => [documents];
}

class UserDocumentsError extends UserDocumentsState {
  final String message;

  const UserDocumentsError(this.message);

  @override
  List<Object> get props => [message];
}

class UserDocumentsUploading extends UserDocumentsState {}

class UserDocumentsUploadSuccess extends UserDocumentsState {}
