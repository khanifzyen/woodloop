import 'dart:async';
import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:pocketbase/pocketbase.dart';
import 'package:woodloop_app/features/auth/domain/entities/user.dart';
import 'package:woodloop_app/features/auth/domain/repositories/auth_repository.dart';
import 'package:woodloop_app/features/auth/presentation/bloc/auth_bloc.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  late MockAuthRepository authRepository;

  // Sample user for testing
  const verifiedUser = User(
    id: 'user1',
    email: 'verified@woodloop.id',
    name: 'Verified User',
    role: 'generator',
    isVerified: true,
  );

  const unverifiedUser = User(
    id: 'user2',
    email: 'unverified@woodloop.id',
    name: 'Unverified User',
    role: 'generator',
    isVerified: false,
  );

  setUp(() {
    authRepository = MockAuthRepository();

    // Default mock responses to avoid null errors during auto-dispatch
    when(() => authRepository.authStateChanges)
        .thenAnswer((_) => const Stream.empty());
    when(() => authRepository.getCurrentUser())
        .thenAnswer((_) async => null);
    when(() => authRepository.logout()).thenAnswer((_) async {});
  });

  tearDown(() {
    // Re-set the mock to clean state
    reset(authRepository);
  });

  group('AuthBloc - login', () {
    blocTest<AuthBloc, AuthState>(
      'emits [AuthLoading, Authenticated] when login is successful '
      'for verified user',
      build: () {
        when(() => authRepository.login(any(), any()))
            .thenAnswer((_) async => verifiedUser);
        return AuthBloc(authRepository);
      },
      act: (bloc) => bloc.add(
        const AuthLoginRequested(
          email: 'verified@woodloop.id',
          password: 'password123',
        ),
      ),
      skip: 1, // skip Unauthenticated from auto-dispatch
      expect: () => [AuthLoading(), const Authenticated(verifiedUser)],
    );

    blocTest<AuthBloc, AuthState>(
      'emits [AuthLoading, AuthUnverifiedEmail, Unauthenticated] when '
      'user email is not verified',
      build: () {
        when(() => authRepository.login(any(), any()))
            .thenAnswer((_) async => unverifiedUser);
        return AuthBloc(authRepository);
      },
      act: (bloc) => bloc.add(
        const AuthLoginRequested(
          email: 'unverified@woodloop.id',
          password: 'password123',
        ),
      ),
      skip: 1, // skip Unauthenticated from auto-dispatch
      expect: () => [
        AuthLoading(),
        const AuthUnverifiedEmail('unverified@woodloop.id'),
        Unauthenticated(),
      ],
    );

    blocTest<AuthBloc, AuthState>(
      'emits [AuthLoading, AuthError, Unauthenticated] when login throws',
      build: () {
        when(() => authRepository.login(any(), any()))
            .thenThrow(Exception('Invalid credentials'));
        return AuthBloc(authRepository);
      },
      act: (bloc) => bloc.add(
        const AuthLoginRequested(
          email: 'bad@woodloop.id',
          password: 'wrong',
        ),
      ),
      skip: 1, // skip Unauthenticated from auto-dispatch
      expect: () => [
        AuthLoading(),
        isA<AuthError>(),
        Unauthenticated(),
      ],
    );
  });

  group('AuthBloc - logout', () {
    blocTest<AuthBloc, AuthState>(
      'emits [Unauthenticated] when logout is requested',
      build: () => AuthBloc(authRepository),
      act: (bloc) => bloc.add(AuthLogoutRequested()),
      // Auto-dispatch already emitted Unauthenticated, logout is deduplicated
      expect: () => [Unauthenticated()],
    );
  });
}
