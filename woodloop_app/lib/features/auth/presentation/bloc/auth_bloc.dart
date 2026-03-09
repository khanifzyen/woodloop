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
        } else {
          // Both verified and unverified admin users are allowed to "authenticate".
          // The router will intercept those without isAdminVerified.
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
      } else {
        // Document Verification Check - only for roles that need them
        // NOTE: We no longer block login for missing/unverified documents here.
        // GoRouter will redirect users with !user.isAdminVerified to the RegistrationStatusPage,
        // where they can upload/fix their documents.
        // The check below is kept only if you explicitly want to emit `AuthDocumentsUnverified`
        // before they get to the RegistrationStatusPage, but since we want them to use the app's
        // document manager, we should just let them authenticate.

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
