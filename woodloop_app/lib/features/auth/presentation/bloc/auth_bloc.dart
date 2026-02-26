import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';

part 'auth_event.dart';
part 'auth_state.dart';

@injectable
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;
  StreamSubscription<AuthStoreEvent>? _authStoreSubscription;

  AuthBloc(this._authRepository) : super(AuthInitial()) {
    on<AuthCheckRequested>(_onAuthCheckRequested);
    on<AuthLoginRequested>(_onAuthLoginRequested);
    on<AuthRegisterRequested>(_onAuthRegisterRequested);
    on<AuthLogoutRequested>(_onAuthLogoutRequested);
    on<_AuthStoreChanged>(_onAuthStoreChanged);

    // Initial session check
    add(AuthCheckRequested());

    // Listen to remote changes automatically (like token expiry or external logout via JS)
    _authStoreSubscription = _authRepository.authStateChanges.listen((event) {
      add(_AuthStoreChanged(event));
    });
  }

  Future<void> _onAuthCheckRequested(
    AuthCheckRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      final user = await _authRepository.getCurrentUser();
      if (user != null) {
        emit(Authenticated(user));
      } else {
        emit(Unauthenticated());
      }
    } catch (_) {
      emit(Unauthenticated());
    }
  }

  Future<void> _onAuthLoginRequested(
    AuthLoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final user = await _authRepository.login(event.email, event.password);
      emit(Authenticated(user));
    } catch (e) {
      // In a real app we'd parse ClientException from PocketBase
      emit(AuthError(e.toString()));
      emit(Unauthenticated());
    }
  }

  Future<void> _onAuthRegisterRequested(
    AuthRegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      await _authRepository.register(event.data);
      // Auto-login happens in datasource if email/password passed.
      // If login failed but register succeed we might not be authenticated properly without auth token.
      // Safe fallback check:
      final currentUser = await _authRepository.getCurrentUser();
      if (currentUser != null) {
        emit(Authenticated(currentUser));
      } else {
        emit(Unauthenticated());
      }
    } catch (e) {
      emit(AuthError(e.toString()));
      emit(Unauthenticated());
    }
  }

  Future<void> _onAuthLogoutRequested(
    AuthLogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await _authRepository.logout();
    emit(Unauthenticated());
  }

  void _onAuthStoreChanged(_AuthStoreChanged event, Emitter<AuthState> emit) {
    if (event.event.token.isEmpty || event.event.record == null) {
      emit(Unauthenticated());
    } else {
      // Typically, auth model updates wouldn't directly re-emit unless user entity updates.
      // In this app, we're relying on the pb instance to give us current user.
      _authRepository.getCurrentUser().then((user) {
        if (user != null && !isClosed) {
          add(AuthCheckRequested()); // Lazy loop to reuse existing check
        }
      });
    }
  }

  @override
  Future<void> close() {
    _authStoreSubscription?.cancel();
    return super.close();
  }
}
