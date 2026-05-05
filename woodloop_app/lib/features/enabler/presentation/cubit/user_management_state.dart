part of 'user_management_cubit.dart';

abstract class UserManagementState extends Equatable {
  const UserManagementState();
  @override
  List<Object?> get props => [];
}

class UserManagementInitial extends UserManagementState {}

class UserManagementLoading extends UserManagementState {}

class UserManagementLoaded extends UserManagementState {
  final List<UserSummary> users;
  final int totalUsers;
  final int verifiedCount;
  final int unverifiedCount;
  final String? activeFilter;

  const UserManagementLoaded({
    required this.users,
    required this.totalUsers,
    required this.verifiedCount,
    required this.unverifiedCount,
    this.activeFilter,
  });

  @override
  List<Object?> get props => [users, totalUsers, verifiedCount, unverifiedCount, activeFilter];
}

class UserManagementError extends UserManagementState {
  final String message;
  const UserManagementError(this.message);
  @override
  List<Object?> get props => [message];
}
