import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import 'package:pocketbase/pocketbase.dart';

import '../../domain/entities/user.dart';
import '../../domain/entities/user_document.dart';
import '../../domain/repositories/auth_repository.dart';

part 'auth_event.dart';
part 'auth_state.dart';

@lazySingleton
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;
  StreamSubscription<AuthStoreEvent>? _authStoreSubscription;

  AuthBloc(this._authRepository) : super(AuthInitial()) {
    on<AuthCheckRequested>(_onAuthCheckRequested);
    on<AuthLoginRequested>(_onAuthLoginRequested);
    on<AuthRegisterRequested>(_onAuthRegisterRequested);
    on<AuthLogoutRequested>(_onAuthLogoutRequested);
    on<AuthUserRefreshRequested>(_onAuthUserRefreshRequested);
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
        if (!user.isVerified) {
          await _authRepository.logout();
          emit(AuthUnverifiedEmail(user.email));
          emit(Unauthenticated());
        } else if (!user.isAdminVerified) {
          await _authRepository.logout();
          emit(const AuthAdminUnverified());
          emit(Unauthenticated());
        } else {
          emit(Authenticated(user));
        }
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
      debugPrint('[AuthBloc] Attempting login for ${event.email}...');
      final user = await _authRepository.login(event.email, event.password);
      debugPrint(
        '[AuthBloc] Login success — role: ${user.role}, isVerified: ${user.isVerified}, isAdminVerified: ${user.isAdminVerified}',
      );
      if (!user.isVerified) {
        debugPrint('[AuthBloc] Blocking: email not verified');
        await _authRepository.logout();
        emit(AuthUnverifiedEmail(event.email));
        emit(Unauthenticated());
      } else if (!user.isAdminVerified) {
        debugPrint('[AuthBloc] Blocking: admin not verified');
        await _authRepository.logout();
        emit(const AuthAdminUnverified());
        emit(Unauthenticated());
      } else {
        // Document Verification Check
        final rolesRequiringDocs = [
          'supplier',
          'generator',
          'aggregator',
          'converter',
        ];
        if (rolesRequiringDocs.contains(user.role)) {
          final docs = await _authRepository.fetchUserDocuments(user.id);
          final hasUnverifiedDocs = docs.any((doc) => !doc.verified);

          if (hasUnverifiedDocs || docs.isEmpty) {
            debugPrint('[AuthBloc] Blocking: documents unverified or empty');
            await _authRepository.logout();
            emit(AuthDocumentsUnverified(docs));
            emit(Unauthenticated());
            return;
          }
        }

        debugPrint('[AuthBloc] Emitting Authenticated');
        emit(Authenticated(user));
      }
    } catch (e) {
      debugPrint('[AuthBloc] Login error: $e');
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
        emit(AuthRegisterSuccess(currentUser));
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

  Future<void> _onAuthUserRefreshRequested(
    AuthUserRefreshRequested event,
    Emitter<AuthState> emit,
  ) async {
    final user = await _authRepository.getCurrentUser();
    if (user != null) {
      emit(Authenticated(user));
    }
  }

  Future<void> _onAuthStoreChanged(
    _AuthStoreChanged event,
    Emitter<AuthState> emit,
  ) async {
    debugPrint(
      '[AuthBloc] AuthStoreChanged — token empty: ${event.event.token.isEmpty}',
    );
    if (event.event.token.isEmpty || event.event.record == null) {
      emit(Unauthenticated());
    } else {
      // Don't re-fetch here to avoid overriding an in-progress login state.
      // AuthCheckRequested will be dispatched from the initial check.
    }
  }

  @override
  Future<void> close() {
    _authStoreSubscription?.cancel();
    return super.close();
  }
}
