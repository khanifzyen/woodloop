part of 'user_profile_bloc.dart';

abstract class UserProfileEvent extends Equatable {
  const UserProfileEvent();

  @override
  List<Object?> get props => [];
}

class UserProfileFetchRequested extends UserProfileEvent {
  final String userId;

  const UserProfileFetchRequested(this.userId);

  @override
  List<Object?> get props => [userId];
}

class UserProfileUpdateRequested extends UserProfileEvent {
  final String userId;
  final Map<String, dynamic> data;

  const UserProfileUpdateRequested({required this.userId, required this.data});

  @override
  List<Object?> get props => [userId, data];
}
