part of 'auth_bloc.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthCheckRequested extends AuthEvent {}

class AuthLoginRequested extends AuthEvent {
  final String email;
  final String password;

  const AuthLoginRequested({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class AuthRegisterRequested extends AuthEvent {
  final Map<String, dynamic> data;

  const AuthRegisterRequested(this.data);

  @override
  List<Object?> get props => [data];
}

class AuthLogoutRequested extends AuthEvent {}

class _AuthStoreChanged extends AuthEvent {
  final AuthStoreEvent event;

  const _AuthStoreChanged(this.event);

  @override
  List<Object?> get props => [event];
}
