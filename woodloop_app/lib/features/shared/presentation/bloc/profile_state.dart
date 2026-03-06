import 'package:equatable/equatable.dart';
import '../../../../features/auth/domain/entities/user_document.dart';

abstract class ProfileState extends Equatable {
  const ProfileState();

  @override
  List<Object?> get props => [];
}

class ProfileInitial extends ProfileState {}

class ProfileLoading extends ProfileState {}

class ProfileLoaded extends ProfileState {
  final List<UserDocument> documents;

  const ProfileLoaded(this.documents);

  @override
  List<Object?> get props => [documents];
}

class ProfileError extends ProfileState {
  final String message;

  const ProfileError(this.message);

  @override
  List<Object?> get props => [message];
}

class ProfileUpdateSuccess extends ProfileState {}
